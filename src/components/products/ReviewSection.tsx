import { useState, useEffect } from "react";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ProductRating } from "./ProductRating";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Review {
  id: string;
  user_id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
  user_name?: string;
}

interface ReviewSectionProps {
  productId: string;
}

export function ReviewSection({ productId }: ReviewSectionProps) {
  const { isAuthenticated, user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newRating, setNewRating] = useState(0);
  const [newReview, setNewReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasUserReviewed, setHasUserReviewed] = useState(false);

  useEffect(() => {
    loadReviews();
  }, [productId]);

  useEffect(() => {
    if (user) {
      setHasUserReviewed(reviews.some((r) => r.user_id === user.id));
    }
  }, [reviews, user]);

  const loadReviews = async () => {
    try {
      const { data, error } = await supabase
        .from("product_reviews")
        .select("*")
        .eq("product_id", productId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch user names for reviews
      const reviewsWithNames = await Promise.all(
        (data || []).map(async (review) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("name")
            .eq("user_id", review.user_id)
            .maybeSingle();
          
          return {
            ...review,
            user_name: profile?.name || "Anonymous",
          };
        })
      );

      setReviews(reviewsWithNames);
    } catch (error) {
      console.error("Error loading reviews:", error);
    }
  };

  const handleSubmitReview = async () => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to leave a review",
        variant: "destructive",
      });
      return;
    }

    if (newRating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a star rating",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("product_reviews").insert({
        product_id: productId,
        user_id: user.id,
        rating: newRating,
        review_text: newReview || null,
      });

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already reviewed",
            description: "You have already reviewed this product",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return;
      }

      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });

      setNewRating(0);
      setNewReview("");
      loadReviews();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <div className="mt-12 pt-8 border-t border-border/50">
      <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

      {/* Summary */}
      <div className="flex items-center gap-4 mb-8">
        <ProductRating rating={averageRating} size="lg" />
        <span className="text-lg font-medium">
          {averageRating.toFixed(1)} out of 5
        </span>
        <span className="text-muted-foreground">
          ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
        </span>
      </div>

      {/* Write Review */}
      {isAuthenticated && !hasUserReviewed && (
        <div className="bg-card/50 rounded-xl p-6 mb-8 border border-border/50">
          <h3 className="font-semibold mb-4">Write a Review</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Your Rating
              </label>
              <ProductRating
                rating={newRating}
                onRatingChange={setNewRating}
                readonly={false}
                size="lg"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Your Review (optional)
              </label>
              <Textarea
                placeholder="Share your thoughts about this product..."
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                rows={3}
              />
            </div>
            <Button
              onClick={handleSubmitReview}
              disabled={isSubmitting || newRating === 0}
              className="shadow-glow"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </div>
      )}

      {!isAuthenticated && (
        <p className="text-muted-foreground mb-8">
          <a href="/auth" className="text-primary hover:underline">
            Sign in
          </a>{" "}
          to leave a review
        </p>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No reviews yet. Be the first to review this product!
          </p>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="bg-card/30 rounded-xl p-4 border border-border/30"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">{review.user_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <ProductRating rating={review.rating} size="sm" />
              {review.review_text && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {review.review_text}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
