import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  BarChart3,
  FileCheck2,
  Upload,
  LockKeyhole,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";



const featureCards = [
  {
    title: "Control visibility",
    text: "Track KPI status, exceptions, and financial impact from one workspace.",
    icon: BarChart3,
  },
  {
    title: "Audit readiness",
    text: "Keep evidence, outputs, and monitoring activity structured and reviewable.",
    icon: FileCheck2,
  },
  {
    title: "Secure data flow",
    text: "Upload source files and route control outputs through one controlled process.",
    icon: Upload,
  },
];




const Login = () => {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    remember: false,
  });

  const isLogin = mode === "login";

  const canSubmit = useMemo(() => {
    if (isLogin) {
      return form.email.trim() && form.password.trim();
    }

    return (
      form.fullName.trim() &&
      form.email.trim() &&
      form.password.trim() &&
      form.confirmPassword.trim() &&
      form.password === form.confirmPassword
    );
  }, [form, isLogin]);

  const onChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);

    setTimeout(() => {
      localStorage.setItem("token", "demo-token");
      navigate("/app");
    }, 700);
  };

  return (
     <div className="min-h-screen bg-gradient-to-br from-primary/80 via-primary-light to-primary flex items-center justify-center px-4">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col py-18">
        {/* Main workspace */}
        <main className="grid flex-1 grid-cols-1 gap-10 lg:grid-cols-[1.35fr_0.75fr]">
          {/* Left side */}
          <section className="flex flex-col gap-6">
            {/* Main statement panel */}
            <div className="rounded-xl text-white">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-sm">
                <CheckCircle2 size={16} />
                Business control workspace
              </div>

              <h2 className="max-w-3xl text-white font-semibold leading-tight text-5xl">
                Monitor controls,
                <br />
                manage exceptions,
                <br />
                move with clarity.
              </h2>

              <p className="mt-5 max-w-2xl text-base text-white/85 lg:text-lg">
                Access a central platform for KPI monitoring, Power BI control
                outputs, exception review, and supporting evidence management.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-white/15 bg-white/10 p-4">
                  <div className="text-2xl font-semibold">7</div>
                  <div className="mt-1 text-sm text-white/80">
                    Control areas
                  </div>
                </div>

                <div className="rounded-xl border border-white/15 bg-white/10 p-4">
                  <div className="text-2xl font-semibold">1</div>
                  <div className="mt-1 text-sm text-white/80">
                    Unified portal
                  </div>
                </div>

                <div className="rounded-xl border border-white/15 bg-white/10 p-4">
                  <div className="text-2xl font-semibold">Live</div>
                  <div className="mt-1 text-sm text-white/80">
                    Power BI outputs
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom note */}
            <div className="rounded-xl border border-border bg-primary-soft px-5 py-4 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-primary">
                    Designed for monitoring, review, and action
                  </p>
                  <p className="text-sm text-muted">
                    Structured for control owners, compliance reviewers, and
                    audit-facing workflows.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-card px-3 py-1 text-xs font-medium text-primary">
                    KPI monitoring
                  </span>
                  <span className="rounded-full bg-card px-3 py-1 text-xs font-medium text-primary">
                    Exception review
                  </span>
                  <span className="rounded-full bg-card px-3 py-1 text-xs font-medium text-primary">
                    Evidence-ready
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Right side auth */}
          <aside className="flex items-start lg:justify-end">
            <div className="w-full max-w-xl bg-primary-soft rounded-xl border border-border p-6 shadow-sm lg:p-8">
              {/* Toggle */}
              <div className="mb-6 rounded-xl bg-primary/10 p-1.5">
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      isLogin
                        ? "bg-primary text-white"
                        : "bg-transparent text-muted hover:text-text"
                    }`}
                  >
                    Sign In
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode("register")}
                    className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      !isLogin
                        ? "bg-primary text-white"
                        : "bg-transparent text-muted hover:text-text"
                    }`}
                  >
                    Register
                  </button>
                </div>
              </div>

              {/* Heading */}
              <div className="mb-6">
                <h3 className="text-3xl text-center font-semibold text-primary">
                  {isLogin ? "Welcome back" : "Create Access"}
                </h3>
                <p className="mt-1 text-sm text-center text-primary-light">
                  {isLogin
                    ? "Sign in to open your compliance workspace."
                    : "Create an account to access CCM monitoring features."}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-text">
                      Full name
                    </label>
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={(e) => onChange("fullName", e.target.value)}
                      placeholder="Enter full name"
                      className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-text outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary-soft"
                    />
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-medium text-text">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => onChange("email", e.target.value)}
                    placeholder="name@company.com"
                    className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-text outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary-soft"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-text">
                    Password
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => onChange("password", e.target.value)}
                      placeholder="Enter password"
                      className="w-full rounded-xl border border-border bg-white px-4 py-3 pr-12 text-sm text-text outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary-soft"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition hover:text-primary"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {!isLogin && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-text">
                      Confirm password
                    </label>
                    <input
                      type="password"
                      value={form.confirmPassword}
                      onChange={(e) =>
                        onChange("confirmPassword", e.target.value)
                      }
                      placeholder="Re-enter password"
                      className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-text outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary-soft"
                    />
                  </div>
                )}

                {isLogin && (
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 text-sm text-muted">
                      <input
                        type="checkbox"
                        checked={form.remember}
                        onChange={(e) => onChange("remember", e.target.checked)}
                      />
                      Remember me
                    </label>

                    <button
                      type="button"
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {!isLogin &&
                  form.confirmPassword &&
                  form.password !== form.confirmPassword && (
                    <div className="rounded-xl bg-primary-soft px-4 py-3 text-sm text-primary">
                      Password and confirm password do not match.
                    </div>
                  )}

                <button
                  type="submit"
                  disabled={!canSubmit || loading}
                  className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? isLogin
                      ? "Signing in..."
                      : "Creating account..."
                    : isLogin
                      ? "Sign In"
                      : "Create Account"}
                </button>
              </form>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
};

export default Login;
