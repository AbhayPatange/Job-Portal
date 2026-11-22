import { Link } from "react-router-dom";
export default function Brand() {
  return (
    <Link to="/" className="brand" aria-label="carrerNex home">
      <span className="brand-mark" aria-hidden="true">
        n
      </span>
      <span>
        carrer<span className="brand-accent">Nex</span>
      </span>
    </Link>
  );
}
