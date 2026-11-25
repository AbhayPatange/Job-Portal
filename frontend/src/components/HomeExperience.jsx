import { useState } from 'react';
import { ArrowRight, ArrowUpRight, Bookmark, BriefcaseBusiness, FileCheck2, Globe2, Layers3, Search, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import '../homeExperience.css';

const cards = [
  { icon: BriefcaseBusiness, title: 'Find your next role', text: 'Explore opportunities and find the work that fits.', to: '/jobs', label: 'EXPLORE JOBS' },
  { icon: Sparkles, title: 'Your AI career toolkit', text: 'Review résumé fit, practice interviews and draft cover letters from a job page.', href: '#carrernex-ai', label: 'MEET YOUR TOOLS' },
  { icon: Layers3, title: 'Apply to more, faster', text: 'Select up to 10 CarrerNex roles and apply with your résumé.', to: '/jobs', label: 'START SELECTING' },
  { icon: Globe2, title: 'Explore beyond here', text: 'Discover Remotive roles and search other job platforms.', href: '#live-opportunities', label: 'SEARCH THE WEB' },
  { icon: Bookmark, title: 'Save the good ones', text: 'Keep interesting CarrerNex roles close for later.', to: '/jobs', label: 'FIND ROLES' },
  { icon: FileCheck2, title: 'Track your journey', text: 'Keep your profile, résumé and applications together.', to: '/profile', label: 'YOUR WORKSPACE' },
];
export default function HomeExperience() {
  const [query, setQuery] = useState(''); const dispatch = useDispatch(); const navigate = useNavigate();
  function search(event) { event.preventDefault(); dispatch(setSearchedQuery(query)); navigate('/browse'); }
  return <><section className="new-hero"><div className="new-hero-inner"><div className="new-hero-copy"><span className="new-hero-label"><Sparkles size={15} /> YOUR CAREER, IN MOTION</span><h1>Make your next<br/><em>move matter.</em></h1><p>Discover opportunities, sharpen your application, and step into what’s next with a little help from CarrerNex.</p><form className="new-hero-search" onSubmit={search}><Search size={20}/><input aria-label="Search jobs" placeholder="Job title, skill, or keyword" value={query} onChange={e => setQuery(e.target.value)}/><button type="submit">Find jobs <ArrowRight size={17}/></button></form><div className="new-hero-links"><a href="#feature-hub">Explore all features ↓</a><a href="#live-opportunities">Jobs across the web ↗</a></div></div><div className="hero-visual" aria-hidden="true"><div className="hero-orb orb-a"/><div className="hero-orb orb-b"/><div className="visual-core"><span>YOUR NEXT</span><strong>BIG<br/><i>THING.</i></strong><div><Sparkles size={18}/> STARTS HERE</div></div><div className="visual-chip chip-one"><BriefcaseBusiness size={19}/> Find your fit <span>↗</span></div><div className="visual-chip chip-two"><FileCheck2 size={19}/> Résumé review <span>✦</span></div><div className="visual-chip chip-three"><Sparkles size={19}/> Interview ready <span>✓</span></div><div className="visual-star">✳</div></div></div><div className="hero-marquee"><span>FIND YOUR FIT ✳ BUILD YOUR STORY ✳ PRACTICE YOUR NEXT MOVE ✳ FIND YOUR FIT ✳ BUILD YOUR STORY ✳ PRACTICE YOUR NEXT MOVE ✳</span></div></section><section id="feature-hub" className="feature-hub"><div className="feature-hub-heading"><div><span className="eyebrow"><Sparkles size={14}/> EVERYTHING IN ONE PLACE</span><h2>Big plans? <em>We’re with you.</em></h2></div><p>From the first search to the next interview, find your tools right here.</p></div><div className="feature-hub-grid">{cards.map(({ icon: Icon, title, text, to, href, label }, i) => { const content = <><span className="hub-icon"><Icon size={22}/></span><ArrowUpRight className="hub-arrow" size={19}/><h3>{title}</h3><p>{text}</p><small>{label} →</small></>; return to ? <Link className={`hub-card hub-card-${i}`} key={title} to={to}>{content}</Link> : <a className={`hub-card hub-card-${i}`} key={title} href={href}>{content}</a>; })}</div></section></>;
}
