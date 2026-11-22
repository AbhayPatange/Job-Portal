import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import Job from "./Job";
export default function LatestJobs() {
  const { allJobs } = useSelector((s) => s.job);
  return (
    <section className="section-wrap latest-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">MAKE YOUR NEXT MOVE</span>
          <h2>A new role. A new beginning.</h2>
        </div>
        <Link className="button-outline" to="/jobs">
          Explore all jobs
        </Link>
      </div>
      <div className="jobs-grid">
        {allJobs.length ? (
          allJobs.slice(0, 6).map((job) => <Job key={job._id} job={job} />)
        ) : (
          <div className="empty-state">
            <Search />
            <h3>Your next opportunity is on its way.</h3>
            <p>
              There are no openings to show right now. Explore roles or check
              back soon.
            </p>
            <Link to="/browse" className="text-link">
              Explore roles
            </Link>
          </div>
        )}
      </div>
      <div className="join-banner">
        <div>
          <span className="eyebrow">THE NEXT CHAPTER IS YOURS</span>
          <h2>
            Big ambitions.
            <br />
            Meet your next opportunity.
          </h2>
          <p>Build your profile and put your next step in motion.</p>
        </div>
        <Link to="/signup" className="button-light">
          Create your free account
        </Link>
      </div>
    </section>
  );
}
