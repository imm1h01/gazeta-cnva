import React, { useState, useEffect } from "react";
import { ref, push, set, update, get } from "firebase/database";
import { db } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Select as ShadSelect, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/select";
import { useToast } from "../hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import TagInput from "../components/TagInput";
import ContentEditor from "../components/ContentEditor";

export default function ArticleFormPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { articleId } = useParams();
  const isEditMode = !!articleId;

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [content, setContent] = useState("");
  const [formData, setFormData] = useState({
    titlu: "",
    rezumat: "",
    continut: "",
    autor: "",
    tags: [],
    imagine: "",
    status: "draft",
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchArticle = async () => {
        try {
          const articleRef = ref(db, `articole/${articleId}`);
          const snapshot = await get(articleRef);
          if (snapshot.exists()) {
            const articleData = snapshot.val();
            setFormData(articleData);
            setContent(articleData.continut || "");
          } else {
            toast({ title: "Eroare", description: "Articolul nu a fost găsit.", variant: "destructive" });
            navigate("/admin/dashboard");
          }
        } catch (error) {
          toast({ title: "Eroare", description: "Eroare la încărcarea articolului.", variant: "destructive" });
          navigate("/admin/dashboard");
        } finally {
          setInitialLoading(false);
        }
      };
      fetchArticle();
    } else {
      setInitialLoading(false);
    }
  }, [isEditMode, articleId, navigate, toast]);

  const handleEditorChange = (htmlContent) => {
    setContent(htmlContent);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleTagsChange = (tags) => {
    setFormData({ ...formData, tags });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const finalFormData = { 
      ...formData, 
      continut: content 
    };

    const cleanContent = content.replace(/<p><br><\/p>/g, '').trim();

    if (!finalFormData.titlu || !finalFormData.autor || !cleanContent) {
      toast({
        title: "Eroare",
        description: "Completați câmpurile obligatorii (Titlu, Autor, Conținut).",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const timestamp = Date.now();
      
      if (isEditMode) {
        await update(ref(db, `articole/${articleId}`), {
          ...finalFormData,
          timestamp
        });
        toast({ title: "Succes", description: "Articolul a fost actualizat!" });
      } else {
        const newArticleRef = push(ref(db, "articole/"));
        await set(newArticleRef, {
          ...finalFormData,
          data: new Date().toLocaleDateString("ro-RO", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }).replace(/\./g, ""),
          views: 0,
          timestamp
        });
        toast({
          title: "Succes",
          description: `Articolul a fost ${finalFormData.status === "published" ? "publicat" : "salvat ca ciornă"}.`,
        });
      }
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Submit error:", error);
      toast({
        title: "Eroare la salvare",
        description: error.message || "Articolul nu a putut fi salvat.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-muted-foreground">Se încarcă articolul...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 max-w-7xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => navigate("/admin/dashboard")}
              className="p-0 h-auto mr-3 text-blue-600 hover:text-blue-700 text-sm sm:text-base"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
              Înapoi
            </Button>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
              {isEditMode ? "Editează Articol" : "Articol Nou"}
            </h1>
          </div>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-sm sm:text-base w-full sm:w-auto"
          >
            {loading
              ? "Se salvează..."
              : formData.status === "published"
              ? "Publică Articol"
              : "Salvează Ciorna"}
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-7xl">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg space-y-4">
              <div className="space-y-2">
                <Label htmlFor="titlu" className="text-base sm:text-lg font-semibold text-gray-700">
                  Titlu *
                </Label>
                <Input
                  id="titlu"
                  required
                  value={formData.titlu}
                  onChange={handleChange}
                  placeholder="Introdu titlul articolului"
                  className="text-lg sm:text-xl font-bold p-3"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rezumat" className="text-base sm:text-lg font-semibold text-gray-700">
                  Rezumat
                </Label>
                <Textarea
                  id="rezumat"
                  rows={3}
                  value={formData.rezumat}
                  onChange={handleChange}
                  placeholder="Scurtă descriere a articolului"
                  className="p-3 text-sm sm:text-base"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-base sm:text-lg font-semibold text-gray-700">
                  Conținut *
                </Label>
                <ContentEditor
                  value={content}
                  onChange={handleEditorChange}
                  placeholder="Scrie conținutul articolului..."
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg space-y-6 sticky top-20 border border-gray-200 backdrop-blur-md bg-opacity-95">
              <h3 className="text-lg sm:text-xl font-bold mb-4 text-gray-800 border-b pb-3">
                Setări Articol
              </h3>

              <div className="space-y-2">
                <Label className="font-semibold text-gray-700 text-sm sm:text-base">Tag-uri</Label>
                <TagInput value={formData.tags} onChange={handleTagsChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="autor" className="font-semibold text-gray-700 text-sm sm:text-base">
                  Autor *
                </Label>
                <Input
                  id="autor"
                  required
                  value={formData.autor}
                  onChange={handleChange}
                  placeholder="Numele autorului"
                  className="text-sm sm:text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imagine" className="font-semibold text-gray-700 text-sm sm:text-base">
                  Imagine Principală (URL)
                </Label>
                <Input
                  id="imagine"
                  type="url"
                  value={formData.imagine}
                  onChange={handleChange}
                  placeholder="URL imagine"
                  className="text-sm sm:text-base"
                />
                {formData.imagine && (
                  <div className="mt-3 p-3 border border-gray-100 rounded-lg bg-gray-50">
                    <img
                      src={formData.imagine}
                      alt="Preview"
                      className="w-full h-auto object-cover max-h-32 rounded-md"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="font-semibold text-gray-700 text-sm sm:text-base">
                  Status *
                </Label>
                <ShadSelect
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger className="w-full bg-white/80 backdrop-blur-sm rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 text-sm sm:text-base">
                    <SelectValue placeholder="Alege statusul" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/90 backdrop-blur-md shadow-lg rounded-lg">
                    <SelectItem value="draft" className="text-sm sm:text-base">Ciornă</SelectItem>
                    <SelectItem value="published" className="text-sm sm:text-base">Publicat</SelectItem>
                  </SelectContent>
                </ShadSelect>
              </div>

              <div className="flex flex-col gap-3 pt-4 border-t mt-6">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-sm sm:text-base"
                >
                  {loading
                    ? "Se salvează..."
                    : isEditMode
                    ? "Salvează Modificările"
                    : formData.status === "published"
                    ? "Publică Articol"
                    : "Salvează Ciorna"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/dashboard")}
                  className="w-full text-sm sm:text-base"
                >
                  Anulează
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}