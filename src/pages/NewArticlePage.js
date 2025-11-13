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

function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function ArticleFormPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { articleId } = useParams();
  const isEditMode = !!articleId;

  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [formData, setFormData] = useState({
    titlu: "",
    rezumat: "",
    continut: "",
    autor: "",
    tags: [],
    imagine: "",
    status: "draft",
    slug: ""
  });

  useEffect(() => {
    if (formData.titlu && !isEditMode) {
      const slug = generateSlug(formData.titlu);
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.titlu, isEditMode]);

  useEffect(() => {
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
      }
    };
    
    if (isEditMode) {
      fetchArticle();
    }
  }, [isEditMode, articleId, navigate, toast]);

  const handleEditorChange = (htmlContent) => {
    setContent(htmlContent);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [id]: value 
    }));
  };

  const handleTagsChange = (tags) => {
    setFormData({ ...formData, tags });
  };

  const handleSlugChange = (e) => {
    const slug = generateSlug(e.target.value);
    setFormData(prev => ({ ...prev, slug }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const finalFormData = { 
      ...formData, 
      continut: content,
      slug: formData.slug || generateSlug(formData.titlu)
    };

    const cleanContent = content.replace(/<p><br><\/p>/g, '').trim();

    if (!finalFormData.titlu || !finalFormData.autor || !cleanContent || !finalFormData.slug) {
      toast({
        title: "Eroare",
        description: "Completați câmpurile obligatorii (Titlu, Autor, Conținut, Slug).",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      if (isEditMode) {
        await update(ref(db, `articole/${articleId}`), finalFormData);
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
          views: 0
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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-3 py-2 max-w-7xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => navigate("/admin/dashboard")}
              className="p-0 h-auto mr-2 text-blue-600 hover:text-blue-700 text-xs"
            >
              <ArrowLeft className="h-3 w-3 mr-1" />
              Înapoi
            </Button>
            <h1 className="text-sm font-bold text-gray-800">
              {isEditMode ? "Editează Articol" : "Articol Nou"}
            </h1>
          </div>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-xs w-full sm:w-auto"
          >
            {loading
              ? "Se salvează..."
              : formData.status === "published"
              ? "Publică Articol"
              : "Salvează Ciorna"}
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-3 py-4 max-w-7xl">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-3 rounded-xl shadow-lg space-y-3">
              <div className="space-y-1">
                <Label htmlFor="titlu" className="text-sm font-semibold text-gray-700">
                  Titlu *
                </Label>
                <Input
                  id="titlu"
                  required
                  value={formData.titlu}
                  onChange={handleChange}
                  placeholder="Introdu titlul articolului"
                  className="text-sm font-bold p-2"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="slug" className="text-sm font-semibold text-gray-700">
                  URL Slug *
                </Label>
                <Input
                  id="slug"
                  required
                  value={formData.slug}
                  onChange={handleSlugChange}
                  placeholder="url-prietenos-pentru-seo"
                  className="text-sm p-2 font-mono"
                />
                <p className="text-xs text-gray-500">
                  Acesta va fi URL-ul articolului: /articol/<span className="font-semibold">{formData.slug || 'url-prietenos'}</span>
                </p>
              </div>

              <div className="space-y-1">
                <Label htmlFor="rezumat" className="text-sm font-semibold text-gray-700">
                  Rezumat
                </Label>
                <Textarea
                  id="rezumat"
                  rows={2}
                  value={formData.rezumat}
                  onChange={handleChange}
                  placeholder="Scurtă descriere a articolului"
                  className="p-2 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-semibold text-gray-700">
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

          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white p-3 rounded-xl shadow-lg space-y-4 sticky top-16 border border-gray-200 backdrop-blur-md bg-opacity-95">
              <h3 className="text-sm font-bold mb-2 text-gray-800 border-b pb-2">
                Setări Articol
              </h3>

              <div className="space-y-1">
                <Label className="font-semibold text-gray-700 text-xs">Tag-uri</Label>
                <TagInput value={formData.tags} onChange={handleTagsChange} />
              </div>

              <div className="space-y-1">
                <Label htmlFor="autor" className="font-semibold text-gray-700 text-xs">
                  Autor *
                </Label>
                <Input
                  id="autor"
                  required
                  value={formData.autor}
                  onChange={handleChange}
                  placeholder="Numele autorului"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="imagine" className="font-semibold text-gray-700 text-xs">
                  Imagine Principală (URL)
                </Label>
                <Input
                  id="imagine"
                  type="url"
                  value={formData.imagine}
                  onChange={handleChange}
                  placeholder="URL imagine"
                  className="text-xs"
                />
                {formData.imagine && (
                  <div className="mt-2 p-2 border border-gray-100 rounded-lg bg-gray-50">
                    <img
                      src={formData.imagine}
                      alt="Preview"
                      className="w-full h-auto object-cover max-h-24 rounded-md"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="status" className="font-semibold text-gray-700 text-xs">
                  Status *
                </Label>
                <ShadSelect
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger className="w-full bg-white/80 backdrop-blur-sm rounded-lg border-gray-300 focus:ring-1 focus:ring-blue-500 text-xs">
                    <SelectValue placeholder="Alege statusul" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/90 backdrop-blur-md shadow-lg rounded-lg">
                    <SelectItem value="draft" className="text-xs">Ciornă</SelectItem>
                    <SelectItem value="published" className="text-xs">Publicat</SelectItem>
                  </SelectContent>
                </ShadSelect>
              </div>

              <div className="flex flex-col gap-2 pt-3 border-t mt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-xs"
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
                  className="w-full text-xs"
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