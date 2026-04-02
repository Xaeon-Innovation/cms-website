"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getApprovedReviews, createReview, Review } from "@/lib/firestore/reviews";
import {
  DEFAULT_REVIEW_AVATAR,
  REVIEW_AVATAR_PATHS,
  reviewAvatarSrc,
} from "@/lib/reviewAvatars";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const reviewAvatarEnum = z.enum(
  REVIEW_AVATAR_PATHS as unknown as [string, ...string[]]
);

const reviewSchema = z.object({
  name: z.string().min(2, "Name is required"),
  type: z.enum(["clinic", "patient", "mobadra"]),
  rating: z.number().min(1).max(5),
  text: z.string().min(10, "Please provide a detailed review"),
  avatarUrl: reviewAvatarEnum,
});

const formDefaultValues: z.infer<typeof reviewSchema> = {
  name: "",
  type: "clinic",
  rating: 5,
  text: "",
  avatarUrl: DEFAULT_REVIEW_AVATAR,
};

const AVATAR_PAGE_SIZE = 5;

function avatarPageMaxStart(length: number) {
  if (length <= AVATAR_PAGE_SIZE) return 0;
  return Math.floor((length - 1) / AVATAR_PAGE_SIZE) * AVATAR_PAGE_SIZE;
}

const avatarSlideVariants = {
  initial: (dir: number) => ({
    x: dir > 0 ? 28 : -28,
    opacity: 0,
  }),
  animate: {
    x: 0,
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -28 : 28,
    opacity: 0,
  }),
};

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<Review['type'] | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form setup
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: formDefaultValues,
  });
  const currentRating = watch("rating");
  const selectedAvatar = watch("avatarUrl");
  const avatarPageEnd = avatarPageMaxStart(REVIEW_AVATAR_PATHS.length);
  const [avatarStart, setAvatarStart] = useState(0);
  const avatarNavDir = useRef(0);

  useEffect(() => {
    const idx = REVIEW_AVATAR_PATHS.findIndex((p) => p === selectedAvatar);
    if (idx < 0) return;
    const target = Math.min(
      Math.floor(idx / AVATAR_PAGE_SIZE) * AVATAR_PAGE_SIZE,
      avatarPageEnd
    );
    setAvatarStart((prev) => {
      if (prev === target) return prev;
      avatarNavDir.current = target > prev ? 1 : -1;
      return target;
    });
  }, [selectedAvatar, avatarPageEnd]);

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
    reset(formDefaultValues);
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
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex min-w-0 flex-1 items-start gap-3">
                        <div className="relative size-12 shrink-0 overflow-hidden rounded-full bg-surface-container-low ring-1 ring-outline-variant/25">
                          {/* eslint-disable-next-line @next/next/no-img-element -- local SVG/PNG avatars from /public */}
                          <img
                            src={reviewAvatarSrc(rev.avatarUrl)}
                            alt=""
                            width={96}
                            height={96}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 space-y-1">
                          <CardTitle className="text-lg font-medium leading-snug">{rev.name}</CardTitle>
                          <Badge variant="secondary" className="text-[10px]">{rev.type}</Badge>
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-0.5 text-primary-fixed">
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
               <input type="hidden" {...register("avatarUrl")} />
               <Input placeholder="Your Name or Clinic Name" error={!!errors.name} {...register("name")} />

               <fieldset className="space-y-3">
                 <legend className="text-sm font-body text-foreground/70">
                   Choose a profile picture
                 </legend>
                 <div className="flex min-w-0 items-center gap-2">
                   <button
                     type="button"
                     onClick={() => {
                       avatarNavDir.current = -1;
                       setAvatarStart((s) => Math.max(0, s - AVATAR_PAGE_SIZE));
                     }}
                     disabled={avatarStart <= 0}
                     className={cn(
                       "inline-flex size-10 shrink-0 items-center justify-center rounded-sm border border-outline-variant/25 bg-surface-container-low text-foreground transition-colors",
                       "hover:border-outline-variant/45 hover:bg-surface-container",
                       "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
                       "disabled:pointer-events-none disabled:opacity-35"
                     )}
                     aria-label="Previous set of profile pictures"
                   >
                     <ChevronLeft className="size-5" aria-hidden />
                   </button>
                   <div className="relative min-h-[4.5rem] min-w-0 flex-1 overflow-hidden py-1">
                     <AnimatePresence mode="wait" initial={false}>
                       <motion.div
                         key={avatarStart}
                         role="presentation"
                         custom={avatarNavDir.current}
                         variants={avatarSlideVariants}
                         initial="initial"
                         animate="animate"
                         exit="exit"
                         transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                         className="grid grid-cols-5 gap-2 sm:gap-3"
                       >
                         {REVIEW_AVATAR_PATHS.slice(avatarStart, avatarStart + AVATAR_PAGE_SIZE).map((path, slotIdx) => {
                           const index = avatarStart + slotIdx;
                           const selected = selectedAvatar === path;
                           const n = index + 1;
                           return (
                             <button
                               key={path}
                               type="button"
                               onClick={() => setValue("avatarUrl", path, { shouldValidate: true })}
                               className={cn(
                                 "relative mx-auto aspect-square w-full max-w-[3.75rem] overflow-hidden rounded-full ring-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:max-w-[4.25rem]",
                                 selected
                                   ? "ring-primary shadow-md ring-offset-2 ring-offset-surface-container-low"
                                   : "ring-transparent opacity-90 hover:opacity-100 hover:ring-outline-variant/45"
                               )}
                               aria-label={
                                 selected
                                   ? `Profile picture ${n} of ${REVIEW_AVATAR_PATHS.length}, selected`
                                   : `Select profile picture ${n} of ${REVIEW_AVATAR_PATHS.length}`
                               }
                             >
                               {/* eslint-disable-next-line @next/next/no-img-element */}
                               <img src={path} alt="" className="h-full w-full object-cover" />
                             </button>
                           );
                         })}
                       </motion.div>
                     </AnimatePresence>
                   </div>
                   <button
                     type="button"
                     onClick={() => {
                       avatarNavDir.current = 1;
                       setAvatarStart((s) => Math.min(avatarPageEnd, s + AVATAR_PAGE_SIZE));
                     }}
                     disabled={avatarStart >= avatarPageEnd}
                     className={cn(
                       "inline-flex size-10 shrink-0 items-center justify-center rounded-sm border border-outline-variant/25 bg-surface-container-low text-foreground transition-colors",
                       "hover:border-outline-variant/45 hover:bg-surface-container",
                       "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
                       "disabled:pointer-events-none disabled:opacity-35"
                     )}
                     aria-label="Next set of profile pictures"
                   >
                     <ChevronRight className="size-5" aria-hidden />
                   </button>
                 </div>
                 {errors.avatarUrl && (
                   <span className="text-error text-xs">{errors.avatarUrl.message}</span>
                 )}
               </fieldset>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <select
                   className="w-full h-12 rounded-sm bg-surface-container-low px-4 font-body text-foreground placeholder:text-outline-variant/70 border border-outline-variant/25 transition-[background-color,border-color,box-shadow] duration-200 hover:border-outline-variant/45 hover:bg-surface-container-low/90 focus-visible:outline-none focus-visible:border-primary/70 focus-visible:bg-surface-container focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:shadow-[0_18px_60px_rgba(0,0,0,0.18)]"
                   {...register("type")}
                 >
                   <option value="patient">Patient Care</option>
                   <option value="clinic">Clinic Acquisition</option>
                   <option value="mobadra">Mobadra Initiative</option>
                 </select>
                 
                 <div className="flex items-center justify-between sm:justify-end gap-2 rounded-sm bg-surface-container-low px-4 min-h-12 border border-outline-variant/25 transition-[background-color,border-color,box-shadow] duration-200 hover:border-outline-variant/45 hover:bg-surface-container-low/90 focus-within:border-primary/70 focus-within:bg-surface-container focus-within:ring-2 focus-within:ring-primary/25 focus-within:shadow-[0_18px_60px_rgba(0,0,0,0.18)]">
                   <span className="text-xs text-foreground/50 mr-2 shrink-0">Rating</span>
                   {[1,2,3,4,5].map(star => (
                     <button
                       type="button"
                       key={star}
                       onClick={() => setValue('rating', star)}
                       className={cn(
                         "text-xl transition-transform duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 rounded-sm px-0.5",
                         currentRating >= star ? "text-primary" : "text-outline-variant/80",
                         "hover:scale-110"
                       )}
                       aria-label={`Set rating to ${star} star${star === 1 ? "" : "s"}`}
                     >
                       ★
                     </button>
                   ))}
                 </div>
               </div>

               <div>
                 <textarea 
                  placeholder="Your detailed review..." 
                  className={cn(
                    "flex w-full min-h-[120px] rounded-sm bg-surface-container-low px-4 py-3 font-body text-base text-foreground placeholder:text-outline-variant/70 border border-outline-variant/25 transition-[background-color,border-color,box-shadow] duration-200 hover:border-outline-variant/45 hover:bg-surface-container-low/90 focus-visible:outline-none focus-visible:border-primary/70 focus-visible:bg-surface-container focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:shadow-[0_18px_60px_rgba(0,0,0,0.18)] resize-none",
                    errors.text && "border-error/70 hover:border-error focus-visible:border-error focus-visible:ring-error/25"
                  )}
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
