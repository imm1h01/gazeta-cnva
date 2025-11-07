import React, { useState, useEffect } from "react";
import { ref, onValue, remove, update } from "firebase/database";
import { db, auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/ui/dialog";
import { Card, CardContent, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useToast } from "../hooks/use-toast";
import { LogOut, Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";

export default function AdminDashboard() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("published");
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/admin");
        return;
      }
      setUser(user);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await signOut(auth);
    toast({ title: "Deconectat cu succes" });
    navigate("/admin");
  };

  const handleCreateArticle = () => {
    navigate("/admin/new-article");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-muted-foreground">Se încarcă...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">Panou de Administrare</h1>
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Bine ai revenit, {user?.email}</p>
            </div>
            <div className="flex gap-2 sm:gap-3">
              <Button onClick={handleCreateArticle} className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm">
                <Plus className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Articol Nou
              </Button>
              <Button variant="outline" onClick={handleSignOut} className="text-xs sm:text-sm">
                <LogOut className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Deconectare
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2 sm:hidden">Bine ai revenit, {user?.email}</p>
        </div>
      </header>

      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-lg grid-cols-2 mb-6 sm:mb-8 bg-white p-1 rounded-lg shadow-inner mx-auto">
            <TabsTrigger 
              value="published" 
              className={`flex items-center text-sm sm:text-lg font-semibold py-2 ${activeTab === 'published' ? 'bg-green-100 text-green-700 shadow' : 'text-gray-500'}`}
            >
              <Eye className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Publicate
            </TabsTrigger>
            <TabsTrigger 
              value="draft" 
              className={`flex items-center text-sm sm:text-lg font-semibold py-2 ${activeTab === 'draft' ? 'bg-yellow-100 text-yellow-700 shadow' : 'text-gray-500'}`}
            >
              <EyeOff className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Ciorne
            </TabsTrigger>
          </TabsList>
          <TabsContent value="published">
            <ArticlesTab status="published" />
          </TabsContent>
          <TabsContent value="draft">
            <ArticlesTab status="draft" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ArticlesTab({ status }) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);

  const parseRomanianDate = (dateStr) => {
    if (!dateStr) return new Date(0);
    
    const months = {
      'ian': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'mai': 4, 'iun': 5,
      'iul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11
    };
    
    try {
      const parts = dateStr.toLowerCase().split(' ');
      if (parts.length !== 3) return new Date(0);
      
      const day = parseInt(parts[0]);
      const month = months[parts[1]];
      const year = parseInt(parts[2]);
      
      if (isNaN(day) || month === undefined || isNaN(year)) {
        return new Date(0);
      }
      
      return new Date(year, month, day);
    } catch (error) {
      return new Date(0);
    }
  };

  useEffect(() => {
    const articlesRef = ref(db, "articole/");
    
    const unsubscribe = onValue(articlesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const articlesArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        
        const filteredArticles = articlesArray
          .filter(article => article.status === status)
          .sort((a, b) => {
            const dateA = parseRomanianDate(a.data);
            const dateB = parseRomanianDate(b.data);
            return dateB - dateA;
          });
        
        setArticles(filteredArticles);
      } else {
        setArticles([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [status]);

  const handleDeleteClick = (article) => {
    setArticleToDelete(article);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!articleToDelete) return;

    try {
      await remove(ref(db, `articole/${articleToDelete.id}`));
      toast({ 
        title: "Succes", 
        description: `Articol "${articleToDelete.titlu}" a fost șters` 
      });
    } catch (error) {
      toast({
        title: "Eroare",
        description: "Articolul nu a putut fi șters",
        variant: "destructive",
      });
    } finally {
      setDeleteConfirmOpen(false);
      setArticleToDelete(null);
    }
  };

  const handleEdit = (article) => {
    navigate(`/admin/edit-article/${article.id}`);
  };

  const getStatusBadge = (articleStatus, category) => {
    const statusText = articleStatus === "published" ? "Publicat" : "Ciornă";
    const statusColor = articleStatus === "published" ? "bg-green-500 hover:bg-green-500/80" : "bg-yellow-500 hover:bg-yellow-500/80";

    return (
      <div className="flex gap-2 flex-wrap">
        <Badge className={`${statusColor} text-xs`}>{statusText}</Badge>
        {category && <Badge variant="outline" className="text-xs">{category}</Badge>}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Se încarcă articolele...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
        {status === "published" ? "Lista Articolelor Publicate" : "Lista Articolelor Ciornă"} ({articles.length})
      </h2>

      {articles.length === 0 ? (
        <Card className="shadow-none border-dashed bg-white">
          <CardContent className="py-12 sm:py-16 text-center">
            <div className="mx-auto w-16 h-16 sm:w-24 sm:h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold mb-2">
              Nu sunt articole disponibile
            </h3>
            <p className="text-muted-foreground mb-4 max-w-sm mx-auto text-sm sm:text-base">
              {status === "published" 
                ? "Începe prin a adăuga un articol nou și publică-l."
                : "Articolele salvate ca ciornă vor apărea aici."
              }
            </p>
            <Button onClick={() => navigate("/admin/new-article")} variant="secondary" className="text-sm sm:text-base">Adaugă Articol</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {articles.map((article) => (
            <Card key={article.id} className="p-3 sm:p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 transition-all hover:shadow-lg bg-white">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  {getStatusBadge(article.status, article.categorie)}
                </div>
                <CardTitle className="text-base sm:text-lg font-semibold mb-1 hover:text-blue-600 transition-colors cursor-pointer line-clamp-2" onClick={() => handleEdit(article)}>
                  {article.titlu}
                </CardTitle>
                <p className="text-xs sm:text-sm text-gray-500">
                  De {article.autor || 'N/A'} • {article.data || 'N/A'} • {article.views || 0} vizualizări
                </p>
              </div>
              <div className="flex gap-1 self-end sm:self-auto">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => handleEdit(article)}
                  className="h-8 w-8 sm:h-9 sm:w-9 p-0 hover:bg-blue-50 text-blue-600"
                >
                  <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteClick(article)}
                  className="h-8 w-8 sm:h-9 sm:w-9 p-0 text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="bg-white max-w-[95vw] sm:max-w-md rounded-lg mx-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Confirmă ștergerea</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Sigur doriți să ștergeți articolul "{articleToDelete?.titlu}"? 
              Această acțiune nu poate fi anulată.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end mt-4 flex-col sm:flex-row">
            <Button 
              variant="outline" 
              onClick={() => setDeleteConfirmOpen(false)}
              className="text-sm sm:text-base"
            >
              Anulează
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteConfirm}
              className="text-sm sm:text-base"
            >
              Șterge Articol
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}