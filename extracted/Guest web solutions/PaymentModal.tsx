import { useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useFirestore } from "@/hooks/useFirestore";
import {
  X, CreditCard, Smartphone, Wallet, Building2, CheckCircle,
  Copy, ArrowLeft
} from "lucide-react";

interface PaymentModalProps {
  plan: { name: string; price: string; numericAmount: string } | null;
  onClose: () => void;
}

const BANK_DETAILS = {
  name: "JAFAR PULIKKALAKATH",
  accountNo: "67202311975",
  branch: "pulparamba",
  branchCode: "70593",
  ifsc: "SBIN0070593",
  bank: "State Bank of India",
  phonePeUPI: "jafarpulikkalakath@ybl",
};

const PAYMENT_METHODS = [
  { id: "card", label: "Card Payment", icon: CreditCard, desc: "Pay via Credit/Debit Card" },
  { id: "gpay", label: "Google Pay", icon: Smartphone, desc: "Pay using Google Pay" },
  { id: "phonepe", label: "PhonePe", icon: Wallet, desc: "Pay using PhonePe" },
  { id: "paytm", label: "Paytm", icon: Smartphone, desc: "Pay using Paytm" },
  { id: "upi", label: "UPI Payment", icon: Building2, desc: "Pay via any UPI app" },
];

function buildLinks(amount: string) {
  const pa = BANK_DETAILS.phonePeUPI;
  const pn = "Jafar%20Pulikkalakath";
  const am = amount;
  const cu = "INR";
  const tn = "Guest%20Web%20Solutions%20Payment";

  return {
    gpay: `tez://upi/pay?pa=${pa}&pn=${pn}&am=${am}&cu=${cu}&tn=${tn}`,
    phonepe: `phonepe://pay?pa=${pa}&pn=${pn}&am=${am}&cu=${cu}&tn=${tn}`,
    paytm: `paytmmp://upi/pay?pa=${pa}&pn=${pn}&am=${am}&cu=${cu}&tn=${tn}`,
    paytm2: `paytm://upi/pay?pa=${pa}&pn=${pn}&am=${am}&cu=${cu}&tn=${tn}`,
    generic: `upi://pay?pa=${pa}&pn=${pn}&am=${am}&cu=${cu}&tn=${tn}`,
  };
}

function triggerDeepLink(url: string) {
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.opacity = "0";
  iframe.style.pointerEvents = "none";
  iframe.style.width = "1px";
  iframe.style.height = "1px";
  iframe.src = url;
  document.body.appendChild(iframe);
  window.location.href = url;
  setTimeout(() => {
    if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
  }, 3000);
}

export default function PaymentModal({ plan, onClose }: PaymentModalProps) {
  const { user } = useAuth();
  const firestore = useFirestore();
  const [selectedMethod, setSelectedMethod] = useState("");
  const [showAppPicker, setShowAppPicker] = useState(false);
  const [reference, setReference] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [copiedField, setCopiedField] = useState("");

  const copyToClipboard = useCallback((text: string, field: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedField(field);
    setTimeout(() => setCopiedField(""), 2000);
  }, []);

  if (!plan) return null;

  const planPrice = plan.price;
  const amount = plan.numericAmount;
  const links = buildLinks(amount);

  const handleConfirm = async () => {
    if (!selectedMethod) return;
    setError("");
    setSubmitting(true);
    try {
      await firestore.createPayment({
        userId: user?.uid || "guest",
        userEmail: user?.email || "guest",
        planName: plan.name,
        amount: planPrice,
        paymentMethod: selectedMethod,
        bankReference: reference || undefined,
      });
      setSubmitted(true);
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e.message || "Failed to submit payment. Please try again.");
    }
    setSubmitting(false);
  };

  // ==================== APP PICKER SCREEN ====================
  if (showAppPicker) {
    return (
      <div className="fixed inset-0 z-[60] bg-[rgba(0,0,0,0.85)] backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-[#111111] border border-[rgba(212,165,116,0.2)] rounded-lg max-w-[440px] w-full" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(212,165,116,0.1)]">
            <button onClick={() => setShowAppPicker(false)}
              className="flex items-center gap-1 text-[#D4A574] hover:text-[#F5F5F5] transition-colors font-body text-[12px]">
              <ArrowLeft size={14} /> Back
            </button>
            <button onClick={onClose} className="p-1.5 rounded hover:bg-[rgba(255,255,255,0.05)] text-[#6B6B6B] hover:text-[#F5F5F5]">
              <X size={18} />
            </button>
          </div>

          <div className="px-6 py-6">
            {/* Amount Banner */}
            <div className="text-center mb-6 p-4 bg-[rgba(212,165,116,0.06)] rounded-lg border border-[rgba(212,165,116,0.12)]">
              <p className="font-body text-[11px] text-[#6B6B6B] uppercase tracking-[0.12em]">Amount to Pay</p>
              <p className="font-display text-[36px] font-bold text-[#D4A574] mt-1 leading-none">
                {amount} <span className="text-[16px] font-body font-normal text-[#A0A0A0]">RS</span>
              </p>
              <p className="font-body text-[12px] text-[#6B6B6B] mt-1">{plan.name} Plan &middot; {BANK_DETAILS.phonePeUPI}</p>
            </div>

            {/* App Buttons */}
            <div className="space-y-3">
              {/* Google Pay */}
              <button
                onClick={() => triggerDeepLink(links.gpay)}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-[rgba(66,133,244,0.25)] bg-[rgba(66,133,244,0.06)] hover:bg-[rgba(66,133,244,0.12)] hover:border-[rgba(66,133,244,0.5)] transition-all text-left"
              >
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                  <svg width="26" height="26" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 5.04c1.75 0 3.32.61 4.55 1.8l3.41-3.41C17.95 1.18 15.2 0 12 0 7.34 0 3.25 2.7 1.41 6.64l3.95 3.06C6.22 6.83 8.89 5.04 12 5.04z"/><path fill="#34A853" d="M23.5 12.23c0-.84-.08-1.65-.21-2.43H12v4.6h6.45c-.28 1.5-1.1 2.76-2.33 3.61l3.78 2.93c2.2-2.03 3.6-5.02 3.6-8.71z"/><path fill="#FBBC05" d="M5.36 14.04l-3.95 3.06C3.25 21.3 7.34 24 12 24c3.2 0 5.95-1.18 8.11-3.07l-3.78-2.93c-1.06.72-2.42 1.14-4.33 1.14-3.33 0-6.15-2.25-7.16-5.28z"/><path fill="#4285F4" d="M12 4.78c3.11 0 5.78 1.79 7.05 4.19l-3.41 3.41c-.86-1.36-2.35-2.33-4.14-2.33-3.11 0-5.78 1.79-7.16 4.53l-3.95-3.06C3.25 2.48 7.34 4.78 12 4.78z"/></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-[15px] font-medium text-[#F5F5F5]">Google Pay</p>
                  <p className="font-body text-[12px] text-[#6B6B6B]">Pay {amount} RS</p>
                </div>
                <Smartphone size={16} className="text-[#6B6B6B] flex-shrink-0" />
              </button>

              {/* PhonePe */}
              <button
                onClick={() => triggerDeepLink(links.phonepe)}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-[rgba(103,46,220,0.25)] bg-[rgba(103,46,220,0.06)] hover:bg-[rgba(103,46,220,0.12)] hover:border-[rgba(103,46,220,0.5)] transition-all text-left"
              >
                <div className="w-12 h-12 rounded-full bg-[#5F259F] flex items-center justify-center flex-shrink-0">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M7.5 2h9l-2.25 13.5H12L9.75 5.5H7.5V2zm4.5 15a2.5 2.5 0 100 5 2.5 2.5 0 000-5z"/></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-[15px] font-medium text-[#F5F5F5]">PhonePe</p>
                  <p className="font-body text-[12px] text-[#6B6B6B]">Pay {amount} RS</p>
                </div>
                <Smartphone size={16} className="text-[#6B6B6B] flex-shrink-0" />
              </button>

              {/* Paytm */}
              <button
                onClick={() => triggerDeepLink(links.paytm)}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-[rgba(0,185,242,0.25)] bg-[rgba(0,185,242,0.06)] hover:bg-[rgba(0,185,242,0.12)] hover:border-[rgba(0,185,242,0.5)] transition-all text-left"
              >
                <div className="w-12 h-12 rounded-full bg-[#002E6E] flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="4" fill="#00BDF2"/><text x="12" y="17" textAnchor="middle" fill="#002E6E" fontSize="14" fontWeight="bold" fontFamily="Arial">Py</text></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-[15px] font-medium text-[#F5F5F5]">Paytm</p>
                  <p className="font-body text-[12px] text-[#6B6B6B]">Pay {amount} RS</p>
                </div>
                <Smartphone size={16} className="text-[#6B6B6B] flex-shrink-0" />
              </button>

              {/* Other UPI */}
              <button
                onClick={() => triggerDeepLink(links.generic)}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-[rgba(212,165,116,0.15)] bg-[rgba(212,165,116,0.04)] hover:bg-[rgba(212,165,116,0.08)] hover:border-[rgba(212,165,116,0.3)] transition-all text-left"
              >
                <div className="w-12 h-12 rounded-full bg-[rgba(212,165,116,0.1)] flex items-center justify-center flex-shrink-0">
                  <Building2 size={20} className="text-[#D4A574]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-[15px] font-medium text-[#F5F5F5]">Other UPI App</p>
                  <p className="font-body text-[12px] text-[#6B6B6B]">Pay {amount} RS via any app</p>
                </div>
                <Smartphone size={16} className="text-[#6B6B6B] flex-shrink-0" />
              </button>
            </div>

            {/* Manual Fallback */}
            <div className="mt-5 p-3 bg-[rgba(255,255,255,0.02)] rounded-lg border border-[rgba(255,255,255,0.04)]">
              <p className="font-body text-[11px] text-[#6B6B6B] text-center mb-2">If app doesn&apos;t open, pay manually:</p>
              <div className="flex items-center justify-between">
                <span className="font-body text-[12px] text-[#A0A0A0]">UPI ID: <span className="text-[#D4A574] font-medium">{BANK_DETAILS.phonePeUPI}</span></span>
                <CopyBtn text={BANK_DETAILS.phonePeUPI} field="upi-fb" copiedField={copiedField} onCopy={copyToClipboard} />
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="font-body text-[12px] text-[#A0A0A0]">Amount: <span className="text-[#D4A574] font-medium">{amount} RS</span></span>
                <CopyBtn text={amount} field="amt-fb" copiedField={copiedField} onCopy={copyToClipboard} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================== SUCCESS SCREEN ====================
  if (submitted) {
    return (
      <div className="fixed inset-0 z-[60] bg-[rgba(0,0,0,0.8)] backdrop-blur-sm flex items-center justify-center p-6" onClick={onClose}>
        <div className="bg-[#111111] border border-[rgba(212,165,116,0.2)] rounded-lg max-w-[420px] w-full p-8 text-center" onClick={(e) => e.stopPropagation()}>
          <CheckCircle size={48} className="text-[#D4A574] mx-auto mb-4" />
          <h3 className="font-display text-[22px] text-[#F5F5F5] mb-2">Payment Submitted</h3>
          <p className="font-body text-[14px] text-[#A0A0A0] mb-6">
            Thank you! We will verify your payment and activate your plan shortly.
          </p>
          <button onClick={onClose}
            className="font-body text-[14px] font-medium px-8 py-2.5 rounded bg-gradient-to-br from-[#D4A574] to-[#C4956A] text-[#0A0A0A] hover:-translate-y-0.5 transition-all">
            Done
          </button>
        </div>
      </div>
    );
  }

  // ==================== MAIN PAYMENT SCREEN ====================
  return (
    <div className="fixed inset-0 z-[60] bg-[rgba(0,0,0,0.8)] backdrop-blur-sm flex items-center justify-center p-6 overflow-y-auto" onClick={onClose}>
      <div className="bg-[#111111] border border-[rgba(212,165,116,0.2)] rounded-lg max-w-[500px] w-full my-8" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(212,165,116,0.1)]">
          <div>
            <h3 className="font-display text-[20px] text-[#F5F5F5]">Complete Payment</h3>
            <p className="font-body text-[12px] text-[#6B6B6B]">
              {user?.name ? `Logged in as ${user.name}` : "Guest checkout"}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded hover:bg-[rgba(255,255,255,0.05)] text-[#6B6B6B] hover:text-[#F5F5F5] transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Plan Summary */}
        <div className="px-6 py-4 bg-[rgba(212,165,116,0.05)] border-b border-[rgba(212,165,116,0.1)]">
          <div className="flex justify-between items-center">
            <span className="font-body text-[14px] text-[#A0A0A0]">Plan</span>
            <span className="font-body text-[14px] font-medium text-[#F5F5F5]">{plan.name}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="font-body text-[14px] text-[#A0A0A0]">Amount</span>
            <span className="font-display text-[24px] font-bold text-[#D4A574]">{planPrice} <span className="text-[14px] font-body font-normal text-[#A0A0A0]">RS</span></span>
          </div>
        </div>

        <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
          {!selectedMethod ? (
            <div className="space-y-3">
              <p className="font-body text-[13px] text-[#6B6B6B] uppercase tracking-[0.06em] mb-3">Select Payment Method</p>
              {PAYMENT_METHODS.map((method) => {
                const Icon = method.icon;
                return (
                  <button key={method.id} onClick={() => setSelectedMethod(method.id)}
                    className="w-full flex items-center gap-4 p-4 rounded-lg border border-[rgba(212,165,116,0.1)] hover:border-[rgba(212,165,116,0.3)] hover:bg-[rgba(212,165,116,0.03)] transition-all text-left group">
                    <div className="w-10 h-10 rounded-lg bg-[rgba(212,165,116,0.08)] flex items-center justify-center flex-shrink-0 group-hover:bg-[rgba(212,165,116,0.15)] transition-colors">
                      <Icon size={18} className="text-[#D4A574]" />
                    </div>
                    <div>
                      <p className="font-body text-[14px] font-medium text-[#F5F5F5]">{method.label}</p>
                      <p className="font-body text-[12px] text-[#6B6B6B]">{method.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              <button onClick={() => setSelectedMethod("")}
                className="font-body text-[12px] text-[#D4A574] hover:text-[#F5F5F5] transition-colors flex items-center gap-1">
                <ArrowLeft size={12} /> Change Method
              </button>

              <PaymentInstructions
                planPrice={planPrice}
                amount={amount}
                onOpenPicker={() => setShowAppPicker(true)}
                copiedField={copiedField}
                onCopy={copyToClipboard}
              />

              <div className="mt-4">
                <label className="font-body text-[12px] text-[#6B6B6B] uppercase tracking-[0.06em]">
                  Transaction Reference (optional)
                </label>
                <input type="text" placeholder="Enter UTR/Ref number" value={reference} onChange={(e) => setReference(e.target.value)}
                  className="w-full mt-2 bg-transparent border border-[rgba(212,165,116,0.2)] rounded px-4 py-3 text-[#F5F5F5] font-body text-[14px] placeholder:text-[#6B6B6B] focus:border-[#D4A574] focus:outline-none transition-colors" />
              </div>

              {error && (
                <div className="font-body text-[13px] text-[#EA4335] bg-[rgba(234,67,53,0.08)] rounded px-3 py-2">
                  {error}
                </div>
              )}

              <button onClick={handleConfirm} disabled={submitting}
                className="w-full font-body text-[14px] font-medium uppercase tracking-[0.08em] py-3.5 rounded bg-gradient-to-br from-[#D4A574] to-[#C4956A] text-[#0A0A0A] hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(212,165,116,0.3)] transition-all duration-300 disabled:opacity-50 mt-2">
                {submitting ? "Processing..." : "I Have Paid"}
              </button>

              <p className="font-body text-[11px] text-[#6B6B6B] text-center">
                After payment, click &quot;I Have Paid&quot;. We will verify and activate your plan.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PaymentInstructions({ planPrice, amount, onOpenPicker, copiedField, onCopy }: {
  planPrice: string; amount: string; onOpenPicker: () => void; copiedField: string; onCopy: (t: string, f: string) => void;
}) {
  return (
    <div className="space-y-3">
      <p className="font-body text-[13px] text-[#A0A0A0]">
        Pay <span className="text-[#D4A574] font-medium">{planPrice} RS</span> via UPI:
      </p>
      <div className="bg-[rgba(212,165,116,0.05)] border border-[rgba(212,165,116,0.1)] rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="font-body text-[12px] text-[#6B6B6B]">UPI ID</span>
          <div className="flex items-center">
            <span className="font-body text-[14px] font-medium text-[#D4A574]">{BANK_DETAILS.phonePeUPI}</span>
            <CopyBtn text={BANK_DETAILS.phonePeUPI} field="upi" copiedField={copiedField} onCopy={onCopy} />
          </div>
        </div>
      </div>
      <button onClick={onOpenPicker}
        className="w-full flex items-center justify-center gap-2 font-body text-[14px] font-medium py-3 rounded bg-gradient-to-br from-[#D4A574] to-[#C4956A] text-[#0A0A0A] hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(212,165,116,0.3)] transition-all"
      >
        <Smartphone size={16} />
        Open UPI App to Pay ({amount} RS)
      </button>
      <details className="group">
        <summary className="font-body text-[12px] text-[#6B6B6B] hover:text-[#D4A574] cursor-pointer transition-colors flex items-center gap-1">
          <Building2 size={12} />
          Also accept bank transfer
        </summary>
        <div className="mt-3">
          <BankDetailsDisplay copiedField={copiedField} onCopy={onCopy} />
        </div>
      </details>
    </div>
  );
}

function CopyBtn({ text, field, copiedField, onCopy }: { text: string; field: string; copiedField: string; onCopy: (t: string, f: string) => void }) {
  return (
    <button onClick={() => onCopy(text, field)}
      className="ml-2 p-1 rounded hover:bg-[rgba(212,165,116,0.1)] text-[#6B6B6B] hover:text-[#D4A574] transition-colors"
      title="Copy">
      {copiedField === field ? <CheckCircle size={14} className="text-[#25D366]" /> : <Copy size={14} />}
    </button>
  );
}

function BankDetailsDisplay({ copiedField, onCopy }: { copiedField: string; onCopy: (t: string, f: string) => void }) {
  const fields = [
    { label: "Account Name", value: BANK_DETAILS.name, field: "name" },
    { label: "Account Number", value: BANK_DETAILS.accountNo, field: "ac" },
    { label: "Bank", value: BANK_DETAILS.bank, field: "bank" },
    { label: "Branch", value: `${BANK_DETAILS.branch} (Code: ${BANK_DETAILS.branchCode})`, field: "branch" },
    { label: "IFSC Code", value: BANK_DETAILS.ifsc, field: "ifsc" },
  ];
  return (
    <div className="bg-[rgba(212,165,116,0.05)] border border-[rgba(212,165,116,0.1)] rounded-lg p-4 space-y-3">
      {fields.map((f) => (
        <div key={f.field} className="flex justify-between items-center">
          <span className="font-body text-[12px] text-[#6B6B6B]">{f.label}</span>
          <div className="flex items-center">
            <span className="font-body text-[13px] font-medium text-[#F5F5F5]">{f.value}</span>
            <CopyBtn text={f.value} field={f.field} copiedField={copiedField} onCopy={onCopy} />
          </div>
        </div>
      ))}
    </div>
  );
}
