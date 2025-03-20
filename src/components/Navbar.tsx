import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogIn, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { NotificationBell } from "@/components/NotificationBell";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "./theme-provider";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const getInitials = (email: string): string => {
    if (!email) return "U";
    return email.charAt(0).toUpperCase();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-orange-600 dark:text-orange-500">
              KaamKhoj
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-orange-600 dark:text-gray-300 dark:hover:text-orange-500 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/workers"
              className="text-gray-700 hover:text-orange-600 dark:text-gray-300 dark:hover:text-orange-500 transition-colors"
            >
              Find Workers
            </Link>
            <Link
              to="/jobs"
              className="text-gray-700 hover:text-orange-600 dark:text-gray-300 dark:hover:text-orange-500 transition-colors"
            >
              Browse Jobs
            </Link>
            <Link
              to="/post-job"
              className="text-gray-700 hover:text-orange-600 dark:text-gray-300 dark:hover:text-orange-500 transition-colors"
            >
              Post a Job
            </Link>
          </nav>

          {/* User Menu (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="h-9 w-9 rounded-full"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>

              {user ? (
                <>
                  <NotificationBell />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-9 w-9 rounded-full"
                      >
                        <Avatar className="h-9 w-9">
                          <AvatarImage
                            src={user.user_metadata?.avatar_url}
                            alt={user.email || "User"}
                          />
                          <AvatarFallback>
                            {getInitials(user.email || "")}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => navigate("/profile")}
                      >
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => navigate("/dashboard")}
                      >
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={handleSignOut}
                      >
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  className="bg-orange-600 hover:bg-orange-700"
                  onClick={() => navigate("/login")}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-500"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-3 pb-5">
            <nav className="flex flex-col space-y-3">
              <Link
                to="/"
                className="text-gray-700 hover:text-orange-600 dark:text-gray-300 dark:hover:text-orange-500 transition-colors"
                onClick={toggleMenu}
              >
                Home
              </Link>
              <Link
                to="/workers"
                className="text-gray-700 hover:text-orange-600 dark:text-gray-300 dark:hover:text-orange-500 transition-colors"
                onClick={toggleMenu}
              >
                Find Workers
              </Link>
              <Link
                to="/jobs"
                className="text-gray-700 hover:text-orange-600 dark:text-gray-300 dark:hover:text-orange-500 transition-colors"
                onClick={toggleMenu}
              >
                Browse Jobs
              </Link>
              <Link
                to="/post-job"
                className="text-gray-700 hover:text-orange-600 dark:text-gray-300 dark:hover:text-orange-500 transition-colors"
                onClick={toggleMenu}
              >
                Post a Job
              </Link>
              <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="h-9 w-9 rounded-full"
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </Button>
                {user ? (
                  <div className="flex items-center gap-3">
                    <NotificationBell />
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 text-gray-700 hover:text-orange-600 dark:text-gray-300 dark:hover:text-orange-500"
                      onClick={toggleMenu}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user.user_metadata?.avatar_url}
                          alt={user.email || "User"}
                        />
                        <AvatarFallback>
                          {getInitials(user.email || "")}
                        </AvatarFallback>
                      </Avatar>
                      <span>Profile</span>
                    </Link>
                  </div>
                ) : (
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-orange-600 hover:bg-orange-700"
                    onClick={() => {
                      navigate("/login");
                      toggleMenu();
                    }}
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                )}
              </div>
              {user && (
                <Button
                  variant="ghost"
                  className="justify-start px-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  onClick={() => {
                    handleSignOut();
                    toggleMenu();
                  }}
                >
                  Sign Out
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
