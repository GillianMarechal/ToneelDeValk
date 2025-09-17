param(
	[string]$FtpHost = $env:FTP_HOST,
	[string]$Username = $env:FTP_USER,
	[string]$Password = $env:FTP_PASS,
	[string]$PasswordBase64 = $env:FTP_PASS_BASE64,
	[string]$SrcRemote = "",
	[string]$DestRemote = "/assets/gallery",
	[bool]$Secure = $true,
	[string]$LocalCache = "wp-uploads-cache",
	[string]$LocalGallery = "static-export/assets/gallery"
)

# Resolve password: prefer base64 if provided
if (-not [string]::IsNullOrEmpty($PasswordBase64)) {
	try { $Password = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($PasswordBase64)) } catch { Write-Error "Invalid FTP_PASS_BASE64"; exit 1 }
}

if (-not $FtpHost -or -not $Username -or -not $Password) { Write-Error "Missing FTP creds"; exit 1 }

function New-FtpReq {
	param([string]$Uri,[string]$Method)
	$r = [System.Net.FtpWebRequest]::Create($Uri)
	$r.Method = $Method
	$r.Credentials = New-Object System.Net.NetworkCredential($Username,$Password)
	$r.UseBinary = $true; $r.UsePassive = $true; $r.KeepAlive = $false; $r.EnableSsl = $Secure
	return $r
}

function List-Remote {
	param([string]$Uri)
	try {
		$req = New-FtpReq -Uri $Uri -Method ([System.Net.WebRequestMethods+Ftp]::ListDirectoryDetails)
		$resp = $req.GetResponse(); $sr = New-Object IO.StreamReader($resp.GetResponseStream())
		$text = $sr.ReadToEnd(); $sr.Close(); $resp.Close()
		return $text -split "`n" | Where-Object { $_ -and $_.Trim() -ne '' }
	} catch { return @() }
}

function Ensure-LocalDir { param([string]$p) if (-not (Test-Path $p)) { New-Item -ItemType Directory -Path $p | Out-Null } }

function Detect-UploadsPath {
	$candidates = @(
		"/customers/a/6/a/toneeldevalk.be/httpd.www/wp-content/uploads",
		"/httpd.www/wp-content/uploads",
		"/wp-content/uploads",
		"/wp-content",
		"/uploads"
	)
	foreach ($cand in $candidates) {
		$uri = "ftp://$FtpHost" + $cand
		$ls = List-Remote -Uri $uri
		if ($ls.Count -gt 0) { return $cand }
	}
	return $null
}

function Download-Recursive {
	param([string]$RemoteBase,[string]$Rel='')
	$remoteUri = "ftp://$FtpHost" + ($RemoteBase.TrimEnd('/')) + '/' + $Rel.Trim('/').Replace('\\','/').Trim('/')
	if ($remoteUri.EndsWith('/')) { $remoteUri = $remoteUri.TrimEnd('/') }
	$entries = List-Remote -Uri $remoteUri
	foreach ($line in $entries) {
		# Parse UNIX-like listing
		$parts = $line -split '\s+'; if ($parts.Length -lt 9) { continue }
		$isDir = $parts[0].StartsWith('d')
		$name = ($parts[8..($parts.Length-1)] -join ' ')
		if ($name -eq '.' -or $name -eq '..') { continue }
		$childRel = if ($Rel) { "$Rel/$name" } else { $name }
		if ($isDir) {
			Download-Recursive -RemoteBase $RemoteBase -Rel $childRel
		} else {
			# Only download common image types
			if ($name -match '\.(jpg|jpeg|png|gif|webp)$') {
				$localPath = Join-Path $LocalCache $childRel
				Ensure-LocalDir -p (Split-Path $localPath)
				try {
					$dlReq = New-FtpReq -Uri ("$remoteUri/$name") -Method ([System.Net.WebRequestMethods+Ftp]::DownloadFile)
					$resp = $dlReq.GetResponse(); $rs = $resp.GetResponseStream()
					$fs = [IO.File]::Open($localPath,[IO.FileMode]::Create)
					$rs.CopyTo($fs); $fs.Close(); $rs.Close(); $resp.Close()
					Write-Host ("Downloaded: {0}" -f $childRel)
				} catch {
					Write-Host ("Skip download {0}: {1}" -f $childRel, $_.Exception.Message)
				}
			}
		}
	}
}

function Join-FtpPath { param([string]$b,[string]$r) $b.TrimEnd('/') + '/' + $r.TrimStart('/') }
function Ensure-RemoteDir {
	param([string]$Base,[string]$Rel)
	$parts = $Rel.Split('/') | Where-Object { $_ -ne '' }
	$cur = $Base
	foreach ($p in $parts) {
		$cur = Join-FtpPath -b $cur -r $p
		try { (New-FtpReq -Uri $cur -Method ([System.Net.WebRequestMethods+Ftp]::ListDirectory)).GetResponse().Close() }
		catch { try { (New-FtpReq -Uri $cur -Method ([System.Net.WebRequestMethods+Ftp]::MakeDirectory)).GetResponse().Close(); Write-Host ("Created: {0}" -f $cur) } catch {} }
	}
}

function Upload-From-Local {
	param([string]$LocalBase,[string]$RemoteBase,[string]$Rel='')
	$localDir = if ($Rel) { Join-Path $LocalBase $Rel } else { $LocalBase }
	Get-ChildItem -Path $localDir -Directory -Recurse:$false | ForEach-Object {
		$childRel = if ($Rel) { Join-Path $Rel $_.Name } else { $_.Name }
		Ensure-RemoteDir -Base $RemoteBase -Rel ($childRel.Replace('\\','/'))
		Upload-From-Local -LocalBase $LocalBase -RemoteBase $RemoteBase -Rel $childRel
	}
	Get-ChildItem -Path $localDir -File -Recurse:$false | ForEach-Object {
		$remoteUri = Join-FtpPath -b $RemoteBase -r (($Rel.Replace('\\','/').Trim('/') + '/' + $_.Name).TrimStart('/'))
		try {
			$bytes = [IO.File]::ReadAllBytes($_.FullName)
			$put = New-FtpReq -Uri $remoteUri -Method ([System.Net.WebRequestMethods+Ftp]::UploadFile)
			$put.ContentLength = $bytes.Length
			$st = $put.GetRequestStream(); $st.Write($bytes,0,$bytes.Length); $st.Close(); $put.GetResponse().Close()
			Write-Host ("Uploaded: {0}" -f $remoteUri)
		} catch {
			Write-Host ("Skip upload {0}: {1}" -f $remoteUri, $_.Exception.Message)
		}
	}
}

function Generate-GalleryJson {
	param([string]$LocalGalleryPath,[string]$ApiBasePath)
	$items = @()
	Get-ChildItem -Path $LocalGalleryPath -Recurse -File | ForEach-Object {
		$rel = $_.FullName.Substring($LocalGalleryPath.Length).TrimStart('\\','/')
		$parts = $rel.Split([char]'/')
		$category = if ($parts.Length -gt 1) { $parts[0] } else { "gallery" }
		$items += [pscustomobject]@{
			id = [Math]::Abs(($_.FullName.GetHashCode()))
			title = $_.BaseName
			description = ""
			image = "/assets/gallery/" + ($rel.Replace('\\','/'))
			category = $category
		}
	}
	# Write main file
	$apiDir = Join-Path $ApiBasePath "api"
	$galleryFile = Join-Path $apiDir "gallery.json"
	if (-not (Test-Path $apiDir)) { New-Item -ItemType Directory -Path $apiDir | Out-Null }
	$items | ConvertTo-Json -Depth 5 | Out-File -FilePath $galleryFile -Encoding UTF8
	# Write per-category
	$galleryDir = Join-Path $apiDir "gallery"
	if (-not (Test-Path $galleryDir)) { New-Item -ItemType Directory -Path $galleryDir | Out-Null }
	$items | Group-Object -Property category | ForEach-Object {
		$catName = $_.Name.ToLower().Replace(' ','-')
		$catPath = Join-Path $galleryDir ("{0}.json" -f $catName)
		$_.Group | ConvertTo-Json -Depth 5 | Out-File -FilePath $catPath -Encoding UTF8
	}
}

Write-Host "Syncing WordPress uploads -> gallery" -ForegroundColor Cyan

# Detect uploads source if not provided
if (-not $SrcRemote -or $SrcRemote.Trim() -eq '') {
	$detected = Detect-UploadsPath
	if (-not $detected) { Write-Warning "Could not detect uploads path. Skipping download step." }
	else { $SrcRemote = $detected; Write-Host ("Detected uploads path: {0}" -f $SrcRemote) }
}

# 1) Download remote uploads to local cache if source known
if ($SrcRemote -and $SrcRemote.Trim() -ne '') {
	Download-Recursive -RemoteBase $SrcRemote -Rel ''
} else {
	Write-Host "No source available for download; proceeding with existing local cache if any."
}

# 2) Copy to static-export/assets/gallery locally
Ensure-LocalDir -p $LocalGallery
if (Test-Path $LocalCache) {
	Copy-Item -Path (Join-Path $LocalCache '*') -Destination $LocalGallery -Recurse -Force
}

# 3) Generate API JSON for gallery
$staticExportRoot = "static-export"
Generate-GalleryJson -LocalGalleryPath $LocalGallery -ApiBasePath $staticExportRoot

# 4) Upload gallery assets
$remoteBase = "ftp://$FtpHost" + $DestRemote
Ensure-RemoteDir -Base $remoteBase -Rel ''
Upload-From-Local -LocalBase $LocalGallery -RemoteBase $remoteBase -Rel ''

# 5) Upload API JSON
$remoteApiBase = "ftp://$FtpHost/api"
Ensure-RemoteDir -Base $remoteApiBase -Rel 'gallery'
Upload-From-Local -LocalBase (Join-Path $staticExportRoot 'api') -RemoteBase ("ftp://$FtpHost/api") -Rel 'gallery'

Write-Host "✅ Sync complete" -ForegroundColor Green
