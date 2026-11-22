import { Link } from "react-router-dom";
import Brand from "./Brand";
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div>
          <Brand />
          <p>
            A little ambition. A world of possibility.
            <br />
            Find your next chapter with CarrerNex.
          </p>
        </div>
        <div>
          <strong>YOUR NEXT MOVE</strong>
          <Link to="/jobs">Find a job</Link>
          <Link to="/browse">Explore opportunities</Link>
          <Link to="/profile">Your profile</Link>
        </div>
        <div>
          <strong>LET’S GET STARTED</strong>
          <Link to="/signup">Create an account</Link>
          <Link to="/login">Sign in</Link>
          <Link to="/forgot-password">Account support</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} CarrerNex. All rights reserved.
        </span>
        <span>Made for your next chapter.</span>
      </div>
    </footer>
  );
}
