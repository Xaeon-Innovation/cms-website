"use client";

import { useEffect, useState } from "react";
import { getLeads } from "@/lib/firestore/leads";
import { getMobadraRequests } from "@/lib/firestore/mobadra";
import { getAllPendingReviews } from "@/lib/firestore/reviews";
import { Card } from "@/components/ui/card";
import { Users, HeartHandshake, MessageSquare, ArrowUpRight, Activity } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ leads: 0, newLeads: 0, mobadra: 0, newMobadra: 0, pendingReviews: 0 });
  
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [recentMobadra, setRecentMobadra] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [leadsData, reqsData, reviewsData] = await Promise.all([
          getLeads(),
          getMobadraRequests(),
          getAllPendingReviews()
        ]);
        
        const getSortValue = (val: any) => {
          if (!val) return 0;
          if (typeof val?.toMillis === 'function') return val.toMillis();
          return new Date(val).getTime();
        };

        const sortedLeads = [...leadsData].sort((a, b) => getSortValue(b.createdAt) - getSortValue(a.createdAt));
        const sortedMobadra = [...reqsData].sort((a, b) => getSortValue(b.createdAt) - getSortValue(a.createdAt));

        setStats({
          leads: leadsData.length,
          newLeads: leadsData.filter(l => l.status === 'new').length,
          mobadra: reqsData.length,
          newMobadra: reqsData.filter(m => m.status === 'pending').length,
          pendingReviews: reviewsData.length
        });

        // Store top 4 for the feeds
        setRecentLeads(sortedLeads.slice(0, 4));
        setRecentMobadra(sortedMobadra.slice(0, 4));
      } catch (err) {
        console.error("Dashboard Load Error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const cards = [
    { title: "Total Clinic Leads", value: stats.leads, desc: `${stats.newLeads} new acquisitions`, icon: Users, href: "/admin/leads", color: "text-primary" },
    { title: "Mobadra Requests", value: stats.mobadra, desc: `${stats.newMobadra} unreviewed cases`, icon: HeartHandshake, href: "/admin/mobadra-requests", color: "text-secondary" },
    { title: "Pending Reviews", value: stats.pendingReviews, desc: "Awaiting moderation", icon: MessageSquare, href: "/admin/reviews", color: "text-tertiary" }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
         <div className="w-10 h-10 border-t-2 border-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Badge className="mb-3"><Activity className="w-3 h-3 mr-1 inline-block" /> Live Telemetry</Badge>
          <h1 className="text-4xl font-display text-primary tracking-tight">Command Center</h1>
          <p className="text-foreground/70 font-body text-sm mt-2 max-w-xl">
            Real-time operations matrix monitoring acquisition pipelines, humanitarian requests, and global platform health.
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Card key={i} className="bg-gradient-to-br from-surface-container-high to-surface-container border border-outline-variant/10 relative group hover:border-primary/40 hover:shadow-lg transition-all p-6 overflow-hidden">
              <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-700">
                 <Icon className="w-40 h-40" />
              </div>
              
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className={`w-12 h-12 rounded-lg bg-surface flex items-center justify-center shadow-inner ${card.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <Link href={card.href} className="text-foreground/30 hover:text-primary transition-colors bg-surface-container p-2 rounded-full cursor-pointer">
                  <ArrowUpRight className="w-5 h-5" />
                </Link>
              </div>
              
              <div className="relative z-10">
                <h4 className="text-xs font-body text-foreground/50 uppercase tracking-widest">{card.title}</h4>
                <div className="text-5xl font-display font-medium text-foreground mt-2">{card.value}</div>
                <div className="flex items-center gap-2 mt-4 text-xs font-body">
                   <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                   <span className="text-foreground/60">{card.desc}</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Split Feeds */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Medical Leads Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-outline-variant/10 pb-4">
            <h3 className="text-xl font-display text-primary flex items-center gap-2">
               <Users className="w-5 h-5 text-foreground/40" />
               Recent Medical Leads
            </h3>
            <Link href="/admin/leads" className="text-xs uppercase tracking-widest font-body text-primary hover:text-primary-fixed transition-colors flex items-center gap-1">
              View Pipeline <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          
          <div className="bg-surface-container border border-outline-variant/10 rounded-lg overflow-hidden flex flex-col">
            {recentLeads.length > 0 ? recentLeads.map((lead) => (
              <div key={lead.id} className="p-4 border-b border-outline-variant/5 last:border-0 hover:bg-surface-container-high transition-colors flex items-center justify-between">
                 <div>
                    <div className="font-body text-sm text-foreground/90 font-medium">{lead.name}</div>
                    <div className="text-xs text-foreground/50 mt-1">{lead.service}</div>
                 </div>
                 <div className="text-right">
                    <Badge variant={lead.status === 'new' ? 'default' : 'outline'}>
                      {lead.status?.toUpperCase() || 'NEW'}
                    </Badge>
                    <div className="text-[10px] text-foreground/40 mt-2 uppercase tracking-widest">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </div>
                 </div>
              </div>
            )) : (
              <div className="p-8 text-center text-foreground/40 text-sm font-body">No leads recorded yet.</div>
            )}
          </div>
        </div>

        {/* Mobadra Requests Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-outline-variant/10 pb-4">
            <h3 className="text-xl font-display text-primary flex items-center gap-2">
               <HeartHandshake className="w-5 h-5 text-foreground/40" />
               Recent Humanitarian Requests
            </h3>
            <Link href="/admin/mobadra-requests" className="text-xs uppercase tracking-widest font-body text-primary hover:text-primary-fixed transition-colors flex items-center gap-1">
              View Cases <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          
          <div className="bg-surface-container border border-outline-variant/10 rounded-lg overflow-hidden flex flex-col">
            {recentMobadra.length > 0 ? recentMobadra.map((req) => (
              <div key={req.id} className="p-4 border-b border-outline-variant/5 last:border-0 hover:bg-surface-container-high transition-colors flex items-center justify-between">
                 <div>
                    <div className="font-body text-sm text-foreground/90 font-medium">{req.fullName}</div>
                    <div className="text-xs text-foreground/50 mt-1 max-w-[200px] truncate">{req.condition}</div>
                 </div>
                 <div className="text-right">
                    <Badge variant={req.status === 'pending' ? 'secondary' : 'outline'}>
                      {req.status?.toUpperCase() || 'PENDING'}
                    </Badge>
                    <div className="text-[10px] text-foreground/40 mt-2 uppercase tracking-widest">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </div>
                 </div>
              </div>
            )) : (
              <div className="p-8 text-center text-foreground/40 text-sm font-body">No requests recorded yet.</div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
