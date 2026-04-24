import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import api from "../services/api";

const DEV_DEFAULTS = {
  fullName: "CCM Demo Admin",
  email: "admin@ccm.local",
  password: "Admin@12345",
  confirmPassword: "Admin@12345",
  remember: true,
};

const EMPTY_REGISTER = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  remember: true,
};

const Login = () => {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState(DEV_DEFAULTS);

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

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setErrorMsg("");

    if (nextMode === "login") {
      setForm(DEV_DEFAULTS);
    } else {
      setForm({
        ...EMPTY_REGISTER,
        email: "admin@ccm.local",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit || loading) return;

    setLoading(true);
    setErrorMsg("");

    try {
      if (isLogin) {
        const response = await api.post("/auth/login", {
          email: form.email,
          password: form.password,
        });

        const { accessToken, user } = response.data.data;

        localStorage.setItem("token", accessToken);
        localStorage.setItem("user", JSON.stringify(user));

        navigate("/app", { replace: true });
      } else {
        const response = await api.post("/auth/register", {
          fullName: form.fullName,
          email: form.email,
          password: form.password,
        });

        const { accessToken, user } = response.data.data;

        localStorage.setItem("token", accessToken);
        localStorage.setItem("user", JSON.stringify(user));

        navigate("/app", { replace: true });
      }
    } catch (error) {
      setErrorMsg(
        error?.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_26%),linear-gradient(135deg,var(--color-primary-light)_0%,var(--color-primary)_48%,#3d2449_100%)]">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 py-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <section className="flex flex-col justify-center gap-8">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white shadow-sm backdrop-blur-sm">
              <CheckCircle2 size={16} />
              Business control workspace
            </div>

            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.08] tracking-[-0.03em] text-white lg:text-7xl">
              Monitor controls,
              <br />
              manage exceptions,
              <br />
              move with clarity.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/82">
              Access one place for KPI monitoring, Power BI outputs, exception
              review, and supporting evidence management.
            </p>
          </div>

          <div className="grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-white/15 bg-white/10 p-5 shadow-sm backdrop-blur-sm">
              <div className="text-3xl font-semibold text-white">7</div>
              <div className="mt-1 text-sm text-white/72">Control areas</div>
            </div>

            <div className="rounded-lg border border-white/15 bg-white/10 p-5 shadow-sm backdrop-blur-sm">
              <div className="text-3xl font-semibold text-white">1</div>
              <div className="mt-1 text-sm text-white/72">Unified portal</div>
            </div>

            <div className="rounded-lg border border-white/15 bg-white/10 p-5 shadow-sm backdrop-blur-sm">
              <div className="text-3xl font-semibold text-white">Live</div>
              <div className="mt-1 text-sm text-white/72">Power BI outputs</div>
            </div>
          </div>

          <div className="max-w-5xl rounded-lg border border-white/18 bg-white/10 px-6 py-5 shadow-sm backdrop-blur-md">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="font-semibold text-white">
                  Designed for monitoring, review, and action
                </p>
                <p className="mt-1 text-sm text-white/68">
                  Structured for control owners, compliance reviewers, and
                  audit-facing workflows.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-primary">
                  KPI monitoring
                </span>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-primary">
                  Exception review
                </span>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-primary">
                  Evidence-ready
                </span>
              </div>
            </div>
          </div>
        </section>

        <aside className="flex items-center justify-center lg:justify-end">
          <div className="w-full max-w-md rounded-lg border border-white/18 bg-white/14 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.22)] backdrop-blur-xl lg:p-8">
            <div className="mb-6 rounded-lg bg-white/10 p-1.5">
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className={`rounded-lg px-4 py-3 text-sm font-semibold transition ${
                    isLogin
                      ? "bg-primary text-white shadow-sm"
                      : "bg-transparent text-white/70 hover:text-white"
                  }`}
                >
                  Sign In
                </button>

                <button
                  type="button"
                  onClick={() => switchMode("register")}
                  className={`rounded-lg px-4 py-3 text-sm font-semibold transition ${
                    !isLogin
                      ? "bg-primary text-white shadow-sm"
                      : "bg-transparent text-white/70 hover:text-white"
                  }`}
                >
                  Register
                </button>
              </div>
            </div>

            <div className="mb-6 text-center">
              <h3 className="text-3xl font-semibold text-white">
                {isLogin ? "Welcome back" : "Create Access"}
              </h3>
              <p className="mt-2 text-sm text-white/70">
                {isLogin
                  ? "Sign in to open your compliance workspace."
                  : "Create an account to access CCM monitoring features."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">
                    Full name
                  </label>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => onChange("fullName", e.target.value)}
                    placeholder="Enter full name"
                    className="w-full rounded-lg border border-white/20 bg-white px-4 py-3 text-sm text-text outline-none transition placeholder:text-muted focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                  />
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-white">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => onChange("email", e.target.value)}
                  placeholder="name@company.com"
                  className="w-full rounded-lg border border-white/20 bg-white px-4 py-3 text-sm text-text outline-none transition placeholder:text-muted focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => onChange("password", e.target.value)}
                    placeholder="Enter password"
                    className="w-full rounded-lg border border-white/20 bg-white px-4 py-3 pr-12 text-sm text-text outline-none transition placeholder:text-muted focus:border-secondary focus:ring-2 focus:ring-secondary/20"
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
                  <label className="mb-2 block text-sm font-medium text-white">
                    Confirm password
                  </label>
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) =>
                      onChange("confirmPassword", e.target.value)
                    }
                    placeholder="Re-enter password"
                    className="w-full rounded-lg border border-white/20 bg-white px-4 py-3 text-sm text-text outline-none transition placeholder:text-muted focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                  />
                </div>
              )}

              {isLogin && (
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 text-sm text-white/75">
                    <input
                      type="checkbox"
                      checked={form.remember}
                      onChange={(e) => onChange("remember", e.target.checked)}
                    />
                    Remember me
                  </label>

                  <button
                    type="button"
                    className="text-sm font-medium text-white/80 hover:text-white hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {!isLogin &&
                form.confirmPassword &&
                form.password !== form.confirmPassword && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    Password and confirm password do not match.
                  </div>
                )}

              {errorMsg && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={!canSubmit || loading}
                className="w-full rounded-lg bg-secondary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
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
      </div>
    </div>
  );
};

export default Login;
