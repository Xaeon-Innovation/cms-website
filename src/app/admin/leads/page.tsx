"use client";

import { useState, useEffect } from "react";
import { Lead, getLeads, updateLeadStatus } from "@/lib/firestore/leads";
import { Badge } from "@/components/ui/badge";

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const data = await getLeads();
    setLeads(data);
    setLoading(false);
  };

  const handleStatusChange = async (id: string, newStatus: Lead['status']) => {
    await updateLeadStatus(id, newStatus);
    fetchData();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4 flex-wrap mb-8">
        <div>
          <h1 className="text-3xl font-display text-primary">Leads Pipeline</h1>
          <p className="text-foreground/70 font-body text-sm mt-1">Manage consultation requests and clinic acquisition leads.</p>
        </div>
        <Badge variant="outline">{leads.length} Total Leads</Badge>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="p-12 flex justify-center"><div className="w-6 h-6 border-t-2 border-primary rounded-full animate-spin"></div></div>
        ) : (
          <>
          <div className="md:hidden space-y-4">
            {leads.map((lead) => (
              <div key={lead.id} className="bg-surface-container rounded-sm border border-outline-variant/10 p-4 space-y-4">
                <div>
                  <div className="font-medium text-primary-container">{lead.name}</div>
                  <div className="text-foreground/60 text-xs space-y-1 mt-1 break-all">
                    <div>{lead.email}</div>
                    <div>{lead.phone}</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-[10px]">{lead.service}</Badge>
                  <Badge 
                    variant={lead.status === 'new' ? 'danger' : lead.status === 'contacted' ? 'secondary' : 'default'}
                    className="text-[10px] lowercase"
                  >
                    {lead.status}
                  </Badge>
                </div>
                <div className="text-sm text-foreground/70 break-words">
                  {lead.message || <span className="italic opacity-50">No message</span>}
                </div>
                <select 
                  aria-label={`Update status for ${lead.name}`}
                  className="w-full bg-surface-container-high border border-outline-variant/20 rounded-sm text-xs px-3 py-2 text-foreground/80 outline-none"
                  value={lead.status}
                  onChange={(e) => handleStatusChange(lead.id!, e.target.value as any)}
                >
                  <option value="new">Mark New</option>
                  <option value="contacted">Mark Contacted</option>
                  <option value="closed">Mark Closed</option>
                </select>
              </div>
            ))}
            {leads.length === 0 && (
              <div className="text-center py-12 text-foreground/40 italic bg-surface-container rounded-sm border border-outline-variant/10">No leads found in pipeline.</div>
            )}
          </div>
          <div className="hidden md:block bg-surface-container rounded-sm border border-outline-variant/10 overflow-x-auto">
            <table className="w-full text-left font-body text-sm">
              <thead className="bg-surface-container-high text-foreground/50 border-b border-outline-variant/10 text-xs uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4 font-normal">Contact Info</th>
                  <th className="px-6 py-4 font-normal">Service</th>
                  <th className="px-6 py-4 font-normal">Message</th>
                  <th className="px-6 py-4 font-normal">Status</th>
                  <th className="px-6 py-4 font-normal">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-primary-container">{lead.name}</div>
                      <div className="text-foreground/60 text-xs space-y-1 mt-1">
                        <div>{lead.email}</div>
                        <div>{lead.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary" className="text-[10px]">{lead.service}</Badge>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate text-foreground/70">
                      {lead.message || <span className="italic opacity-50">No message</span>}
                    </td>
                    <td className="px-6 py-4">
                      <Badge 
                        variant={lead.status === 'new' ? 'danger' : lead.status === 'contacted' ? 'secondary' : 'default'}
                        className="text-[10px] lowercase"
                      >
                        {lead.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        aria-label={`Update status for ${lead.name}`}
                        className="bg-surface-container-high border border-outline-variant/20 rounded-sm text-xs px-2 py-1 text-foreground/80 outline-none"
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id!, e.target.value as any)}
                      >
                        <option value="new">Mark New</option>
                        <option value="contacted">Mark Contacted</option>
                        <option value="closed">Mark Closed</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {leads.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-12 text-foreground/40 italic">No leads found in pipeline.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          </>
        )}
      </div>
    </div>
  );
}
