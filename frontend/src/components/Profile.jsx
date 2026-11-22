import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  Pencil,
  FileText,
  ExternalLink,
  Sparkles,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
} from "lucide-react";
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import AppliedJobTable from "./AppliedJobTable";
import UpdateProfileDialog from "./UpdateProfileDialog";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";

export function ProfileContent({
  user,
  applications = [],
  applicationsLoading = false,
  applicationsError = "",
}) {
  const [open, setOpen] = useState(false);
  const profile = user.profile || {};
  const skills = Array.isArray(profile.skills)
    ? profile.skills.filter(Boolean)
    : [];
  const initials = (user.fullname || "You")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const pending = applications.filter(
    (item) => item.status === "pending",
  ).length;
  const accepted = applications.filter(
    (item) => item.status === "accepted",
  ).length;
  const complete = [
    Boolean(user.fullname),
    Boolean(user.email),
    Boolean(user.phoneNumber),
    Boolean(profile.bio?.trim()),
    skills.length > 0,
    Boolean(profile.resume),
  ].filter(Boolean).length;
  const completion = Math.round((complete / 6) * 100);
  return (
    <>
      <main className="profile-workspace">
        <header className="profile-page-heading">
          <div>
            <span className="eyebrow">YOUR PERSONAL WORKSPACE</span>
            <h1>
              A little more <em>you.</em>
            </h1>
            <p>Your story, your strengths, and everything that comes next.</p>
          </div>
          <Link className="button-outline" to="/jobs">
            Explore opportunities
          </Link>
        </header>
        <div className="profile-layout">
          <section
            className="profile-identity profile-surface"
            aria-labelledby="profile-name"
          >
            <div className="profile-cover">
              <div className="profile-cover-orbit" />
              <Sparkles size={27} />
              <span>MADE FOR YOUR NEXT CHAPTER</span>
            </div>
            <div className="profile-identity-body">
              <Avatar className="profile-avatar">
                <AvatarImage
                  src={profile.profilePhoto}
                  alt={user.fullname || "Your profile"}
                />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <span className="profile-role">
                {user.role === "recruiter" ? "Recruiter" : "Career explorer"}
              </span>
              <h2 id="profile-name">{user.fullname || "Your name"}</h2>
              <p className="profile-tagline">
                {skills.length
                  ? skills.slice(0, 3).join(" · ")
                  : "Your potential. Your possibilities."}
              </p>
              <button
                className="button-primary profile-edit-button"
                onClick={() => setOpen(true)}
              >
                <Pencil size={15} />
                Edit profile
              </button>
              <div className="profile-contact">
                <div>
                  <span className="profile-contact-icon">
                    <Mail size={17} />
                  </span>
                  <div>
                    <span>Email address</span>
                    <p>{user.email || "Not provided"}</p>
                  </div>
                </div>
                <div>
                  <span className="profile-contact-icon">
                    <Phone size={17} />
                  </span>
                  <div>
                    <span>Phone number</span>
                    <p>{user.phoneNumber || "Not provided"}</p>
                  </div>
                </div>
              </div>
              <div className="profile-completion">
                <div>
                  <strong>Profile completeness</strong>
                  <span>{completion}%</span>
                </div>
                <progress
                  value={completion}
                  max="100"
                  aria-label="Profile completeness"
                />
                <p>
                  {completion === 100
                    ? "Looking good. Your profile is ready for its next chapter."
                    : "Add your bio, skills, and resume to tell your complete story."}
                </p>
              </div>
            </div>
          </section>
          <div className="profile-main">
            <section
              className="profile-surface profile-about"
              aria-labelledby="about-heading"
            >
              <div className="profile-section-heading">
                <span className="profile-section-icon">
                  <Sparkles size={20} />
                </span>
                <div>
                  <h2 id="about-heading">The story so far</h2>
                  <p>A snapshot of what makes you, you.</p>
                </div>
              </div>
              <p
                className={profile.bio ? "profile-bio" : "profile-placeholder"}
              >
                {profile.bio ||
                  "Introduce yourself. Share your experience, what you enjoy doing, and the opportunities you’re looking for."}
              </p>
              <div className="profile-skills">
                <h3>Your strengths</h3>
                {skills.length ? (
                  <div className="profile-skill-list">
                    {skills.map((skill, i) => (
                      <span key={skill + i}>{skill}</span>
                    ))}
                  </div>
                ) : (
                  <button
                    className="profile-inline-action"
                    onClick={() => setOpen(true)}
                  >
                    Add your skills
                  </button>
                )}
              </div>
            </section>
            <section
              className="profile-surface profile-resume"
              aria-labelledby="resume-heading"
            >
              <span className="resume-file-icon">
                <FileText size={27} />
              </span>
              <div className="resume-description">
                <h2 id="resume-heading">Your experience, on paper.</h2>
                <p>
                  {profile.resume
                    ? profile.resumeOriginalName || "Your resume"
                    : "Add a resume to give recruiters the full picture."}
                </p>
                <span>
                  {profile.resume
                    ? "Ready for your next opportunity"
                    : "PDF format · up to 5 MB"}
                </span>
              </div>
              {profile.resume ? (
                <a
                  className="button-outline"
                  href={profile.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View resume
                  <ExternalLink size={14} />
                </a>
              ) : (
                <button
                  className="button-outline"
                  onClick={() => setOpen(true)}
                >
                  Add resume
                </button>
              )}
            </section>
            <section
              className="profile-surface profile-applications"
              aria-labelledby="applications-heading"
            >
              <div className="profile-section-heading">
                <span className="profile-section-icon">
                  <BriefcaseBusiness size={20} />
                </span>
                <div>
                  <h2 id="applications-heading">Your next moves</h2>
                  <p>Keep every opportunity in sight.</p>
                </div>
              </div>
              <div className="profile-stat-grid">
                <div>
                  <BriefcaseBusiness size={17} />
                  <strong>{applications.length}</strong>
                  <span>Applications</span>
                </div>
                <div>
                  <Clock3 size={17} />
                  <strong>{pending}</strong>
                  <span>Pending</span>
                </div>
                <div>
                  <CheckCircle2 size={17} />
                  <strong>{accepted}</strong>
                  <span>Accepted</span>
                </div>
              </div>
              {applicationsLoading ? (
                <p role="status" className="profile-placeholder">
                  Loading your applications…
                </p>
              ) : applicationsError ? (
                <p role="alert" className="profile-placeholder">
                  {applicationsError}
                </p>
              ) : (
                <AppliedJobTable applications={applications} />
              )}
            </section>
          </div>
        </div>
      </main>
      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </>
  );
}
function SignedInProfile({ user }) {
  const { loading, error } = useGetAppliedJobs();
  const applications = useSelector((s) => s.job.allAppliedJobs) || [];
  return (
    <ProfileContent
      user={user}
      applications={applications}
      applicationsLoading={loading}
      applicationsError={error}
    />
  );
}
export default function Profile() {
  const { user } = useSelector((s) => s.auth);
  return (
    <>
      <Navbar />
      {user ? (
        <SignedInProfile user={user} />
      ) : (
        <main className="workspace">
          <div className="empty-state">
            <h1>Your story starts here.</h1>
            <p>Sign in to view your profile and applications.</p>
            <Link className="button-primary mt-6" to="/login">
              Sign in
            </Link>
          </div>
        </main>
      )}
      <Footer />
    </>
  );
}
