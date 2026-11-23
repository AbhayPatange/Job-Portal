import { MapPin, BriefcaseBusiness, Clock3, Bookmark } from "lucide-react";
import { Link } from "react-router-dom";
export default function Job({ job, selected = false, onSelect, saved = false, onSave }) {
  const days = Math.max(
    0,
    Math.floor((Date.now() - new Date(job.createdAt)) / 86400000),
  );
  return (
    <article className="job-card">
      <div className="job-card-top">
        <span className="company-logo">
          {job.company?.logo ? (
            <img src={job.company.logo} alt="" />
          ) : (
            (job.company?.name || "N").slice(0, 1)
          )}
        </span>
        <div>
          <strong>{job.company?.name || "Hiring team"}</strong>
          <span>
            <MapPin size={13} />
            {job.location || "Location not specified"}
          </span>
        </div>
        <span className="job-age">{days === 0 ? "New" : days + "d ago"}</span>
      </div>
      <Link className="job-title" to={"/description/" + job._id}>
        {job.title}
      </Link>
      <p className="job-summary">{job.description}</p>
      <div className="job-tags">
        <span>
          <BriefcaseBusiness size={13} />
          {job.jobType}
        </span>
        <span>
          <Clock3 size={13} />
          {job.experienceLevel || 0}+ years
        </span>
      </div>
      <div className="job-card-bottom">
        <div>
          <strong>₹{job.salary} LPA</strong>
          <span>
            {job.position} {Number(job.position) === 1 ? "opening" : "openings"}
          </span>
        </div>
        <Link to={"/description/" + job._id} className="job-details">
          View role
        </Link>
        {onSelect && <button type="button" className={selected ? "job-select is-selected" : "job-select"} onClick={() => onSelect(job._id)} aria-pressed={selected}>{selected ? "Selected" : "Select"}</button>}
        {onSave && <button type="button" className={saved ? "job-save is-saved" : "job-save"} onClick={() => onSave(job._id)} aria-pressed={saved}><Bookmark size={14} fill={saved ? "currentColor" : "none"} />{saved ? "Saved" : "Save"}</button>}
      </div>
    </article>
  );
}
