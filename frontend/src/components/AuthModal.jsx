import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { login, register } from "../lib/api";

const inputCls =
  "w-full border border-zinc-300 focus:border-black px-4 py-3.5 text-sm focus:outline-none transition-colors bg-white";

export default function AuthModal() {
  const { authModalOpen, setAuthModalOpen, setUser } = useAuth();
  const [mode, setMode] = useState("signin");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);

  const googleLogin = () => {
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    const redirectUrl = window.location.origin + "/account";
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const data =
        mode === "signin"
          ? await login({ email: form.email, password: form.password })
          : await register(form);
      localStorage.setItem("pazooka_token", data.session_token);
      setUser(data);
      setAuthModalOpen(false);
      toast.success(mode === "signin" ? "WELCOME BACK" : "ACCOUNT CREATED", { description: data.email });
    } catch (err) {
      toast.error(err?.response?.data?.detail || "AUTH FAILED");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AnimatePresence>
      {authModalOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setAuthModalOpen(false)}
            className="fixed inset-0 z-[75] bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            data-testid="auth-modal"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed z-[80] inset-x-4 top-1/2 -translate-y-1/2 sm:inset-x-0 sm:mx-auto max-w-md bg-white border-2 border-black p-7 sm:p-9 max-h-[90vh] overflow-y-auto"
          >
            <button data-testid="auth-close" aria-label="Close" onClick={() => setAuthModalOpen(false)} className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center border border-zinc-300 hover:border-black transition-colors">
              <X size={16} />
            </button>

            <p className="font-display text-4xl leading-none">PAZOOKA<span className="text-acid">.</span></p>
            <p className="font-mono text-[10px] tracking-[0.3em] text-zinc-500 mt-2">
              {mode === "signin" ? "SIGN IN TO YOUR ACCOUNT" : "CREATE YOUR ACCOUNT"}
            </p>

            <button
              data-testid="google-signin-btn"
              onClick={googleLogin}
              className="mt-7 w-full flex items-center justify-center gap-3 border-2 border-black py-3.5 font-syne font-bold text-sm hover:bg-black hover:text-white transition-colors"
            >
              <svg width="17" height="17" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              CONTINUE WITH GOOGLE
            </button>

            <div className="flex items-center gap-3 my-6">
              <div className="h-px bg-zinc-300 flex-1" />
              <span className="font-mono text-[10px] tracking-[0.3em] text-zinc-400">OR WITH EMAIL</span>
              <div className="h-px bg-zinc-300 flex-1" />
            </div>

            <form onSubmit={submit} className="space-y-3">
              {mode === "signup" && (
                <input data-testid="auth-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="FULL NAME" className={inputCls} />
              )}
              <input data-testid="auth-email" required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="EMAIL" className={inputCls} />
              <input data-testid="auth-password" required type="password" minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="PASSWORD (MIN 6 CHARS)" className={inputCls} />
              <button data-testid="auth-submit-btn" type="submit" disabled={busy} className="w-full bg-acid text-black font-syne font-extrabold text-sm tracking-wide py-4 hover:bg-black hover:text-acid transition-colors disabled:opacity-50">
                {busy ? "HOLD ON..." : mode === "signin" ? "SIGN IN" : "CREATE ACCOUNT"}
              </button>
            </form>

            <button
              data-testid="auth-mode-toggle"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="mt-5 w-full text-center font-mono text-[11px] tracking-[0.2em] text-zinc-500 hover:text-black transition-colors"
            >
              {mode === "signin" ? "NEW HERE? CREATE AN ACCOUNT" : "ALREADY A MEMBER? SIGN IN"}
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
