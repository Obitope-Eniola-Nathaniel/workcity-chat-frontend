import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { Eye, EyeOff } from "lucide-react"; // 👁 for show/hide password

export default function Signup() {
  const { signup } = useContext(AuthContext);
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    // ✅ Basic validations
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!role) {
      setError("Please select a role");
      return;
    }

    setLoading(true);
    try {
      await signup({ username, email, password, role });
      navigate("/inbox");
    } catch (err) {
      const msg = err.response?.data?.message || "Signup failed";
      setError(Array.isArray(msg) ? msg.join(", ") : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg mt-16">
      <h2 className="text-xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
        Create an Account
      </h2>

      {error && (
        <div className="mb-4 p-3 rounded bg-red-100 text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={submit} className="space-y-5">
        {/* Full Name */}
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Full Name
          </label>
          <input
            id="username"
            required
            value={username}
            onChange={(e) => setName(e.target.value)}
            placeholder="Obitope Eniola Nathaniel"
            autoComplete="name"
            className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-600 dark:focus:ring-gray-400"
          />
        </div>

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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            type="email"
            autoComplete="email"
            className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-600 dark:focus:ring-gray-400"
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
            autoComplete="new-password"
            className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-600 dark:focus:ring-gray-400 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-9 text-gray-500 dark:text-gray-400"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-600 dark:focus:ring-gray-400 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute right-3 top-9 text-gray-500 dark:text-gray-400"
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Role */}
        <div>
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Role
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-600 dark:focus:ring-gray-400"
          >
            <option value="" disabled>
              Select your role
            </option>
            <option value="customer">Customer</option>
            <option value="merchant">Merchant</option>
            <option value="designer">Designer</option>
            <option value="agent">Agent</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 bg-black text-white rounded-lg font-medium tracking-wide transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Account"}
        </button>
      </form>

      {/* Login link */}
      <p className="mt-6 text-sm text-center text-gray-600 dark:text-gray-400">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-medium text-gray-600 dark:text-white hover:underline"
        >
          Login
        </Link>
      </p>
    </div>
  );
}
