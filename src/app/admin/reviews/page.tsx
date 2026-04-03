"use client";

import { useState, useEffect, useCallback, startTransition } from "react";
import { Review, getAllPendingReviews, getApprovedReviews, updateReviewStatus } from "@/lib/firestore/reviews";
import { reviewAvatarSrc } from "@/lib/reviewAvatars";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [tab, setTab] = useState<'pending' | 'approved'>('pending');
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const data = tab === "pending" ? await getAllPendingReviews() : await getApprovedReviews();
    setReviews(data);
    setLoading(false);
  }, [tab]);

  useEffect(() => {
    startTransition(() => {
      void fetchData();
    });
  }, [fetchData]);

  const processReview = async (id: string, status: "approved" | "rejected") => {
    if (!confirm(`Are you sure you want to mark this review as ${status}?`)) return;
    await updateReviewStatus(id, status);
    fetchData();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-3xl font-display text-primary">Reputation Moderation</h1>
           <p className="text-foreground/70 font-body text-sm mt-1">
             Approve or reject testimonials. After someone submits a review on the site, they get their text copied to the clipboard and links to your public Google and Facebook review pages — no API keys required. Approved reviews appear here on the site and in search JSON-LD.
           </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-4 border-b border-outline-variant/10 pb-4">
        <button 
          onClick={() => setTab('pending')}
          className={`font-body text-sm pb-1 ${tab === 'pending' ? 'text-primary border-b border-primary' : 'text-foreground/50 hover:text-foreground'}`}
        >
          Pending Review
        </button>
        <button 
          onClick={() => setTab('approved')}
          className={`font-body text-sm pb-1 ${tab === 'approved' ? 'text-primary border-b border-primary' : 'text-foreground/50 hover:text-foreground'}`}
        >
          Live Published
        </button>
      </div>

      <div className="space-y-4">
         {loading ? (
             <div className="p-12 flex justify-center"><div className="w-6 h-6 border-t-2 border-primary rounded-full animate-spin"></div></div>
         ) : reviews.length === 0 ? (
             <div className="p-12 text-center text-foreground/40 italic font-body bg-surface-container rounded-sm border border-outline-variant/10">No {tab} reviews found.</div>
         ) : (
             reviews.map((rev) => (
               <div key={rev.id} className="bg-surface-container rounded-sm border border-outline-variant/10 p-4 sm:p-6 flex flex-col md:flex-row gap-6 justify-between items-start">
                  <div className="space-y-4">
                     <div className="flex flex-wrap items-center gap-3">
                        <div className="relative size-10 shrink-0 overflow-hidden rounded-full bg-surface-container-low ring-1 ring-outline-variant/20">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={reviewAvatarSrc(rev.avatarUrl)}
                            alt=""
                            width={80}
                            height={80}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span className="font-display text-primary-container text-lg">{rev.name}</span>
                        <Badge variant="secondary" className="text-[10px]">{rev.type}</Badge>
                        <span className="text-primary-fixed text-sm">{'★'.repeat(rev.rating)}</span>
                     </div>
                     <p className="text-foreground/80 font-body italic text-sm leading-relaxed border-l-2 border-outline-variant/30 pl-4 py-1">
                       &ldquo;{rev.text}&rdquo;
                     </p>
                  </div>
                  
                  {tab === 'pending' && (
                     <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 w-full md:w-auto">
                        <Button variant="primary" size="sm" onClick={() => processReview(rev.id!, 'approved')}>Approve (Publish)</Button>
                        <Button variant="ghost" className="text-error hover:text-error hover:bg-error-container/10" size="sm" onClick={() => processReview(rev.id!, 'rejected')}>Reject (Trash)</Button>
                     </div>
                  )}
               </div>
             ))
         )}
      </div>
    </div>
  );
}
