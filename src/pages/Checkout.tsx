import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CreditCard, Building2, CheckCircle, ArrowLeft, Lock } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [transactionId, setTransactionId] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    email: user?.email || "",
    name: user?.name || "",
    address: "",
    city: "",
    zipCode: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  });

  const shipping = totalPrice > 50 ? 0 : 4.99;
  const tax = totalPrice * 0.08;
  const orderTotal = totalPrice + shipping + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate payment result (90% success rate)
    const isSuccess = Math.random() > 0.1;

    if (isSuccess) {
      const txId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      setTransactionId(txId);
      setIsComplete(true);
      clearCart();
      toast({
        title: "Payment Successful!",
        description: `Transaction ID: ${txId}`,
      });
    } else {
      toast({
        title: "Payment Failed",
        description: "Please try again or use a different payment method",
        variant: "destructive",
      });
    }

    setIsProcessing(false);
  };

  if (items.length === 0 && !isComplete) {
    navigate("/cart");
    return null;
  }

  if (isComplete) {
    return (
      <Layout>
        <div className="container py-16">
          <div className="max-w-md mx-auto text-center animate-fade-in">
            <div className="mb-6">
              <div className="h-20 w-20 mx-auto rounded-full bg-success-light flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground mb-6">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
            <Card className="mb-6">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Transaction ID</p>
                <p className="font-mono font-medium">{transactionId}</p>
              </CardContent>
            </Card>
            <p className="text-sm text-muted-foreground mb-6">
              A confirmation email has been sent to {formData.email}
            </p>
            <Link to="/">
              <Button size="lg" className="gap-2">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <Button
          variant="ghost"
          className="mb-6 gap-2"
          onClick={() => navigate("/cart")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Cart
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Checkout</h1>

            {!isAuthenticated && (
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <p className="text-sm mb-3">
                    Already have an account?{" "}
                    <Link to="/auth" className="text-primary font-medium hover:underline">
                      Sign in
                    </Link>{" "}
                    for a faster checkout.
                  </p>
                </CardContent>
              </Card>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="grid gap-3"
                  >
                    <Label
                      htmlFor="card"
                      className="flex items-center gap-3 p-4 rounded-lg border cursor-pointer [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5"
                    >
                      <RadioGroupItem value="card" id="card" />
                      <CreditCard className="h-5 w-5" />
                      <span>Credit / Debit Card</span>
                    </Label>
                    <Label
                      htmlFor="transfer"
                      className="flex items-center gap-3 p-4 rounded-lg border cursor-pointer [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5"
                    >
                      <RadioGroupItem value="transfer" id="transfer" />
                      <Building2 className="h-5 w-5" />
                      <span>Bank Transfer</span>
                    </Label>
                  </RadioGroup>

                  {paymentMethod === "card" && (
                    <div className="space-y-4 pt-4 border-t">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="cardExpiry">Expiry Date</Label>
                          <Input
                            id="cardExpiry"
                            name="cardExpiry"
                            placeholder="MM/YY"
                            value={formData.cardExpiry}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cardCvc">CVC</Label>
                          <Input
                            id="cardCvc"
                            name="cardCvc"
                            placeholder="123"
                            value={formData.cardCvc}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Button
                type="submit"
                size="lg"
                className="w-full gap-2"
                disabled={isProcessing}
              >
                <Lock className="h-4 w-4" />
                {isProcessing ? "Processing..." : `Pay $${orderTotal.toFixed(2)}`}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:order-2">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-sm">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-primary">${orderTotal.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
