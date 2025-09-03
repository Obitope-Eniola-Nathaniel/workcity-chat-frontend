import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      await login(email, password, rememberMe);
      // Redirect to previous page if available, otherwise inbox
      navigate(location.state?.from || "/inbox");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg mt-20">
      <h2 className="text-xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
        Welcome Back 👋
      </h2>

      {error && (
        <div className="mb-4 p-3 rounded bg-red-100 text-red-600 text-sm relative">
          {error}
          <button
            onClick={() => setError("")}
            className="absolute top-2 right-2 text-xs text-red-500 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <form onSubmit={submit} className="space-y-5">
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Email
          </label>
          <input
            id="email"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            aria-label="Email address"
            disabled={loading}
          />
        </div>

        {/* Password */}
        <div className="relative">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            type={showPassword ? "text" : "password"}
            className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            aria-label="Password"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-gray-500 dark:text-gray-400 text-sm"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        {/* Remember me */}
        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="rounded"
              disabled={loading}
            />
            <span>Remember me</span>
          </label>
          <Link
            to="/forgot-password"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-black text-white rounded-lg font-medium tracking-wide transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 disabled:opacity-50 flex items-center justify-center"
        >
          {loading ? (
            <>
              <span className="animate-spin mr-2">⏳</span> Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>
      </form>

      <p className="mt-6 text-sm text-center text-gray-600 dark:text-gray-400">
        Don’t have an account?{" "}
        <Link
          to="/signup"
          className="font-medium text-black dark:text-white hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
