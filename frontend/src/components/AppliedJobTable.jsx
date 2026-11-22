import { Link } from "react-router-dom";
import { BriefcaseBusiness } from "lucide-react";
import { useSelector } from "react-redux";
export default function AppliedJobTable({ applications }) {
  const stored = useSelector((s) => s.job.allAppliedJobs);
  const items = applications || stored || [];
  if (!items.length)
    return (
      <div className="profile-applications-empty">
        <BriefcaseBusiness size={28} />
        <h3>Your next chapter is an application away.</h3>
        <p>
          Find a role you love. Your applications and their status will appear
          here.
        </p>
        <Link className="text-link" to="/jobs">
          Discover opportunities
        </Link>
      </div>
    );
  return (
    <div className="profile-application-list">
      {items.map((item) => (
        <article key={item._id} className="profile-application-row">
          <span className="application-company-letter">
            {(item.job?.company?.name || "C")[0]}
          </span>
          <div className="application-description">
            {item.job?._id ? (
              <Link to={"/description/" + item.job._id}>
                {item.job.title || "Job opportunity"}
              </Link>
            ) : (
              <strong>Job no longer available</strong>
            )}
            <p>
              {item.job?.company?.name || "Company unavailable"}
              <span> · </span>
              {item.createdAt
                ? new Date(item.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "Date unavailable"}
            </p>
          </div>
          <span
            className={
              "application-status status-" +
              (["accepted", "rejected", "pending"].includes(item.status)
                ? item.status
                : "pending")
            }
          >
            {item.status || "pending"}
          </span>
        </article>
      ))}
    </div>
  );
}
