import { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowUpRight, BriefcaseBusiness, Globe2, LoaderCircle, MapPin, Radio } from 'lucide-react';
import { JOB_API_END_POINT } from '@/utils/constant';

const platforms = [
  { name: 'LinkedIn', description: 'Professional roles and company networks', url: 'https://www.linkedin.com/jobs/' },
  { name: 'Naukri', description: 'Jobs across India and growing teams', url: 'https://www.naukri.com/' },
  { name: 'Indeed', description: 'Search roles, companies, and locations', url: 'https://www.indeed.com/' },
  { name: 'Wellfound', description: 'Startup jobs and early-stage teams', url: 'https://wellfound.com/jobs' },
];

function formatDate(value) { const date = new Date(value); return !value || Number.isNaN(date.valueOf()) ? 'Recently listed' : `Listed ${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`; }

export default function ExternalOpportunities() {
  const [state, setState] = useState({ loading: true, jobs: [], error: '' });
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('India');
  const [visible, setVisible] = useState(6);
  const query = encodeURIComponent(keyword.trim());
  const place = encodeURIComponent(location.trim());
  const searches = [
    { name: 'LinkedIn', url: `https://www.linkedin.com/jobs/search/?keywords=${query}&location=${place}` },
    { name: 'Naukri', url: `https://www.naukri.com/${keyword.trim() ? encodeURIComponent(keyword.trim().toLowerCase().replace(/\s+/g, '-')) + '-jobs' : 'jobs'}${location.trim() ? `-in-${encodeURIComponent(location.trim().toLowerCase().replace(/\s+/g, '-'))}` : ''}` },
    { name: 'Indeed', url: `https://in.indeed.com/jobs?q=${query}&l=${place}` },
  ];
  useEffect(() => {
    const controller = new AbortController();
    axios.get(`${JOB_API_END_POINT}/external?limit=12`, { signal: controller.signal }).then(({ data }) => setState({ loading: false, jobs: data.jobs || [], error: '' })).catch((error) => { if (error.name !== 'CanceledError') setState({ loading: false, jobs: [], error: 'Live roles are temporarily unavailable. You can still explore trusted job platforms below.' }); });
    return () => controller.abort();
  }, []);
  return <section className="external-opportunities" id="live-opportunities"><div className="section-heading external-heading"><div><span className="eyebrow"><Radio size={14} /> EXPLORE THE WEB</span><h2>More places to find your next role.</h2></div><a className="button-outline" href="https://remotive.com/remote-jobs" target="_blank" rel="noreferrer">Browse Remotive <ArrowUpRight size={15} /></a></div><div className="platform-directory"><div className="platform-directory-heading"><Globe2 size={19} /><div><h3>Search across job sites</h3><p>Enter a role and location, then open the results on your chosen site.</p></div></div><div className="external-search"><label>Role or keyword<input value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="e.g. software engineer" /></label><label>Location<input value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. India" /></label></div><div className="platform-grid">{searches.map(site => <a key={site.name} href={site.url} target="_blank" rel="noopener noreferrer"><strong>Search {site.name}</strong><span>Open matching jobs on {site.name}</span><ArrowUpRight size={16} /></a>)}<a href="https://wellfound.com/jobs" target="_blank" rel="noopener noreferrer"><strong>Wellfound</strong><span>Explore startup roles</span><ArrowUpRight size={16} /></a></div></div><p className="external-intro" style={{marginTop: 28}}>Remote listings from Remotive. Select a role to view and apply on its original page.</p>{state.loading && <div className="external-loading"><LoaderCircle size={18} /> Loading opportunities…</div>}{state.jobs.length > 0 && <div className="external-jobs-grid">{state.jobs.slice(0, visible).map(job => <a className="external-job-card" href={job.url} target="_blank" rel="noopener noreferrer" key={job.id}><span className="external-source">FROM REMOTIVE <ArrowUpRight size={13} /></span><h3>{job.title}</h3><strong>{job.company}</strong><div><span><MapPin size={14} /> {job.location}</span><span><BriefcaseBusiness size={14} /> {job.type}</span></div><small>{formatDate(job.publishedAt)} · View and apply ↗</small></a>)}</div>}{visible < state.jobs.length && <button className="button-outline" style={{marginTop: 18}} onClick={() => setVisible(12)}>Show more jobs</button>}{state.error && <p className="external-error">{state.error}</p>}<p className="external-credit">Listings are provided by <a href="https://remotive.com/remote-jobs" target="_blank" rel="noreferrer">Remotive</a> and may be delayed. Other sites open their own search results.</p></section>;
}
