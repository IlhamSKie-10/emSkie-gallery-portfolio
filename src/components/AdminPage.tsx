import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Upload, Trash2, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Work {
  id: string;
  imageUrl: string;
  title?: string;
  description?: string;
  date: string;
}

interface AdminPageProps {
  isAuthenticated: boolean;
  onLogin: () => void;
}

export const AdminPage = ({ isAuthenticated, onLogin }: AdminPageProps) => {
  const [password, setPassword] = useState("");
  const [works, setWorks] = useState<Work[]>([]);
  const [uploadFiles, setUploadFiles] = useState<FileList | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      loadWorks();
    }
  }, [isAuthenticated]);

  const loadWorks = () => {
    const savedWorks = localStorage.getItem('portfolioWorks');
    if (savedWorks) {
      setWorks(JSON.parse(savedWorks));
    }
  };

  const handleLogin = () => {
    if (password === 'muhammadilhamhakiki2399') {
      sessionStorage.setItem('portfolioAuth', 'true');
      onLogin();
      toast({
        title: "Login successful",
        description: "Welcome to the admin panel",
      });
    } else {
      toast({
        title: "Login failed",
        description: "Invalid password",
        variant: "destructive",
      });
    }
    setPassword("");
  };

  const handleFileUpload = async () => {
    if (!uploadFiles || uploadFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one image to upload",
        variant: "destructive",
      });
      return;
    }

    const newWorks: Work[] = [];

    for (let i = 0; i < uploadFiles.length; i++) {
      const file = uploadFiles[i];
      
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not an image file`,
          variant: "destructive",
        });
        continue;
      }

      try {
        const base64 = await fileToBase64(file);
        const work: Work = {
          id: Date.now().toString() + i,
          imageUrl: base64,
          title: title || file.name.split('.')[0],
          description: description,
          date: new Date().toISOString()
        };
        newWorks.push(work);
      } catch (error) {
        toast({
          title: "Upload failed",
          description: `Failed to upload ${file.name}`,
          variant: "destructive",
        });
      }
    }

    if (newWorks.length > 0) {
      const updatedWorks = [...works, ...newWorks];
      setWorks(updatedWorks);
      localStorage.setItem('portfolioWorks', JSON.stringify(updatedWorks));
      
      // Reset form
      setUploadFiles(null);
      setTitle("");
      setDescription("");
      
      toast({
        title: "Upload successful",
        description: `${newWorks.length} work(s) uploaded successfully`,
      });
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const deleteWork = (id: string) => {
    const updatedWorks = works.filter(work => work.id !== id);
    setWorks(updatedWorks);
    localStorage.setItem('portfolioWorks', JSON.stringify(updatedWorks));
    
    toast({
      title: "Work deleted",
      description: "The work has been removed from your portfolio",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-6 max-w-md">
          <Card className="glass-card border-border-glass">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Admin Login</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  className="bg-background/50"
                />
              </div>
              <Button 
                onClick={handleLogin}
                className="w-full luxury-button"
              >
                Login
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Demo password: admin123
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6 space-y-8">
        <h1 className="text-3xl font-bold text-center">Portfolio Administration</h1>
        
        {/* Upload Section */}
        <Card className="glass-card border-border-glass">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>Upload New Works</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="images">Select Images</Label>
              <Input
                id="images"
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setUploadFiles(e.target.files)}
                className="bg-background/50"
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title (optional)</Label>
                <Input
                  id="title"
                  placeholder="Enter title for the work(s)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-background/50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-background/50 resize-none"
                  rows={1}
                />
              </div>
            </div>
            
            <Button 
              onClick={handleFileUpload}
              className="luxury-button"
              disabled={!uploadFiles || uploadFiles.length === 0}
            >
              Upload {uploadFiles && uploadFiles.length > 1 ? `${uploadFiles.length} Files` : 'File'}
            </Button>
          </CardContent>
        </Card>
        
        {/* Works Grid */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Current Works ({works.length})</h2>
          
          {works.length === 0 ? (
            <Card className="glass-card border-border-glass">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No works uploaded yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {works.map((work) => (
                <Card key={work.id} className="glass-card border-border-glass overflow-hidden">
                  <div className="aspect-video bg-background-secondary">
                    <img
                      src={work.imageUrl}
                      alt={work.title || 'Work'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold truncate">{work.title || 'Untitled'}</h3>
                      {work.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {work.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(work.date)}</span>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteWork(work.id)}
                        className="hover:bg-destructive/20 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};