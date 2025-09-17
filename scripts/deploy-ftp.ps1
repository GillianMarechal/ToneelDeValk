param(
	[string]$SourceDir = "static-export",
	[string]$FtpHost = $env:FTP_HOST,
	[string]$Username = $env:FTP_USER,
	[string]$Password = $env:FTP_PASS,
	[string]$PasswordBase64 = $env:FTP_PASS_BASE64,
	[string]$RemoteDir = $env:FTP_DIR,
	[bool]$Secure = $false
)

# Resolve Secure from env if provided
if ($env:FTP_SECURE) {
	try { $Secure = [System.Convert]::ToBoolean($env:FTP_SECURE) } catch { $Secure = $false }
}

# Resolve password: prefer base64 if provided
if (-not [string]::IsNullOrEmpty($PasswordBase64)) {
	try {
		$Password = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($PasswordBase64))
	} catch {
		Write-Error "Invalid FTP_PASS_BASE64 value. Provide valid Base64 or use FTP_PASS."
		exit 1
	}
}

if (-not $FtpHost -or -not $Username -or -not $Password) {
	Write-Error "Missing FTP credentials. Please set FTP_HOST, FTP_USER, and either FTP_PASS or FTP_PASS_BASE64. Optionally FTP_DIR and FTP_SECURE (true/false)."
	exit 1
}

if (-not (Test-Path $SourceDir)) {
	Write-Error "Source directory '$SourceDir' not found. Run npm run ultimate-script first."
	exit 1
}

function New-FtpRequest {
	param(
		[string]$Uri,
		[string]$Method
	)
	$request = [System.Net.FtpWebRequest]::Create($Uri)
	$request.Method = $Method
	$request.Credentials = New-Object System.Net.NetworkCredential($Username, $Password)
	$request.UseBinary = $true
	$request.UsePassive = $true
	$request.KeepAlive = $false
	$request.EnableSsl = $Secure
	return $request
}

function Join-FtpPath {
	param(
		[string]$Base,
		[string]$Rel
	)
	$baseTrim = $Base.TrimEnd('/')
	$relTrim = $Rel.TrimStart('/')
	if ($relTrim -eq '') { return $baseTrim }
	return "$baseTrim/$relTrim"
}

function Ensure-FtpDirectory {
	param(
		[string]$BaseUri,
		[string]$PathRel
	)
	if ([string]::IsNullOrEmpty($PathRel)) { return }
	$parts = $PathRel -split '/' | Where-Object { $_ -ne '' }
	$current = $BaseUri
	foreach ($part in $parts) {
		$current = Join-FtpPath -Base $current -Rel $part
		try {
			# Try to get listing to see if exists
			$listReq = New-FtpRequest -Uri $current -Method ([System.Net.WebRequestMethods+Ftp]::ListDirectory)
			$listReq.GetResponse().Close()
		} catch {
			try {
				$mkReq = New-FtpRequest -Uri $current -Method ([System.Net.WebRequestMethods+Ftp]::MakeDirectory)
				$mkReq.GetResponse().Close()
				Write-Host "Created directory: $current"
			} catch {
				Write-Host "Skipping create (may already exist or not permitted): $current"
			}
		}
	}
}

function Upload-File {
	param(
		[string]$LocalPath,
		[string]$RemoteUri
	)
	try {
		$bytes = [System.IO.File]::ReadAllBytes($LocalPath)
		$putReq = New-FtpRequest -Uri $RemoteUri -Method ([System.Net.WebRequestMethods+Ftp]::UploadFile)
		$putReq.ContentLength = $bytes.Length
		$reqStream = $putReq.GetRequestStream()
		$reqStream.Write($bytes, 0, $bytes.Length)
		$reqStream.Close()
		$resp = $putReq.GetResponse()
		$resp.Close()
		Write-Host "Uploaded: $LocalPath -> $RemoteUri"
	} catch {
		Write-Error "Failed to upload $($LocalPath): $($_.Exception.Message)"
		throw
	}
}

function Precreate-Directories {
	param(
		[string]$RemoteBaseUri
	)
	$dirs = @(
		"api",
		"api/cast",
		"api/news",
		"api/productions",
		"api/gallery",
		"assets",
		"assets/Oldsite"
	)
	foreach ($d in $dirs) {
		Ensure-FtpDirectory -BaseUri $RemoteBaseUri -PathRel $d
	}
}

function Upload-Directory {
	param(
		[string]$LocalBase,
		[string]$RemoteBaseUri,
		[string]$RelPath = ''
	)
	$localDir = if ($RelPath) { Join-Path $LocalBase $RelPath } else { $LocalBase }
	$remoteDirUri = if ($RelPath) { Join-FtpPath -Base $RemoteBaseUri -Rel $RelPath.Replace('\\','/') } else { $RemoteBaseUri }

	# Ensure remote directory exists
	Ensure-FtpDirectory -BaseUri $RemoteBaseUri -PathRel $RelPath.Replace('\\','/').TrimStart('/')

	# Upload files in this directory
	Get-ChildItem -Path $localDir -File -Recurse:$false | ForEach-Object {
		$remoteFileUri = Join-FtpPath -Base $remoteDirUri -Rel $_.Name
		Upload-File -LocalPath $_.FullName -RemoteUri $remoteFileUri
	}

	# Recurse into subdirectories
	Get-ChildItem -Path $localDir -Directory -Recurse:$false | ForEach-Object {
		$nextRel = if ($RelPath) { Join-Path $RelPath $_.Name } else { $_.Name }
		Upload-Directory -LocalBase $LocalBase -RemoteBaseUri $RemoteBaseUri -RelPath $nextRel
	}
}

$root = "ftp://$FtpHost"
if ($RemoteDir) {
	$root = Join-FtpPath -Base $root -Rel $RemoteDir
}

Write-Host "Starting FTP deploy" -ForegroundColor Cyan
Write-Host "Host: $FtpHost" -ForegroundColor Cyan
Write-Host "Remote root: $root" -ForegroundColor Cyan
Write-Host "Secure (FTPS): $Secure" -ForegroundColor Cyan

try {
	# Pre-create common directories
	Precreate-Directories -RemoteBaseUri $root
	# Upload the entire tree
	Upload-Directory -LocalBase $SourceDir -RemoteBaseUri $root
	Write-Host "✅ FTP deploy completed successfully" -ForegroundColor Green
} catch {
	Write-Error "❌ FTP deploy failed: $($_.Exception.Message)"
	exit 1
}
