import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search } from "lucide-react";
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";
import Job from "./Job";
import { setSearchedQuery } from "@/redux/jobSlice";
import useGetAllJobs from "@/hooks/useGetAllJobs";
export default function Browse() {
  useGetAllJobs();
  const { allJobs, searchedQuery } = useSelector((s) => s.job);
  const [query, setQuery] = useState(searchedQuery || "");
  const dispatch = useDispatch();
  return (
    <>
      <Navbar />
      <main className="workspace">
        <div className="page-heading">
          <span className="eyebrow">FOLLOW YOUR CURIOSITY</span>
          <h1>
            There’s more <em>out there.</em>
          </h1>
          <p>Explore a skill, an interest, or a whole new direction.</p>
        </div>
        <form
          className="browse-search"
          onSubmit={(e) => {
            e.preventDefault();
            dispatch(setSearchedQuery(query));
          }}
        >
          <div className="search-field">
            <Search size={20} />
            <input
              aria-label="Search roles"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What would you love to do?"
            />
          </div>
          <button className="button-primary">Explore roles</button>
        </form>
        <div className="results-count">
          <strong>
            {allJobs.length}{" "}
            {allJobs.length === 1 ? "opportunity" : "opportunities"}
            {searchedQuery ? " for “" + searchedQuery + "”" : ""}
          </strong>
        </div>
        <div className="jobs-grid">
          {allJobs.map((job) => (
            <Job key={job._id} job={job} />
          ))}
          {!allJobs.length && (
            <div className="empty-state">
              <Search />
              <h3>A different search could open a new door.</h3>
              <p>Try a broader keyword such as developer, design, or data.</p>
              <button
                className="text-link"
                onClick={() => {
                  setQuery("");
                  dispatch(setSearchedQuery(""));
                }}
              >
                See all opportunities
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
