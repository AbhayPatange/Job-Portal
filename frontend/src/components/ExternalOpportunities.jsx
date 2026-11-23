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
  useEffect(() => {
    const controller = new AbortController();
    axios.get(`${JOB_API_END_POINT}/external?limit=6`, { signal: controller.signal }).then(({ data }) => setState({ loading: false, jobs: data.jobs || [], error: '' })).catch((error) => { if (error.name !== 'CanceledError') setState({ loading: false, jobs: [], error: 'Live roles are temporarily unavailable. You can still explore trusted job platforms below.' }); });
    return () => controller.abort();
  }, []);
  return <section className="external-opportunities" id="live-opportunities"><div className="section-heading external-heading"><div><span className="eyebrow"><Radio size={14} /> LIVE FROM THE WEB</span><h2>More places to find your next role.</h2></div><a className="button-outline" href="https://remotive.com/remote-jobs" target="_blank" rel="noreferrer">Browse Remotive <ArrowUpRight size={15} /></a></div><p className="external-intro">Fresh remote opportunities from Remotive, plus quick access to job platforms you already trust. Applications always open on the original source.</p>{state.loading && <div className="external-loading"><LoaderCircle size={18} /> Loading live opportunities…</div>}{!state.loading && state.jobs.length > 0 && <div className="external-jobs-grid">{state.jobs.map((job) => <a className="external-job-card" href={job.url} target="_blank" rel="noreferrer" key={job.id}><span className="external-source">FROM REMOTIVE <ArrowUpRight size={13} /></span><h3>{job.title}</h3><strong>{job.company}</strong><div><span><MapPin size={14} /> {job.location}</span><span><BriefcaseBusiness size={14} /> {job.type}</span></div><small>{formatDate(job.publishedAt)}</small></a>)}</div>}{state.error && <p className="external-error">{state.error}</p>}<div className="platform-directory"><div className="platform-directory-heading"><Globe2 size={19} /><div><h3>Explore trusted job platforms</h3><p>Open a platform in a new tab and apply directly with the source.</p></div></div><div className="platform-grid">{platforms.map((platform) => <a key={platform.name} href={platform.url} target="_blank" rel="noreferrer"><strong>{platform.name}</strong><span>{platform.description}</span><ArrowUpRight size={16} /></a>)}</div></div><p className="external-credit">Live listings are provided by <a href="https://remotive.com/remote-jobs" target="_blank" rel="noreferrer">Remotive</a> and may be delayed. CarrerNex does not collect applications for external roles.</p></section>;
}
