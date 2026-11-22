import { Link } from "react-router-dom";
export default function Brand() {
  return (
    <Link to="/" className="brand" aria-label="CarrerNex home">
      <svg
        className="cn-brand-symbol"
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden="true"
      >
        <rect width="48" height="48" rx="14" fill="#17674f" />
        <path
          d="M31 13a14 14 0 1 0 0 22"
          stroke="#e7f1d9"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M22 31V18l12 13V18"
          stroke="#e7f1d9"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>
        Carrer<span className="brand-accent">Nex</span>
      </span>
    </Link>
  );
}
