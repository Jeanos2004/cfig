"use client";

import { useState, useEffect } from "react";
import { StudentCourse } from "@/lib/studentDb";
import { motion, AnimatePresence } from "framer-motion";
import { X, CreditCard, Smartphone, CheckCircle, RefreshCw, ChevronRight } from "lucide-react";

interface PaymentModalProps {
  course: StudentCourse;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type PaymentMethod = "om" | "momo" | "card";
type PaymentStep = "method" | "details" | "otp" | "success";

export default function PaymentModal({ course, isOpen, onClose, onSuccess }: PaymentModalProps) {
  const [method, setMethod] = useState<PaymentMethod>("om");
  const [step, setStep] = useState<PaymentStep>("method");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(15);

  useEffect(() => {
    if (step === "otp" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [step, countdown]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step === "method") {
      setStep("details");
    } else if (step === "details") {
      if (method === "card") {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          setStep("success");
        }, 2000);
      } else {
        if (!phone) return;
        setStep("otp");
        setCountdown(15);
      }
    } else if (step === "otp") {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep("success");
      }, 2000);
    }
  };

  const handleFinish = () => {
    onSuccess();
    onClose();
    // reset state
    setStep("method");
    setPhone("");
    setOtp("");
  };

  // Format currency (GNF)
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "GNF", maximumFractionDigits: 0 })
      .format(price)
      .replace("GNF", "FG");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-gray-100 overflow-hidden text-gray-800"
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-primary)]">Finaliser l'inscription</h3>
            <p className="text-[10px] text-gray-400 font-medium uppercase mt-0.5 truncate max-w-[280px]">{course.title}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {step === "method" && (
              <motion.div
                key="step-method"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                <div className="p-4 bg-[var(--color-primary)]/5 rounded-2xl flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)]">Montant à régler :</span>
                  <span className="text-lg font-black text-[var(--color-accent)]">{formatPrice(course.price)}</span>
                </div>

                <div className="space-y-2.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500">Moyen de paiement</label>
                  
                  <button
                    onClick={() => setMethod("om")}
                    className={`w-full p-4 border rounded-2xl flex items-center justify-between transition-all ${
                      method === "om" ? "border-orange-500 bg-orange-50/20 text-orange-950" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold">OM</div>
                      <div className="text-left">
                        <p className="text-xs font-bold">Orange Money Guinée</p>
                        <p className="text-[10px] text-gray-400">Paiement mobile instantané</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>

                  <button
                    onClick={() => setMethod("momo")}
                    className={`w-full p-4 border rounded-2xl flex items-center justify-between transition-all ${
                      method === "momo" ? "border-yellow-500 bg-yellow-50/20 text-yellow-950" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-yellow-500 text-yellow-950 flex items-center justify-center font-black">MTN</div>
                      <div className="text-left">
                        <p className="text-xs font-bold">MTN Mobile Money</p>
                        <p className="text-[10px] text-gray-400">Paiement mobile instantané</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>

                  <button
                    onClick={() => setMethod("card")}
                    className={`w-full p-4 border rounded-2xl flex items-center justify-between transition-all ${
                      method === "card" ? "border-blue-500 bg-blue-50/20 text-blue-950" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center"><CreditCard className="w-5 h-5" /></div>
                      <div className="text-left">
                        <p className="text-xs font-bold">Carte Bancaire</p>
                        <p className="text-[10px] text-gray-400">Visa / Mastercard / UnionPay</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === "details" && (
              <motion.div
                key="step-details"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                {method === "card" ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Nom sur la carte</label>
                      <input
                        type="text" required
                        className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 text-xs rounded-xl focus:outline-none focus:border-blue-500"
                        placeholder="Moussa Diallo"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Numéro de carte</label>
                      <input
                        type="text" required
                        className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 text-xs rounded-xl focus:outline-none focus:border-blue-500"
                        placeholder="4000 1234 5678 9010"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Expiration</label>
                        <input
                          type="text" required
                          className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 text-xs rounded-xl focus:outline-none focus:border-blue-500"
                          placeholder="MM/AA"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">CVC / CVV</label>
                        <input
                          type="text" required
                          className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 text-xs rounded-xl focus:outline-none focus:border-blue-500"
                          placeholder="123"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex items-center gap-3">
                      <Smartphone className="w-8 h-8 text-[var(--color-primary)]" />
                      <div>
                        <h4 className="text-xs font-bold">Paiement Mobile</h4>
                        <p className="text-[10px] text-gray-400">Entrez votre numéro pour lancer la transaction.</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">Numéro de Téléphone {method === "om" ? "Orange" : "MTN"} *</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">+224</span>
                        <input
                          type="tel"
                          required
                          className="w-full bg-gray-50 border border-gray-200 pl-14 pr-4 py-3 text-xs font-bold rounded-xl focus:outline-none focus:border-[var(--color-primary)]"
                          placeholder="622 00 00 00"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {step === "otp" && (
              <motion.div
                key="step-otp"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="text-center space-y-5 py-6"
              >
                <div className="w-14 h-14 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mx-auto animate-pulse">
                  <RefreshCw className="w-6 h-6 animate-spin" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">Validation en cours...</h4>
                  <p className="text-xs text-gray-700 mt-2 max-w-xs mx-auto">
                    Une demande de paiement a été envoyée sur le mobile **+224 {phone}**.
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">
                    Veuillez composer {method === "om" ? "*144*4*2#" : "*156#"} sur votre téléphone pour approuver le retrait.
                  </p>
                </div>

                <div className="w-4/5 mx-auto bg-gray-50 border border-gray-100 p-4 rounded-2xl">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Entrez le code OTP reçu par SMS</label>
                  <input
                    type="text"
                    maxLength={6}
                    className="w-full bg-white border border-gray-200 px-4 py-2.5 text-center text-sm font-mono tracking-widest font-extrabold focus:outline-none focus:border-[var(--color-primary)] rounded-xl"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <div className="text-[10px] text-gray-400 mt-2">
                    Le code expire dans <span className="font-bold text-red-500">{countdown}s</span>
                  </div>
                </div>
              </motion.div>
            )}

            {step === "success" && (
              <motion.div
                key="step-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-5 py-8"
              >
                <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-gray-800 leading-tight">Félicitations !</h4>
                  <p className="text-xs text-gray-500 mt-2 max-w-xs mx-auto leading-relaxed">
                    Votre paiement de **{formatPrice(course.price)}** a été validé avec succès. Votre cours est désormais débloqué !
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
          {step === "method" && (
            <>
              <button onClick={onClose} className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-700">
                Annuler
              </button>
              <button onClick={handleNext} className="px-5 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-accent)] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md">
                Continuer
              </button>
            </>
          )}

          {step === "details" && (
            <>
              <button onClick={() => setStep("method")} className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-700">
                Retour
              </button>
              <button
                onClick={handleNext}
                disabled={loading || (method !== "card" && !phone)}
                className="px-5 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-accent)] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md disabled:opacity-50 flex items-center gap-1.5"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Payer {formatPrice(course.price)}</span>
                )}
              </button>
            </>
          )}

          {step === "otp" && (
            <>
              <button onClick={() => setStep("details")} className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-700">
                Retour
              </button>
              <button
                onClick={handleNext}
                disabled={loading || !otp}
                className="px-5 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-accent)] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md disabled:opacity-50 flex items-center gap-1.5"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Valider le code</span>
                )}
              </button>
            </>
          )}

          {step === "success" && (
            <button onClick={handleFinish} className="w-full py-3 bg-[var(--color-primary)] hover:bg-[var(--color-accent)] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md">
              Accéder à mes cours
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
