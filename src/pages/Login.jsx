import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import api from "../services/api";
import logo from "../assets/no-bg-logo.png";

const DEV_DEFAULTS = {
  fullName: "CCM Demo Admin",
  email: "admin@ccm.local",
  password: "Admin@12345",
  confirmPassword: "Admin@12345",
  remember: true,
};

const EMPTY_REGISTER = {
  fullName: "",
  email: "admin@ccm.local",
  password: "",
  confirmPassword: "",
  remember: true,
};

const Login = () => {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    setShowPassword(false);
    setShowConfirmPassword(false);

    if (nextMode === "login") {
      setForm(DEV_DEFAULTS);
    } else {
      setForm(EMPTY_REGISTER);
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
    <div className="min-h-screen bg-bg px-4">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center py-1">
        <div className="mb-2 flex w-full justify-center">
          <div className="flex w-full items-center justify-center">
            <img
              src={logo}
              alt="Etihad Rail"
              className="h-auto w-full max-w-80 object-contain"
            />
          </div>
        </div>

        <div
          className={`w-full rounded-lg border border-border bg-card p-6 shadow-md transition-all lg:p-8 ${
            isLogin ? "max-w-md" : "max-w-3xl"
          }`}
        >
          <div className="mb-6 rounded-lg bg-primary-soft/35 p-1">
            <div className="grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => switchMode("login")}
                className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isLogin
                    ? "bg-primary text-white shadow-sm"
                    : "bg-transparent text-primary hover:bg-white/60"
                }`}
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={() => switchMode("register")}
                className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  !isLogin
                    ? "bg-primary text-white shadow-sm"
                    : "bg-transparent text-primary hover:bg-white/60"
                }`}
              >
                Register
              </button>
            </div>
          </div>

          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold text-primary">
              {isLogin ? "Sign in" : "Create account"}
            </h1>
            <p className="mt-2 text-sm text-muted">
              {isLogin
                ? "Access the control monitoring workspace."
                : "Create an account to access the portal."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isLogin ? (
              <>
                <div>
                  <label className="mb-2 block text-sm font-medium text-text">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => onChange("email", e.target.value)}
                    placeholder="name@company.com"
                    className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-text outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary-soft/40"
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
                      className="w-full rounded-xl border border-border bg-white px-4 py-3 pr-12 text-sm text-text outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary-soft/40"
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
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-text">
                      Full name
                    </label>
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={(e) => onChange("fullName", e.target.value)}
                      placeholder="Enter full name"
                      className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-text outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary-soft/40"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-text">
                      Email
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => onChange("email", e.target.value)}
                      placeholder="name@company.com"
                      className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-text outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary-soft/40"
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
                        className="w-full rounded-xl border border-border bg-white px-4 py-3 pr-12 text-sm text-text outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary-soft/40"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition hover:text-primary"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-text">
                      Confirm password
                    </label>

                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={form.confirmPassword}
                        onChange={(e) =>
                          onChange("confirmPassword", e.target.value)
                        }
                        placeholder="Re-enter password"
                        className="w-full rounded-xl border border-border bg-white px-4 py-3 pr-12 text-sm text-text outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary-soft/40"
                      />

                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition hover:text-primary"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {!isLogin &&
              form.confirmPassword &&
              form.password !== form.confirmPassword && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  Password and confirm password do not match.
                </div>
              )}

            {errorMsg && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {errorMsg}
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
      </div>
    </div>
  );
};

export default Login;
