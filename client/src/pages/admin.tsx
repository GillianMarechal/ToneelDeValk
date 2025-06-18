import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Plus, Image, Settings, FileText, Eye, Upload } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  featured: boolean;
}

interface GalleryItem {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
}

interface HeroImage {
  id: number;
  title: string;
  imageUrl: string;
  altText: string;
  active: boolean;
  sortOrder: number;
}

export default function AdminPanel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("news");

  // News management
  const { data: newsItems = [], isLoading: newsLoading } = useQuery({
    queryKey: ["/api/admin/news"],
  });

  // Gallery management
  const { data: galleryItems = [], isLoading: galleryLoading } = useQuery({
    queryKey: ["/api/admin/gallery"],
  });

  // Hero images management
  const { data: heroImages = [], isLoading: heroLoading } = useQuery({
    queryKey: ["/api/admin/hero-images"],
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">De Valk Admin Panel</h1>
          <p className="text-gray-600 mt-2">Beheer nieuws, galerij en homepage content</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="news" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Nieuws
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Galerij
            </TabsTrigger>
            <TabsTrigger value="hero" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Homepage
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Instellingen
            </TabsTrigger>
          </TabsList>

          <TabsContent value="news" className="space-y-6">
            <NewsManagement 
              items={newsItems} 
              loading={newsLoading} 
              onRefresh={() => queryClient.invalidateQueries({ queryKey: ["/api/admin/news"] })}
            />
          </TabsContent>

          <TabsContent value="gallery" className="space-y-6">
            <GalleryManagement 
              items={galleryItems} 
              loading={galleryLoading}
              onRefresh={() => queryClient.invalidateQueries({ queryKey: ["/api/admin/gallery"] })}
            />
          </TabsContent>

          <TabsContent value="hero" className="space-y-6">
            <HeroManagement 
              images={heroImages} 
              loading={heroLoading}
              onRefresh={() => queryClient.invalidateQueries({ queryKey: ["/api/admin/hero-images"] })}
            />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <SiteSettings />
            <WordPressImport />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// News Management Component
function NewsManagement({ items, loading, onRefresh }: { items: NewsItem[]; loading: boolean; onRefresh: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const createMutation = useMutation({
    mutationFn: async (data: Partial<NewsItem>) => {
      const response = await fetch("/api/admin/news", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to create news article");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Nieuws artikel aangemaakt" });
      onRefresh();
      setIsCreateDialogOpen(false);
    },
    onError: () => {
      toast({ title: "Fout bij aanmaken artikel", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<NewsItem> }) => {
      const response = await fetch(`/api/admin/news/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to update news article");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Artikel bijgewerkt" });
      onRefresh();
      setEditingItem(null);
    },
    onError: () => {
      toast({ title: "Fout bij bijwerken artikel", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/news/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete news article");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Artikel verwijderd" });
      onRefresh();
    },
    onError: () => {
      toast({ title: "Fout bij verwijderen artikel", variant: "destructive" });
    },
  });

  if (loading) {
    return <div className="flex justify-center py-8">Laden...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Nieuws Beheer</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nieuw Artikel
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <NewsForm
              onSubmit={(data) => createMutation.mutate(data)}
              loading={createMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {items.map((item) => (
          <Card key={item.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <CardDescription>
                  {item.category} • {new Date(item.date).toLocaleDateString('nl-NL')}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {item.featured && <Badge variant="secondary">Uitgelicht</Badge>}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingItem(item)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Artikel verwijderen?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Deze actie kan niet ongedaan worden gemaakt.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuleren</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteMutation.mutate(item.id)}
                      >
                        Verwijderen
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{item.excerpt}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingItem && (
        <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
          <DialogContent className="max-w-2xl">
            <NewsForm
              item={editingItem}
              onSubmit={(data) => updateMutation.mutate({ id: editingItem.id, data })}
              loading={updateMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// News Form Component
function NewsForm({ 
  item, 
  onSubmit, 
  loading 
}: { 
  item?: NewsItem | null; 
  onSubmit: (data: Partial<NewsItem>) => void; 
  loading: boolean; 
}) {
  const [formData, setFormData] = useState({
    title: item?.title || "",
    excerpt: item?.excerpt || "",
    content: item?.content || "",
    category: item?.category || "Nieuws",
    featured: item?.featured || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      date: item?.date || new Date().toISOString(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DialogHeader>
        <DialogTitle>{item ? "Artikel Bewerken" : "Nieuw Artikel"}</DialogTitle>
        <DialogDescription>
          Vul de details in voor het nieuws artikel.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Titel</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="excerpt">Samenvatting</Label>
          <Textarea
            id="excerpt"
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            rows={3}
            required
          />
        </div>

        <div>
          <Label htmlFor="content">Inhoud</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={8}
            required
          />
        </div>

        <div>
          <Label htmlFor="category">Categorie</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="featured"
            checked={formData.featured}
            onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
          />
          <Label htmlFor="featured">Uitgelicht artikel</Label>
        </div>
      </div>

      <DialogFooter>
        <Button type="submit" disabled={loading}>
          {loading ? "Opslaan..." : "Opslaan"}
        </Button>
      </DialogFooter>
    </form>
  );
}

// Gallery Form Component
function GalleryForm({ 
  item, 
  onSubmit, 
  loading 
}: { 
  item?: GalleryItem; 
  onSubmit: (data: any) => void; 
  loading: boolean; 
}) {
  const [formData, setFormData] = useState({
    title: item?.title || "",
    description: item?.description || "",
    image: item?.image || "",
    category: item?.category || "",
  });

  const availablePhotos = [
    { path: "/attached_assets/DeValk1_1750105696284.jpg", name: "De Valk Theater Groep" },
    { path: "/attached_assets/devalk2_1750105696285.jpg", name: "Theater Optreden" },
    { path: "/attached_assets/olifantenman_1750242304834.png", name: "De Olifantman Poster" }
  ];

  const categories = [
    "Voorstellingen",
    "Groepsfoto's", 
    "Backstage",
    "Posters",
    "Repetities",
    "Events"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <DialogHeader>
        <DialogTitle>{item ? "Afbeelding Bewerken" : "Nieuwe Afbeelding"}</DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Titel</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Beschrijving</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="category">Categorie</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="Bijv: Voorstellingen, Groepsfoto's, Backstage..."
            list="categories"
          />
          <datalist id="categories">
            {categories.map(cat => (
              <option key={cat} value={cat} />
            ))}
          </datalist>
        </div>

        <div>
          <Label>Afbeelding</Label>
          <div className="space-y-3">
            <div>
              <Label htmlFor="imageUrl">Afbeelding URL</Label>
              <Input
                id="imageUrl"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/image.jpg of /attached_assets/foto.jpg"
              />
            </div>
            
            <div>
              <Label>Of kies een bestaande foto:</Label>
              <div className="grid grid-cols-1 gap-2 mt-2">
                {availablePhotos.map((photo) => (
                  <Button
                    key={photo.path}
                    type="button"
                    variant="outline"
                    className="justify-start h-auto p-3"
                    onClick={() => setFormData({ ...formData, image: photo.path })}
                  >
                    <div className="flex items-center space-x-3">
                      <img 
                        src={photo.path} 
                        alt={photo.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <span>{photo.name}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {formData.image && (
              <div>
                <Label>Voorbeeld:</Label>
                <img 
                  src={formData.image} 
                  alt="Preview"
                  className="w-full h-48 object-cover rounded mt-2"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button type="submit" disabled={loading}>
          {loading ? "Opslaan..." : "Opslaan"}
        </Button>
      </DialogFooter>
    </form>
  );
}

// Gallery Management Component
function GalleryManagement({ items, loading, onRefresh }: { items: GalleryItem[]; loading: boolean; onRefresh: () => void }) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const { toast } = useToast();

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("/api/gallery", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({ title: "Afbeelding toegevoegd" });
      setIsCreateDialogOpen(false);
      onRefresh();
    },
    onError: () => {
      toast({ title: "Fout bij toevoegen afbeelding", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return apiRequest(`/api/gallery/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({ title: "Afbeelding bijgewerkt" });
      setEditingItem(null);
      onRefresh();
    },
    onError: () => {
      toast({ title: "Fout bij bijwerken afbeelding", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/gallery/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      toast({ title: "Afbeelding verwijderd" });
      onRefresh();
    },
    onError: () => {
      toast({ title: "Fout bij verwijderen afbeelding", variant: "destructive" });
    },
  });

  const addExistingPhotosMutation = useMutation({
    mutationFn: async () => {
      const existingPhotos = [
        {
          title: "De Valk Theater Groep",
          description: "Professionele foto van onze theatergroep",
          image: "/attached_assets/DeValk1_1750105696284.jpg",
          category: "Groepsfoto's"
        },
        {
          title: "Theater Optreden",
          description: "Acteurs tijdens een voorstelling",
          image: "/attached_assets/devalk2_1750105696285.jpg",
          category: "Voorstellingen"
        },
        {
          title: "De Olifantman",
          description: "Poster van onze huidige productie De Olifantman",
          image: "/attached_assets/olifantenman_1750242304834.png",
          category: "Posters"
        }
      ];
      
      for (const photo of existingPhotos) {
        await apiRequest("/api/gallery", {
          method: "POST",
          body: JSON.stringify(photo),
        });
      }
    },
    onSuccess: () => {
      toast({ title: "Bestaande foto's toegevoegd aan galerij" });
      onRefresh();
    },
    onError: () => {
      toast({ title: "Fout bij toevoegen bestaande foto's", variant: "destructive" });
    },
  });

  if (loading) {
    return <div className="flex justify-center py-8">Laden...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Galerij Beheer</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => addExistingPhotosMutation.mutate()}
            disabled={addExistingPhotosMutation.isPending}
          >
            <Upload className="h-4 w-4 mr-2" />
            {addExistingPhotosMutation.isPending ? "Importeren..." : "Importeer Bestaande Foto's"}
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nieuwe Afbeelding
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <GalleryForm
                onSubmit={(data) => createMutation.mutate(data)}
                loading={createMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <img 
                src={item.image} 
                alt={item.title}
                className="w-full h-48 object-cover rounded mb-4"
              />
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{item.category}</p>
              <p className="text-sm">{item.description}</p>
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingItem(item)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Afbeelding verwijderen?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Deze actie kan niet ongedaan worden gemaakt.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuleren</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteMutation.mutate(item.id)}
                      >
                        Verwijderen
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingItem && (
        <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
          <DialogContent className="max-w-2xl">
            <GalleryForm
              item={editingItem}
              onSubmit={(data) => updateMutation.mutate({ id: editingItem.id, data })}
              loading={updateMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Hero Management Component
function HeroManagement({ images, loading, onRefresh }: { images: HeroImage[]; loading: boolean; onRefresh: () => void }) {
  if (loading) {
    return <div className="flex justify-center py-8">Laden...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Homepage Afbeeldingen</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nieuwe Afbeelding
        </Button>
      </div>
      <div className="grid gap-4">
        {images.map((image) => (
          <Card key={image.id}>
            <CardContent className="p-4 flex items-center space-x-4">
              <img 
                src={image.imageUrl} 
                alt={image.altText}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{image.title}</h3>
                <p className="text-sm text-gray-600">{image.altText}</p>
                <div className="flex items-center gap-2 mt-2">
                  {image.active && <Badge variant="default">Actief</Badge>}
                  <span className="text-sm text-gray-500">Volgorde: {image.sortOrder}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Site Settings Component
function SiteSettings() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Site Instellingen</h2>
      <Card>
        <CardHeader>
          <CardTitle>Algemene Instellingen</CardTitle>
          <CardDescription>
            Beheer algemene site configuratie
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Site Titel</Label>
            <Input defaultValue="DE VALK - Koninklijke Toneelvereniging" />
          </div>
          <div>
            <Label>Tagline</Label>
            <Input defaultValue="blijf verwonderd, de valk zal je verbazen" />
          </div>
          <div>
            <Label>Contact Email</Label>
            <Input defaultValue="info@toneelgroepdevalk.nl" />
          </div>
          <div>
            <Label>Contact Pagina</Label>
            <Input defaultValue="/contact" />
          </div>
          <Button>Opslaan</Button>
        </CardContent>
      </Card>
    </div>
  );
}

// WordPress FTP Import Component
function WordPressImport() {
  const { toast } = useToast();
  const [importData, setImportData] = useState({
    wpSiteUrl: "https://www.toneeldevalk.be",
    ftpHost: "",
    ftpUser: "",
    ftpPassword: "",
    contentType: "all"
  });
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = async () => {
    if (!importData.wpSiteUrl || !importData.ftpHost || !importData.ftpUser || !importData.ftpPassword) {
      toast({
        title: "Ontbrekende gegevens",
        description: "Vul alle FTP en WordPress gegevens in",
        variant: "destructive"
      });
      return;
    }

    setIsImporting(true);
    try {
      // Try WordPress API migration first
      const response = await fetch("/api/migrate/wordpress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wpSiteUrl: importData.wpSiteUrl,
          contentType: importData.contentType,
          username: importData.ftpUser,
          password: importData.ftpPassword
        })
      });

      if (response.ok) {
        toast({
          title: "Import geslaagd",
          description: "WordPress content is succesvol geïmporteerd"
        });
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      console.error("WordPress import failed:", error);
      toast({
        title: "Import mislukt",
        description: "Er was een probleem bij het importeren van WordPress content",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>WordPress Content Import</CardTitle>
        <CardDescription>
          Importeer content van je bestaande WordPress site via FTP toegang
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="wpSiteUrl">WordPress Site URL</Label>
          <Input
            id="wpSiteUrl"
            value={importData.wpSiteUrl}
            onChange={(e) => setImportData({...importData, wpSiteUrl: e.target.value})}
            placeholder="https://www.toneeldevalk.be"
          />
        </div>
        
        <div>
          <Label htmlFor="ftpHost">FTP Host</Label>
          <Input
            id="ftpHost"
            value={importData.ftpHost}
            onChange={(e) => setImportData({...importData, ftpHost: e.target.value})}
            placeholder="ftp.jouwdomain.be"
          />
        </div>
        
        <div>
          <Label htmlFor="ftpUser">FTP Gebruikersnaam</Label>
          <Input
            id="ftpUser"
            value={importData.ftpUser}
            onChange={(e) => setImportData({...importData, ftpUser: e.target.value})}
            placeholder="gebruikersnaam"
          />
        </div>
        
        <div>
          <Label htmlFor="ftpPassword">FTP Wachtwoord</Label>
          <Input
            id="ftpPassword"
            type="password"
            value={importData.ftpPassword}
            onChange={(e) => setImportData({...importData, ftpPassword: e.target.value})}
            placeholder="wachtwoord"
          />
        </div>

        <div>
          <Label htmlFor="contentType">Content Type</Label>
          <select
            id="contentType"
            value={importData.contentType}
            onChange={(e) => setImportData({...importData, contentType: e.target.value})}
            className="w-full p-2 border rounded"
          >
            <option value="all">Alles</option>
            <option value="news">Alleen Nieuws</option>
            <option value="productions">Alleen Producties</option>
            <option value="gallery">Alleen Galerij</option>
          </select>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={handleImport} 
            disabled={isImporting}
            className="flex-1"
          >
            {isImporting ? "Importeren..." : "WordPress Content Importeren"}
          </Button>
        </div>

        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
          <p><strong>Let op:</strong> Dit zal content van je WordPress site importeren via de FTP toegang en WordPress API. 
          Zorg ervoor dat je de juiste FTP gegevens hebt en dat je WordPress site toegankelijk is.</p>
        </div>
      </CardContent>
    </Card>
  );
}