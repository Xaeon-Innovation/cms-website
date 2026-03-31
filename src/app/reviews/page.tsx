"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getApprovedReviews, createReview, Review } from "@/lib/firestore/reviews";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const reviewSchema = z.object({
  name: z.string().min(2, "Name is required"),
  type: z.enum(["clinic", "patient", "mobadra"]),
  rating: z.number().min(1).max(5),
  text: z.string().min(10, "Please provide a detailed review"),
});

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<Review['type'] | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form setup
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { type: 'clinic', rating: 5 }
  });
  const currentRating = watch("rating");

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  const fetchReviews = async () => {
    setLoading(true);
    const data = await getApprovedReviews(filter === 'all' ? undefined : filter);
    setReviews(data);
    setLoading(false);
  };

  const onSubmit = async (values: z.infer<typeof reviewSchema>) => {
    setSubmitting(true);
    await createReview(values);
    setSuccess(true);
    reset();
    setSubmitting(false);
  };

  return (
    <div className="bg-surface pt-28 md:pt-32 pb-20 md:pb-24">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-16 text-center">
        <h1 className="text-4xl sm:text-5xl font-display font-medium text-primary-fixed mb-6">Patient Success Stories</h1>
        
        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          {['all', 'clinic', 'patient', 'mobadra'].map((t) => (
             <button
               key={t}
               onClick={() => setFilter(t as any)}
               className={`px-4 py-2 font-body text-sm rounded-full transition-colors border ${
                 filter === t 
                 ? "bg-primary-fixed text-on-primary-fixed border-primary-fixed font-medium" 
                 : "bg-surface-container text-foreground/70 border-outline-variant hover:text-foreground"
               }`}
             >
               {t.charAt(0).toUpperCase() + t.slice(1)} {t === 'all' ? 'Reviews' : ''}
             </button>
          ))}
        </div>
      </section>

      {/* Masonry-style Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-24 md:mb-32 min-h-[400px]">
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="w-8 h-8 rounded-full border-t border-primary animate-spin" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center p-12 text-foreground/50 font-body">No reviews found in this category.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((rev, i) => (
              <motion.div key={rev.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="h-full bg-surface-container/60 hover:bg-surface-container transition-colors border-0">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="text-lg font-medium">{rev.name}</CardTitle>
                        <Badge variant="secondary" className="text-[10px]">{rev.type}</Badge>
                      </div>
                      <div className="flex gap-1 text-primary-fixed">
                        {Array.from({ length: rev.rating }).map((_, r) => <span key={r}>★</span>)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/80 font-body text-sm leading-relaxed italic">"{rev.text}"</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Submission Form */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6">
         <div className="glass p-6 sm:p-8 md:p-12 ghost-border rounded-sm">
           <h3 className="text-2xl font-display text-primary mb-6 text-center">Share Your Experience</h3>
           
           {success ? (
             <div className="text-center space-y-4 py-8">
               <div className="text-4xl text-primary">★</div>
               <p className="font-body text-foreground">Thank you! Your review has been submitted for moderation.</p>
               <Button variant="ghost" onClick={() => setSuccess(false)}>Write Another</Button>
             </div>
           ) : (
             <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
               <Input placeholder="Your Name or Clinic Name" error={!!errors.name} {...register("name")} />
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <select className="bg-surface-container-low h-12 px-4 border-b border-transparent focus:border-primary font-body text-foreground outline-none" {...register("type")}>
                   <option value="patient">Patient Care</option>
                   <option value="clinic">Clinic Acquisition</option>
                   <option value="mobadra">Mobadra Initiative</option>
                 </select>
                 
                 <div className="flex items-center justify-between sm:justify-end gap-2 bg-surface-container-low px-4 min-h-12 border-b border-transparent">
                   <span className="text-xs text-foreground/50 mr-2 shrink-0">Rating</span>
                   {[1,2,3,4,5].map(star => (
                     <button type="button" key={star} onClick={() => setValue('rating', star)} className={`text-xl ${currentRating >= star ? 'text-primary' : 'text-outline-variant'}`}>
                       ★
                     </button>
                   ))}
                 </div>
               </div>

               <div>
                 <textarea 
                  placeholder="Your detailed review..." 
                  className={`flex w-full min-h-[120px] bg-surface-container-low px-4 py-3 font-body text-base placeholder:text-outline-variant border-b border-transparent focus-visible:outline-none focus:border-primary focus:bg-surface-container transition-all resize-none ${errors.text ? "border-error focus:border-error" : ""}`}
                  {...register("text")} 
                 />
                 {errors.text && <span className="text-error text-xs block mt-1">{errors.text.message}</span>}
               </div>

               <Button type="submit" className="w-full" disabled={submitting}>
                 {submitting ? "Submitting..." : "Submit Review"}
               </Button>
             </form>
           )}
         </div>
      </section>
    </div>
  );
}
