import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, UserRound } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import Brand from "./Brand";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
export default function Navbar() {
  const { user } = useSelector((s) => s.auth);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const links =
    user?.role === "recruiter"
      ? [
          ["/admin/companies", "Companies"],
          ["/admin/jobs", "Manage jobs"],
        ]
      : [
          ["/", "Discover"],
          ["/jobs", "Find a job"],
          ["/browse", "Explore roles"],
        ];
  async function logout() {
    try {
      await axios.get(USER_API_END_POINT + "/logout", {
        withCredentials: true,
      });
      dispatch(setUser(null));
      navigate("/");
      toast.success("You’re signed out. See you soon!");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to sign out. Please try again.",
      );
    }
  }
  return (
    <header className="site-header">
      <div className="nav-inner">
        <Brand />
        <nav
          aria-label="Main navigation"
          className={open ? "main-nav is-open" : "main-nav"}
        >
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} end onClick={() => setOpen(false)}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="nav-actions">
          {user ? (
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className="account-trigger"
                  aria-label="Open account menu"
                >
                  <UserRound size={18} />
                  <span>{user.fullname?.split(" ")[0]}</span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="account-menu">
                <strong>{user.fullname}</strong>
                <p>{user.email}</p>
                <Link
                  to={
                    user.role === "recruiter" ? "/admin/companies" : "/profile"
                  }
                >
                  <UserRound size={16} />
                  My workspace
                </Link>
                <button onClick={logout}>
                  <LogOut size={16} />
                  Sign out
                </button>
              </PopoverContent>
            </Popover>
          ) : (
            <>
              <Link className="nav-login" to="/login">
                Log in
              </Link>
              <Link className="button-primary" to="/signup">
                Get started
              </Link>
            </>
          )}
          <button
            className="mobile-toggle"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
