import React, { useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function Layout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold">
            Workcity Chat
          </Link>
          <nav className="flex items-center gap-4">
            {user ? (
              <>
                <Link to="/inbox" className="hover:underline">
                  Inbox
                </Link>
                <Link to="/profile" className="hover:underline">
                  Profile
                </Link>
                {user.role === "admin" && (
                  <Link to="/admin" className="hover:underline">
                    Admin
                  </Link>
                )}
                <button
                  onClick={onLogout}
                  className="px-3 py-1 rounded bg-red-500 text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:underline">
                  Login
                </Link>
                <Link to="/signup" className="hover:underline">
                  Sign up
                </Link>
              </>
            )}
            <button
              onClick={toggleTheme}
              className="ml-2 px-2 py-1 border rounded"
            >
              Theme
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-5">
        <Outlet />
      </main>

      <footer className="py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Workcity Chat :— Built with Care By OEN TECH
      </footer>
    </div>
  );
}
