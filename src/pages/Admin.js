import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "../components/ui/card";
import { useToast } from "../hooks/use-toast";

export default function Admin() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/admin/dashboard");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Autentificare reușită ✅",
        description: "Bun venit în panoul de administrare.",
      });
      navigate("/admin/dashboard");
    } catch (error) {
      toast({
        title: "Eroare ❌",
        description: "Email sau parolă incorecte.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-8">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-center text-xl sm:text-2xl">Autentificare Administrator</CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@gazetacnva.ro"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-sm sm:text-base"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-sm sm:text-base">Parolă</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="text-sm sm:text-base"
              />
            </div>

            <Button type="submit" className="w-full text-sm sm:text-base" disabled={loading}>
              {loading ? "Se autentifică..." : "Autentificare"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center px-4 sm:px-6">
          <p className="text-xs text-muted-foreground">Gazeta CNVA © 2025</p>
        </CardFooter>
      </Card>
    </div>
  );
}