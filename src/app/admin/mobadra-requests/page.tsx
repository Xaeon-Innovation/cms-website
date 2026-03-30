"use client";

import { useState, useEffect } from "react";
import { MobadraRequest, getMobadraRequests, completeMobadraRequest, assignCoordinator } from "@/lib/firestore/mobadra";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminMobadraPage() {
  const [requests, setRequests] = useState<MobadraRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const data = await getMobadraRequests();
    setRequests(data);
    setLoading(false);
  };

  const handleAssign = async (id: string) => {
    const name = prompt("Enter the name of the coordinator to assign:");
    if (!name) return;
    await assignCoordinator(id, name);
    fetchData();
  };

  const handleComplete = async (id: string) => {
    if(confirm("Mark this humanitarian request as completed?")) {
      await completeMobadraRequest(id);
      fetchData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
           <Badge className="font-arabic mb-2 bg-primary text-on-primary">مبادرة</Badge>
           <h1 className="text-3xl font-display text-primary">Humanitarian Coordination</h1>
           <p className="text-foreground/70 font-body text-sm mt-1">Manage patient emergency travel, logging, and hospital routing.</p>
        </div>
        <Badge variant="outline">{requests.length} Requests</Badge>
      </div>

      <div className="bg-surface-container rounded-sm border border-outline-variant/10 overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center"><div className="w-6 h-6 border-t-2 border-primary rounded-full animate-spin"></div></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-body text-sm">
              <thead className="bg-surface-container-high text-foreground/50 border-b border-outline-variant/10 text-xs uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4 font-normal">Patient Info</th>
                  <th className="px-6 py-4 font-normal">Routing</th>
                  <th className="px-6 py-4 font-normal">Status/Coord.</th>
                  <th className="px-6 py-4 font-normal">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-surface-container-low transition-colors">
                     <td className="px-6 py-4">
                      <div className="font-medium text-primary-fixed">{req.name}</div>
                      <div className="text-foreground/60 text-xs mt-1">{req.phone}</div>
                    </td>
                    <td className="px-6 py-4 space-y-1">
                      <div className="text-foreground/80"><span className="text-foreground/40 text-xs mr-2 uppercase tracking-wide">City</span> {req.city}</div>
                      <div className="text-foreground/80"><span className="text-foreground/40 text-xs mr-2 uppercase tracking-wide">Target</span> {req.hospitalNeeded}</div>
                    </td>
                    <td className="px-6 py-4">
                       <Badge 
                         variant={req.status === 'pending' ? 'danger' : req.status === 'assigned' ? 'secondary' : 'success'}
                         className="text-[10px] lowercase mb-2 block w-fit"
                       >
                         {req.status}
                       </Badge>
                       {req.assignedCoordinator && (
                         <div className="text-xs text-primary-container">👤 {req.assignedCoordinator}</div>
                       )}
                    </td>
                    <td className="px-6 py-4 space-x-2">
                       {req.status === 'pending' && (
                         <Button variant="secondary" size="sm" onClick={() => handleAssign(req.id!)}>Assign</Button>
                       )}
                       {req.status === 'assigned' && (
                         <Button variant="primary" size="sm" onClick={() => handleComplete(req.id!)}>Complete</Button>
                       )}
                    </td>
                  </tr>
                ))}
                {requests.length === 0 && (
                  <tr><td colSpan={4} className="text-center py-12 text-foreground/40 italic">No Mobadra requests pending.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
