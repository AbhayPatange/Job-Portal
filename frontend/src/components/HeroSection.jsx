import { useState } from "react";
import {
  Search,
  Sparkles,
  BriefcaseBusiness,
  Check,
  Compass,
  Code2,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchedQuery } from "@/redux/jobSlice";
export default function HeroSection() {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  function search(e, term = query) {
    e.preventDefault();
    dispatch(setSearchedQuery(term));
    navigate("/browse");
  }
  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="hero-copy">
          <div className="eyebrow">
            <Sparkles size={15} /> A fresh perspective on your future
          </div>
          <h1>
            Your next chapter.
            <br />
            <span>A little more you.</span>
          </h1>
          <p>
            Find work that fits your ambition. Discover opportunities, meet your
            next team, and take a confident step forward.
          </p>
          <form className="hero-search" onSubmit={search}>
            <Search size={22} />
            <input
              aria-label="Search jobs"
              placeholder="Job title, skill, or keyword"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit">Find my next role</button>
          </form>
          <div className="popular-search">
            <span>Popular searches</span>
            {["Frontend", "Design", "Data"].map((term) => (
              <button key={term} onClick={(e) => search(e, term)}>
                {term}
              </button>
            ))}
          </div>
          <div className="hero-note">
            <span className="mini-check">
              <Check size={13} />
            </span>
            Your ambitions. Your pace. Your next move.
          </div>
        </div>
        <div
          className="hero-art"
          aria-label="Explore, connect, and grow your career"
        >
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <span className="art-spark">✳</span>
          <div className="career-card">
            <div className="career-card-top">
              <span className="icon-block">
                <Compass size={25} />
              </span>
              <span className="small-label">YOUR NEXT CHAPTER</span>
            </div>
            <h2>
              Great work starts
              <br />
              with a great fit.
            </h2>
            <p>A space for what comes next.</p>
            <div className="career-path">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className="career-card-footer">
              <span>Built around your potential</span>
              <Sparkles size={19} />
            </div>
          </div>
          <div className="float-card float-top">
            <span className="icon-block lilac">
              <Code2 size={22} />
            </span>
            <div>
              <strong>Make your skills count</strong>
              <span>Find your kind of opportunity</span>
            </div>
          </div>
          <div className="float-card float-bottom">
            <span className="icon-block mint">
              <BriefcaseBusiness size={22} />
            </span>
            <div>
              <strong>Good things are ahead</strong>
              <span>Your next move starts here</span>
            </div>
            <span className="round-check">
              <Check size={16} />
            </span>
          </div>
          <div className="art-caption">A CAREER THAT FEELS LIKE YOU</div>
        </div>
      </div>
      <div className="hero-strip">
        <span>Less searching. More possibility.</span>
        <div>
          <Check size={16} />
          Explore your interests
        </div>
        <div>
          <Check size={16} />
          Connect with recruiters
        </div>
        <div>
          <Check size={16} />
          Track your applications
        </div>
      </div>
    </section>
  );
}
