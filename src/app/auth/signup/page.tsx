"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

function SignUpContent() {
  const searchParams = useSearchParams();
  const isAdminPath = searchParams.get("admin") === "true";
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isAdminPath) {
    return (
      <div className="text-center space-y-6">
         <h1 className="text-3xl font-display text-primary">Access Restricted</h1>
         <p className="text-foreground/80 font-body leading-relaxed max-w-sm mx-auto">
           Registration is restricted to authorized team members. General public accounts are not supported in the Medical Marketing Portal.
         </p>
         <Button variant="secondary" className="mt-8" onClick={() => window.location.href = "/contact"}>
           Contact Support
         </Button>
      </div>
    );
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Add their info to the "admins" collection
      await setDoc(doc(db, "admins", user.uid), {
        email: user.email,
        role: "admin",
        createdAt: new Date().toISOString()
      });

      // 3. Redirect to the dashboard
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to create admin account.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-left space-y-6">
       <div className="text-center">
         <Badge className="mb-4">Admin Registration</Badge>
         <h1 className="text-3xl font-display text-primary">Internal Registration</h1>
         <p className="text-foreground/70 font-body text-sm max-w-sm mx-auto mt-2">
           Register a new admin account to access the dashboard.
         </p>
       </div>
       
       {error && (
          <div className="mb-6 p-3 bg-error-container/20 border border-error/50 rounded-sm text-error text-sm font-body">
            {error}
          </div>
       )}

       <form onSubmit={handleSignUp} className="space-y-4">
         <Input 
           placeholder="Admin Email" 
           type="email" 
           required 
           value={email}
           onChange={(e) => setEmail(e.target.value)}
         />
         <Input 
           placeholder="Secure Password (min. 6 chars)" 
           type="password" 
           required 
           value={password}
           onChange={(e) => setPassword(e.target.value)}
         />
         <Button type="submit" variant="primary" className="w-full" disabled={loading}>
           {loading ? "Creating Account..." : "Create Admin Account"}
         </Button>
       </form>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-md glass p-10 rounded-sm ghost-border relative z-10">
        <Suspense fallback={<div className="animate-pulse w-8 h-8 rounded-full border-t border-primary mx-auto" />}>
           <SignUpContent />
        </Suspense>
      </div>
    </div>
  );
}
