import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductRatingProps {
  rating: number;
  totalReviews?: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

export function ProductRating({
  rating,
  totalReviews,
  onRatingChange,
  readonly = true,
  size = "md",
}: ProductRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const handleClick = (value: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = readonly
            ? star <= Math.round(rating)
            : star <= (hoverRating || rating);

          return (
            <button
              key={star}
              type="button"
              disabled={readonly}
              onClick={() => handleClick(star)}
              onMouseEnter={() => !readonly && setHoverRating(star)}
              onMouseLeave={() => !readonly && setHoverRating(0)}
              className={cn(
                "transition-colors",
                !readonly && "cursor-pointer hover:scale-110"
              )}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  filled
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-muted text-muted-foreground/30"
                )}
              />
            </button>
          );
        })}
      </div>
      {totalReviews !== undefined && (
        <span className="text-xs text-muted-foreground ml-1">
          ({totalReviews})
        </span>
      )}
    </div>
  );
}
