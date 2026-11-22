import { Link } from "react-router-dom";
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";
export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="workspace">
        <div className="empty-state">
          <span className="eyebrow">A LITTLE DETOUR</span>
          <h1 className="text-4xl my-6">Let’s find your way back.</h1>
          <p>
            This page doesn’t exist, but your next opportunity is still out
            there.
          </p>
          <Link to="/" className="button-primary mt-6">
            Back to CarrerNex
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
