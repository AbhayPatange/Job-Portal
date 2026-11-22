import {
  Code2,
  Palette,
  BarChart3 as ChartNoAxesCombined,
  Layers3,
  Server,
  Terminal,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchedQuery } from "@/redux/jobSlice";
const categories = [
  ["Development", "Frontend", Code2],
  ["Design & creative", "Designer", Palette],
  ["Data & analytics", "Data", ChartNoAxesCombined],
  ["Full stack", "Full", Layers3],
  ["Backend engineering", "Backend", Server],
  ["Cloud & DevOps", "DevOps", Terminal],
];
export default function CategoryCarousel() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <section className="section-wrap category-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">FIND YOUR DIRECTION</span>
          <h2>Different paths. Real possibilities.</h2>
        </div>
        <p>
          Follow your curiosity.
          <br />
          Find where you belong.
        </p>
      </div>
      <div className="category-grid">
        {categories.map(([title, query, Icon]) => (
          <button
            key={title}
            onClick={() => {
              dispatch(setSearchedQuery(query));
              navigate("/browse");
            }}
          >
            <span className="category-icon">
              <Icon size={24} />
            </span>
            <strong>{title}</strong>
            <span>Explore opportunities</span>
          </button>
        ))}
      </div>
    </section>
  );
}
