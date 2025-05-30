import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Upload, Download, Globe, FileText, Image, Users } from "lucide-react";

export default function Admin() {
  const [wpSiteUrl, setWpSiteUrl] = useState("");
  const [csvContent, setCsvContent] = useState("");
  const { toast } = useToast();

  const wordpressMigration = useMutation({
    mutationFn: async ({ wpSiteUrl, contentType }: { wpSiteUrl: string; contentType: string }) => {
      return await apiRequest("POST", "/api/migrate/wordpress", { wpSiteUrl, contentType });
    },
    onSuccess: (_, { contentType }) => {
      toast({
        title: "Migration Successful",
        description: `Successfully migrated ${contentType} from WordPress`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Migration Failed",
        description: error.message || "Failed to migrate from WordPress",
        variant: "destructive",
      });
    },
  });

  const csvImport = useMutation({
    mutationFn: async ({ csvContent, contentType }: { csvContent: string; contentType: string }) => {
      return await apiRequest("POST", "/api/migrate/csv", { csvContent, contentType });
    },
    onSuccess: (_, { contentType }) => {
      toast({
        title: "Import Successful",
        description: `Successfully imported ${contentType} from CSV`,
      });
      setCsvContent("");
    },
    onError: (error: any) => {
      toast({
        title: "Import Failed",
        description: error.message || "Failed to import from CSV",
        variant: "destructive",
      });
    },
  });

  const handleWordPressMigration = (contentType: string) => {
    if (!wpSiteUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter your WordPress site URL",
        variant: "destructive",
      });
      return;
    }
    wordpressMigration.mutate({ wpSiteUrl: wpSiteUrl.trim(), contentType });
  };

  const handleCSVImport = (contentType: string) => {
    if (!csvContent.trim()) {
      toast({
        title: "Error",
        description: "Please paste your CSV content",
        variant: "destructive",
      });
      return;
    }
    csvImport.mutate({ csvContent: csvContent.trim(), contentType });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/csv") {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCsvContent(e.target?.result as string);
      };
      reader.readAsText(file);
    } else {
      toast({
        title: "Invalid File",
        description: "Please upload a CSV file",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-playfair font-bold text-theatre-navy mb-4">
            Content Migration Tools
          </h1>
          <p className="text-xl text-theatre-charcoal">
            Import your existing content from WordPress or CSV files
          </p>
        </div>

        <Tabs defaultValue="wordpress" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="wordpress" className="flex items-center">
              <Globe className="w-4 h-4 mr-2" />
              WordPress Import
            </TabsTrigger>
            <TabsTrigger value="csv" className="flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              CSV Import
            </TabsTrigger>
          </TabsList>

          <TabsContent value="wordpress">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-theatre-red" />
                  WordPress Migration
                </CardTitle>
                <CardDescription>
                  Import content directly from your WordPress site using the REST API
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-theatre-navy mb-2">
                    WordPress Site URL
                  </label>
                  <Input
                    placeholder="https://youroldsite.com"
                    value={wpSiteUrl}
                    onChange={(e) => setWpSiteUrl(e.target.value)}
                    className="max-w-md"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Enter the full URL of your WordPress site (must have REST API enabled)
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button
                    onClick={() => handleWordPressMigration("news")}
                    disabled={wordpressMigration.isPending}
                    className="bg-theatre-red hover:bg-red-700 text-white"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Import News
                  </Button>

                  <Button
                    onClick={() => handleWordPressMigration("productions")}
                    disabled={wordpressMigration.isPending}
                    className="bg-theatre-gold hover:bg-yellow-600 text-theatre-navy"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Import Productions
                  </Button>

                  <Button
                    onClick={() => handleWordPressMigration("gallery")}
                    disabled={wordpressMigration.isPending}
                    className="bg-theatre-navy hover:bg-theatre-charcoal text-white"
                  >
                    <Image className="w-4 h-4 mr-2" />
                    Import Gallery
                  </Button>

                  <Button
                    onClick={() => handleWordPressMigration("all")}
                    disabled={wordpressMigration.isPending}
                    variant="outline"
                    className="border-theatre-navy text-theatre-navy hover:bg-theatre-navy hover:text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Import All
                  </Button>
                </div>

                {wordpressMigration.isPending && (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-theatre-red mr-2"></div>
                    <span className="text-theatre-charcoal">Migrating content...</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="csv">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-theatre-red" />
                  CSV Import
                </CardTitle>
                <CardDescription>
                  Upload or paste CSV data to import content in bulk
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-theatre-navy mb-2">
                    Upload CSV File
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="csv-upload"
                    />
                    <label
                      htmlFor="csv-upload"
                      className="cursor-pointer inline-flex items-center px-4 py-2 border border-theater-navy text-theatre-navy hover:bg-theatre-navy hover:text-white rounded-lg transition-colors"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-theatre-navy mb-2">
                    Or Paste CSV Content
                  </label>
                  <Textarea
                    placeholder="title,excerpt,content,date,category,featured&#10;Example Article,Short description,Full content here,2024-01-01,News,false"
                    value={csvContent}
                    onChange={(e) => setCsvContent(e.target.value)}
                    rows={8}
                    className="font-mono text-sm"
                  />
                </div>

                <div className="flex space-x-4">
                  <Button
                    onClick={() => handleCSVImport("news")}
                    disabled={csvImport.isPending}
                    className="bg-theatre-red hover:bg-red-700 text-white"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Import as News
                  </Button>

                  <Button
                    onClick={() => handleCSVImport("productions")}
                    disabled={csvImport.isPending}
                    className="bg-theatre-gold hover:bg-yellow-600 text-theatre-navy"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Import as Productions
                  </Button>
                </div>

                {csvImport.isPending && (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-theatre-red mr-2"></div>
                    <span className="text-theatre-charcoal">Importing content...</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Instructions */}
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">WordPress Migration Guide</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p><strong>Requirements:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>WordPress site must be accessible online</li>
                <li>REST API must be enabled (default in WP 4.7+)</li>
                <li>Site should allow public access to content</li>
              </ul>
              <p className="mt-4"><strong>What gets imported:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Posts → News Articles</li>
                <li>Pages/Custom Posts → Productions (if applicable)</li>
                <li>Media → Gallery Images</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">CSV Format Guide</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p><strong>News Articles CSV format:</strong></p>
              <code className="block bg-gray-100 p-2 rounded text-xs">
                title,excerpt,content,date,category,featured
              </code>
              <p className="mt-4"><strong>Productions CSV format:</strong></p>
              <code className="block bg-gray-100 p-2 rounded text-xs">
                title,description,duration,dates,status,image,genre
              </code>
              <p className="mt-4 text-gray-600">
                Export your data from WordPress or create CSV files manually with these column headers.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}