import { Sparkles, Check } from "lucide-react";
export default function AuthShell({ children }) {
  return (
    <div className="auth-layout">
      <aside className="auth-story">
        <span className="eyebrow">
          <Sparkles size={16} />
          YOUR FUTURE, REIMAGINED
        </span>
        <h2>
          A small step. <br />A whole new <br />
          <em>possibility.</em>
        </h2>
        <p>
          Good work changes more than your career. It changes how you see what
          comes next.
        </p>
        <div className="auth-benefits">
          <span>
            <Check size={17} />
            Discover roles that fit your ambition
          </span>
          <span>
            <Check size={17} />
            Tell your story with a personal profile
          </span>
          <span>
            <Check size={17} />
            Keep your applications in one place
          </span>
        </div>
        <div className="auth-story-bottom">
          Your next chapter starts with carrerNex.
        </div>
      </aside>
      <div className="auth-form-panel">{children}</div>
    </div>
  );
}
