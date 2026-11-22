import { useMemo, useState } from "react";
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";
import Job from "./Job";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useSelector } from "react-redux";
import useGetAllJobs from "@/hooks/useGetAllJobs";
export default function Jobs() {
  useGetAllJobs("");
  const { allJobs } = useSelector((s) => s.job);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [experience, setExperience] = useState("");
  const [sort, setSort] = useState("newest");
  const locations = [
    ...new Set(allJobs.map((j) => j.location).filter(Boolean)),
  ];
  const types = [...new Set(allJobs.map((j) => j.jobType).filter(Boolean))];
  const filtered = useMemo(
    () =>
      allJobs
        .filter(
          (j) =>
            (j.title + " " + j.description + " " + j.company?.name)
              .toLowerCase()
              .includes(query.toLowerCase()) &&
            (!location || j.location === location) &&
            (!type || j.jobType === type) &&
            (!experience ||
              (experience === "entry"
                ? Number(j.experienceLevel) <= 1
                : Number(j.experienceLevel) > 1)),
        )
        .sort((a, b) =>
          sort === "salary"
            ? Number(b.salary) - Number(a.salary)
            : new Date(b.createdAt) - new Date(a.createdAt),
        ),
    [allJobs, query, location, type, experience, sort],
  );
  return (
    <>
      <Navbar />
      <main className="workspace">
        <div className="page-heading">
          <span className="eyebrow">A WORLD OF POSSIBILITY</span>
          <h1>
            Find your next <em>great fit.</em>
          </h1>
          <p>Explore opportunities that match where you want to go.</p>
        </div>
        <div className="listing-toolbar">
          <div className="search-field">
            <Search size={20} />
            <input
              aria-label="Search available jobs"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by role, skill, or company"
            />
          </div>
          <select
            aria-label="Sort jobs"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="newest">Most recent</option>
            <option value="salary">Highest salary</option>
          </select>
        </div>
        <div className="listing-layout">
          <aside className="filters-panel">
            <h2>
              <SlidersHorizontal size={18} />
              Refine your search
            </h2>
            <label>
              Location
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="">All locations</option>
                {locations.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </label>
            <label>
              Work type
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="">All types</option>
                {types.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </label>
            <label>
              Experience
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              >
                <option value="">All levels</option>
                <option value="entry">Entry level · 0–1 years</option>
                <option value="experienced">Experienced · 2+ years</option>
              </select>
            </label>
            <button
              className="text-link"
              onClick={() => {
                setQuery("");
                setLocation("");
                setType("");
                setExperience("");
              }}
            >
              <X size={14} />
              Clear filters
            </button>
            <div className="filter-tip">
              Your next chapter could be somewhere unexpected. Keep an open
              mind.
            </div>
          </aside>
          <section>
            <div className="results-count">
              <strong>{filtered.length} opportunities</strong>
              <span>Find the one that feels right</span>
            </div>
            <div className="jobs-grid two-columns">
              {filtered.map((job) => (
                <Job key={job._id} job={job} />
              ))}
              {!filtered.length && (
                <div className="empty-state">
                  <Search />
                  <h3>No matches just yet.</h3>
                  <p>Try a different keyword or clear your filters.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
