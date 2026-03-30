"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getAllAdmins, deleteAdminUser, createAdminUser } from "@/lib/firestore/users";
import { Shield, Settings, Trash2, Key, Users } from "lucide-react";
import { initializeApp, deleteApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<"platform" | "access">("platform");
  
  // Platform States
  const [loadingConfig, setLoadingConfig] = useState(false);
  const [successConfig, setSuccessConfig] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    phone: "+20 XX XXX XXXX",
    email: "clinic@mobadra.com",
    address: "Alexandria, Egypt"
  });

  // Access States
  const [admins, setAdmins] = useState<any[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(true);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);
  const [adminError, setAdminError] = useState("");

  // Load Admin list
  useEffect(() => {
    if (activeTab === "access") {
      fetchAdmins();
    }
  }, [activeTab]);

  const fetchAdmins = async () => {
    setLoadingAdmins(true);
    const list = await getAllAdmins();
    setAdmins(list);
    setLoadingAdmins(false);
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingConfig(true);
    try {
      await setDoc(doc(db, "settings", "contact"), contactInfo, { merge: true });
      setSuccessConfig(true);
      setTimeout(() => setSuccessConfig(false), 3000);
    } catch (err) {
      console.error(err);
    }
    setLoadingConfig(false);
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingAdmin(true);
    setAdminError("");

    try {
      // Create a temporary secondary Firebase instance just for user creation
      // This prevents the robust issue of Firebase logging out the current Admin!
      const secondaryApp = initializeApp({
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      }, "SecondaryRegistrationApp");

      const secondaryAuth = getAuth(secondaryApp);
      
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, newAdminEmail, newAdminPassword);
      
      if (userCredential.user.email) {
        // Now use our main connection to add them to the database
        await createAdminUser(userCredential.user.uid, userCredential.user.email);
      }

      // Cleanup
      await secondaryAuth.signOut();
      await deleteApp(secondaryApp);

      // Refresh UI
      setNewAdminEmail("");
      setNewAdminPassword("");
      await fetchAdmins();

    } catch (err: any) {
      setAdminError(err.message || "Failed to create administrator");
      console.error(err);
    } finally {
      setIsCreatingAdmin(false);
    }
  };

  const handleDeleteAdmin = async (uid: string) => {
    if (confirm("Are you sure you want to revoke this user's admin access?")) {
      try {
        await deleteAdminUser(uid);
        await fetchAdmins();
      } catch (err) {
        alert("Failed to delete admin document.");
      }
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
         <h1 className="text-3xl font-display text-primary">System Settings</h1>
         <p className="text-foreground/70 font-body text-sm mt-1">Manage platform configuration and internal access controls.</p>
      </div>

      {/* TABS */}
      <div className="flex space-x-2 border-b border-outline-variant/10 pb-4">
        <button 
          onClick={() => setActiveTab("platform")}
          className={`flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-medium transition-all ${
            activeTab === "platform" 
              ? "bg-primary-container/20 text-primary border border-primary-container/30" 
              : "text-foreground/60 hover:text-foreground hover:bg-surface-container"
          }`}
        >
          <Settings className="w-4 h-4" /> Global Configuration
        </button>
        <button 
          onClick={() => setActiveTab("access")}
          className={`flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-medium transition-all ${
            activeTab === "access" 
              ? "bg-primary-container/20 text-primary border border-primary-container/30" 
              : "text-foreground/60 hover:text-foreground hover:bg-surface-container"
          }`}
        >
          <Shield className="w-4 h-4" /> Access Management
        </button>
      </div>

      {/* PLATFORM CONFIGURATION TAB */}
      {activeTab === "platform" && (
        <form onSubmit={handleSaveConfig} className="bg-surface-container rounded-sm border border-outline-variant/10 p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="space-y-4 max-w-xl">
             <div>
               <label className="text-xs font-body text-foreground/50 uppercase tracking-widest block mb-2">Public Phone Line</label>
               <Input 
                 value={contactInfo.phone} 
                 onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                 placeholder="+1 234 567 890" 
               />
             </div>
             <div>
               <label className="text-xs font-body text-foreground/50 uppercase tracking-widest block mb-2">Public Email Inbox</label>
               <Input 
                 type="email"
                 value={contactInfo.email} 
                 onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                 placeholder="contact@brand.com" 
               />
             </div>
             <div>
               <label className="text-xs font-body text-foreground/50 uppercase tracking-widest block mb-2">Headquarters Address</label>
               <Input 
                 value={contactInfo.address} 
                 onChange={(e) => setContactInfo({...contactInfo, address: e.target.value})}
                 placeholder="City, Country" 
               />
             </div>
           </div>

           <div className="pt-4 flex items-center justify-between border-t border-outline-variant/10">
             <Button type="submit" variant="primary" disabled={loadingConfig}>
               {loadingConfig ? "Saving Engine..." : "Save Configuration"}
             </Button>
             {successConfig && <span className="text-primary-fixed text-sm font-body animate-pulse">Configuration updated successfully.</span>}
           </div>
        </form>
      )}

      {/* ACCESS MANAGEMENT TAB */}
      {activeTab === "access" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Create Admin Form */}
          <div className="bg-surface-container rounded-sm border border-outline-variant/10 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-sm bg-primary-container/20 flex items-center justify-center text-primary">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-display text-primary">Issue Credentials</h3>
                <p className="text-xs text-foreground/50">Generate a secure administrative account</p>
              </div>
            </div>

            {adminError && <div className="mb-4 text-xs text-error p-3 bg-error-container/20 rounded-sm border border-error/20">{adminError}</div>}

            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="text-xs font-body text-foreground/50 uppercase tracking-widest block mb-2">Authorized Email</label>
                <Input 
                  type="email" required
                  value={newAdminEmail} 
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="admin@brand.com" 
                />
              </div>
              <div>
                <label className="text-xs font-body text-foreground/50 uppercase tracking-widest block mb-2">Initial Password</label>
                <Input 
                  type="password" required minLength={6}
                  value={newAdminPassword} 
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  placeholder="Minimum 6 characters" 
                />
              </div>
              <Button type="submit" variant="primary" className="w-full mt-4" disabled={isCreatingAdmin}>
                {isCreatingAdmin ? "Engaging Secure Pipeline..." : "Generate Administrator"}
              </Button>
            </form>
          </div>

          {/* Active Admins List */}
          <div className="bg-surface-container rounded-sm border border-outline-variant/10 p-8 h-fit">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-sm bg-surface-container-high flex items-center justify-center text-foreground/70">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-display text-primary">Active Hierarchy</h3>
                <p className="text-xs text-foreground/50">Currently registered admin records</p>
              </div>
            </div>

            {loadingAdmins ? (
              <div className="flex items-center justify-center p-8 opacity-50">
                <div className="w-8 h-8 rounded-full border-t-2 border-primary animate-spin" />
              </div>
            ) : (
              <div className="space-y-3">
                {admins.map((admin) => (
                  <div key={admin.id} className="flex items-center justify-between p-3 rounded-sm bg-surface shadow-sm border border-outline-variant/10 grouphover:border-primary/20 transition-all">
                    <div>
                      <div className="text-sm font-medium text-foreground/90">{admin.email}</div>
                      <div className="text-xs text-foreground/40 mt-1">
                        Added: {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : 'Unknown'}
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDeleteAdmin(admin.id)}
                      className="p-2 text-foreground/30 hover:text-error hover:bg-error-container/20 rounded-sm transition-colors"
                      title="Revoke Admin Access"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                {admins.length === 0 && (
                  <div className="text-center p-6 text-foreground/40 text-sm">
                    No active admin records found in database.
                  </div>
                )}
              </div>
            )}
            
            <div className="mt-6 p-4 bg-outline-variant/5 border border-outline-variant/10 rounded-sm">
              <p className="text-xs text-foreground/60 leading-relaxed font-body">
                <strong className="text-foreground/80">Security Notice:</strong> Revoking access removes the user's hierarchy badge, instantly locking them out of the Operations Center, though their raw identity might remain in Firebase Auth.
              </p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
