import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Shield, Lock, CreditCard, Mail, AlertTriangle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface SecurePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: string;
  price: string;
}

export default function SecurePaymentModal({ isOpen, onClose, plan, price }: SecurePaymentModalProps) {
  const [email, setEmail] = useState("");
  const [paymentData, setPaymentData] = useState<any>(null);

  const paymentMutation = useMutation({
    mutationFn: async (data: { plan: string; email: string }) => {
      return apiRequest("/api/payment/process", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      });
    },
    onSuccess: (data) => {
      setPaymentData(data.payment);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      paymentMutation.mutate({ plan, email });
    }
  };

  const handleClose = () => {
    setEmail("");
    setPaymentData(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-bg-primary border border-bg-tertiary max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-text-primary flex items-center text-2xl mb-4">
            <Shield className="mr-3 text-discord" size={28} />
            Ultra-Secure Payment Processing
          </DialogTitle>
        </DialogHeader>

        {!paymentData ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-bg-secondary border border-bg-tertiary rounded-lg p-6">
              <h3 className="text-xl font-semibold text-text-primary mb-4 flex items-center">
                <Lock className="mr-2 text-accent-success" size={20} />
                {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan - {price}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-accent-success">
                  <Shield className="mr-2" size={16} />
                  Military-grade encryption
                </div>
                <div className="flex items-center text-accent-success">
                  <Lock className="mr-2" size={16} />
                  Zero data storage
                </div>
                <div className="flex items-center text-accent-success">
                  <CreditCard className="mr-2" size={16} />
                  Secure bank transfer
                </div>
                <div className="flex items-center text-accent-success">
                  <Mail className="mr-2" size={16} />
                  Encrypted communication
                </div>
              </div>

              <div className="bg-accent-warning/10 border border-accent-warning/30 rounded p-4 mb-4">
                <div className="flex items-center text-accent-warning mb-2">
                  <AlertTriangle className="mr-2" size={16} />
                  <span className="font-semibold">Maximum Security Protocol</span>
                </div>
                <p className="text-text-secondary text-sm">
                  Bank details are encrypted with military-grade security and never displayed in browsers. 
                  Payment instructions will be sent to your secure email.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-text-primary font-medium mb-2">
                  Secure Email Address
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="bg-bg-secondary border-bg-tertiary text-text-primary"
                />
                <p className="text-text-secondary text-sm mt-1">
                  Payment details will be sent here via encrypted email
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                type="submit"
                disabled={!email || paymentMutation.isPending}
                className="bg-gradient-to-r from-discord to-discord-dark text-white px-6 py-3 rounded-lg font-semibold flex-1"
              >
                {paymentMutation.isPending ? (
                  "Processing..."
                ) : (
                  <>
                    <Shield className="mr-2" size={16} />
                    Generate Secure Payment
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="border-bg-tertiary text-text-secondary hover:text-text-primary px-6 py-3 rounded-lg"
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="bg-accent-success/10 border border-accent-success/30 rounded-lg p-6">
              <div className="flex items-center text-accent-success mb-4">
                <Shield className="mr-2" size={20} />
                <span className="text-xl font-semibold">Payment Generated Successfully</span>
              </div>
              
              <div className="bg-bg-secondary border border-bg-tertiary rounded p-4 mb-4">
                <h4 className="text-text-primary font-semibold mb-2">Payment Reference:</h4>
                <code className="text-discord text-lg font-mono bg-bg-primary px-3 py-2 rounded border">
                  {paymentData.reference}
                </code>
              </div>

              <div className="space-y-3 text-text-secondary">
                <p><strong className="text-text-primary">Amount:</strong> €{paymentData.amount}</p>
                <p><strong className="text-text-primary">Payment ID:</strong> {paymentData.paymentId}</p>
              </div>
            </div>

            <div className="bg-bg-secondary border border-bg-tertiary rounded-lg p-6">
              <h4 className="text-text-primary font-semibold mb-3 flex items-center">
                <Lock className="mr-2 text-accent-warning" size={16} />
                Secure Payment Instructions
              </h4>
              <div className="whitespace-pre-line text-text-secondary text-sm bg-bg-primary p-4 rounded border font-mono">
                {paymentData.instructions}
              </div>
            </div>

            <div className="bg-accent-warning/10 border border-accent-warning/30 rounded p-4">
              <div className="flex items-center text-accent-warning mb-2">
                <AlertTriangle className="mr-2" size={16} />
                <span className="font-semibold">Security Notice</span>
              </div>
              <p className="text-text-secondary text-sm">
                Bank details are encrypted and will be provided separately via secure email. 
                Never share your payment reference with unauthorized parties.
              </p>
            </div>

            <Button
              onClick={handleClose}
              className="w-full bg-gradient-to-r from-accent-success to-discord text-white py-3 rounded-lg font-semibold"
            >
              <Shield className="mr-2" size={16} />
              Close Secure Session
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}