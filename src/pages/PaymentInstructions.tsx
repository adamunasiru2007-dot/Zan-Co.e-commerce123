import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Copy, Check, MessageCircle, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Layout } from "@/components/layout/Layout";

const TIMER_DURATION = 30 * 60; // 30 minutes in seconds

const PaymentInstructions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [copied, setCopied] = useState<string | null>(null);
  
  const orderId = location.state?.orderId;
  const total = location.state?.total;

  useEffect(() => {
    if (!orderId) {
      navigate("/checkout");
      return;
    }
  }, [orderId, navigate]);

  useEffect(() => {
    if (timeLeft <= 0) {
      toast({
        title: "Payment time expired",
        description: "Your payment session has expired. Please try again.",
        variant: "destructive",
      });
      navigate("/checkout");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, navigate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const copyToClipboard = useCallback((text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    toast({
      title: "Copied!",
      description: `${field} copied to clipboard`,
    });
    setTimeout(() => setCopied(null), 2000);
  }, []);

  const handlePayed = () => {
    const message = encodeURIComponent("Payment sent please confirm");
    const whatsappNumber = "2348123456789"; // Replace with actual number
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
    navigate("/");
    toast({
      title: "Thank you!",
      description: "We will confirm your payment shortly.",
    });
  };

  const handleCancel = () => {
    toast({
      title: "Payment cancelled",
      description: "Your order has been cancelled.",
      variant: "destructive",
    });
    navigate("/checkout");
  };

  const bankDetails = {
    name: "Zaharadeen Adamu Nasiru",
    accountNumber: "2322885800",
    bank: "UBA",
  };

  const getTimerColor = () => {
    if (timeLeft <= 60) return "text-destructive";
    if (timeLeft <= 300) return "text-amber-500";
    return "text-primary";
  };

  if (!orderId) return null;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="border-2">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl">Payment Instructions</CardTitle>
            <p className="text-muted-foreground">
              Complete your payment within the time limit
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Timer */}
            <div className="flex flex-col items-center justify-center p-6 bg-muted rounded-lg">
              <Clock className={`h-8 w-8 mb-2 ${getTimerColor()}`} />
              <span className="text-sm text-muted-foreground mb-1">Time Remaining</span>
              <span className={`text-4xl font-mono font-bold ${getTimerColor()}`}>
                {formatTime(timeLeft)}
              </span>
            </div>

            {/* Order Info */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="font-mono text-sm">{orderId}</p>
              {total && (
                <>
                  <p className="text-sm text-muted-foreground mt-2">Amount to Pay</p>
                  <p className="text-2xl font-bold text-primary">₦{total.toLocaleString()}</p>
                </>
              )}
            </div>

            {/* Bank Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Bank Transfer Details</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Account Name</p>
                    <p className="font-medium">{bankDetails.name}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(bankDetails.name, "Account Name")}
                  >
                    {copied === "Account Name" ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Account Number</p>
                    <p className="font-mono font-medium text-lg">{bankDetails.accountNumber}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(bankDetails.accountNumber, "Account Number")}
                  >
                    {copied === "Account Number" ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Bank</p>
                    <p className="font-medium">{bankDetails.bank}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(bankDetails.bank, "Bank")}
                  >
                    {copied === "Bank" ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleCancel}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={handlePayed}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                I've Paid
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              After making payment, click "I've Paid" to notify us via WhatsApp
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PaymentInstructions;
