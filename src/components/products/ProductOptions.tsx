import { cn } from "@/lib/utils";

interface ProductOptionsProps {
  sizes: string[];
  colors: { name: string; hex: string }[];
  selectedSize: string;
  selectedColor: string;
  onSizeChange: (size: string) => void;
  onColorChange: (color: string) => void;
}

export function ProductOptions({
  sizes,
  colors,
  selectedSize,
  selectedColor,
  onSizeChange,
  onColorChange,
}: ProductOptionsProps) {
  return (
    <div className="space-y-4">
      {/* Size Selector */}
      {sizes.length > 0 && (
        <div>
          <label className="text-sm font-medium mb-2 block">Size:</label>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => onSizeChange(size)}
                className={cn(
                  "px-4 py-2 rounded-lg border text-sm font-medium transition-all",
                  selectedSize === size
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:border-primary/50 bg-card"
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Color Selector */}
      {colors.length > 0 && (
        <div>
          <label className="text-sm font-medium mb-2 block">
            Color: <span className="text-muted-foreground">{selectedColor}</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color.name}
                onClick={() => onColorChange(color.name)}
                className={cn(
                  "h-8 w-8 rounded-full border-2 transition-all",
                  selectedColor === color.name
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                    : "hover:scale-110"
                )}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Default options for products
export const defaultSizes = ["XS", "S", "M", "L", "XL", "XXL"];
export const defaultColors = [
  { name: "Black", hex: "#1a1a1a" },
  { name: "White", hex: "#ffffff" },
  { name: "Navy", hex: "#1e3a5f" },
  { name: "Green", hex: "#22c55e" },
  { name: "Red", hex: "#ef4444" },
  { name: "Blue", hex: "#3b82f6" },
];
