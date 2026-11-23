import { useEffect, useState } from 'react';
import axios from 'axios';
import { FileText, LoaderCircle, ShieldCheck, Sparkles, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { JOB_API_END_POINT } from '@/utils/constant';
import { extractResumeText, redactResumeForReview } from '@/utils/resumeText';

const INITIAL = { status: 'checking', text: '', error: '', analysis: null };

export default function JobFitAssistant({ job, user }) {
  const [state, setState] = useState(INITIAL);
  const [consent, setConsent] = useState(false);
  const [loadingResume, setLoadingResume] = useState(false);

  useEffect(() => {
    let active = true;
    axios.get(`${JOB_API_END_POINT}/fit-status`, { withCredentials: true })
      .then(({ data }) => active && setState(current => ({ ...current, status: data.available ? 'ready' : 'unavailable' })))
      .catch(() => active && setState(current => ({ ...current, status: 'unavailable' })));
    return () => { active = false; };
  }, []);

  const setReviewText = text => setState(current => ({ ...current, text: redactResumeForReview(text).slice(0, 16000), error: '', analysis: null }));
  const loadPdf = async source => {
    try {
      setLoadingResume(true);
      setReviewText(await extractResumeText(source));
    } catch (error) {
      setState(current => ({ ...current, error: error.message || 'We could not read that résumé.' }));
    } finally { setLoadingResume(false); }
  };
  const requestFit = async () => {
    if (state.text.trim().length < 100) return setState(current => ({ ...current, error: 'Add at least 100 characters of résumé text before continuing.' }));
    if (!consent) return setState(current => ({ ...current, error: 'Please confirm consent after reviewing your text.' }));
    try {
      setState(current => ({ ...current, status: 'working', error: '', analysis: null }));
      const { data } = await axios.post(`${JOB_API_END_POINT}/${job._id}/fit`, { resumeText: state.text, consent: true }, { withCredentials: true });
      setState(current => ({ ...current, status: 'ready', analysis: data.analysis }));
    } catch (error) {
      setState(current => ({ ...current, status: 'ready', error: error.response?.data?.message || 'The analysis could not be completed. Try again shortly.' }));
    }
  };

  if (!job?._id) return null;
  if (!user) return <FitNotice title="See how your résumé fits this role" text="Sign in as a candidate to review your résumé privately and get evidence-based career feedback." action="Sign in to try AI fit" />;
  if (user.role !== 'student') return <FitNotice title="AI fit review is for candidates" text="Candidate accounts can compare a reviewed résumé with this job. Recruiter accounts can continue managing openings from the dashboard." />;
  if (state.status === 'unavailable') return <section className="fit-card fit-unavailable"><Sparkles aria-hidden="true" /><div><p className="fit-kicker">Career guidance</p><h2>AI fit review is coming soon</h2><p>We are finishing the private résumé review service. Your résumé is not sent anywhere from this page.</p></div></section>;

  return <section className="fit-card" aria-labelledby="fit-title">
    <div className="fit-heading"><div className="fit-icon"><Sparkles aria-hidden="true" /></div><div><p className="fit-kicker">Private career guidance</p><h2 id="fit-title">Check how your résumé speaks to this role</h2><p>Get evidence-based strengths, gaps, and improvements. This is coaching support—not a hiring decision or a score.</p></div></div>
    <div className="fit-privacy"><ShieldCheck aria-hidden="true" /><span>Review and edit the text first. Common contact details are removed before analysis; do not include anything else you do not want to share.</span></div>
    <div className="fit-actions">
      {user.profile?.resume && <button type="button" className="fit-action" disabled={loadingResume} onClick={() => loadPdf(user.profile.resume)}><FileText aria-hidden="true" />{loadingResume ? 'Reading saved résumé…' : 'Use saved résumé'}</button>}
      <label className="fit-action"><Upload aria-hidden="true" />Upload PDF<input type="file" accept="application/pdf,.pdf" hidden disabled={loadingResume} onChange={event => { const file = event.target.files?.[0]; if (file) { if (file.size > 5 * 1024 * 1024) setState(current => ({ ...current, error: 'Please use a PDF smaller than 5 MB.' })); else loadPdf(file); } event.target.value = ''; }} /></label>
      <span className="fit-action-note">Text-based PDFs work best</span>
    </div>
    <label className="fit-text-label" htmlFor="resume-review">Your reviewed résumé text <span>(required)</span></label>
    <textarea id="resume-review" className="fit-textarea" value={state.text} maxLength={16000} onChange={event => setReviewText(event.target.value)} placeholder="Paste the experience, education, and skills you want reviewed. Contact details are automatically redacted, but you can remove anything else here." />
    <div className="fit-meta"><span>{state.text.length.toLocaleString()} / 16,000 characters</span><span>Nothing is sent until you check consent and choose Analyze.</span></div>
    <label className="fit-consent"><input type="checkbox" checked={consent} onChange={event => setConsent(event.target.checked)} /><span>I agree that the reviewed text above may be sent to Groq solely to generate career feedback for this job. I understand I can remove details before I continue.</span></label>
    {state.error && <p className="fit-error" role="alert">{state.error}</p>}
    <div className="fit-submit-row"><button type="button" className="fit-submit" disabled={state.status === 'working'} onClick={requestFit}>{state.status === 'working' ? <><LoaderCircle className="fit-spin" aria-hidden="true" />Analyzing your evidence…</> : <><Sparkles aria-hidden="true" />Analyze résumé fit</>}</button><Link to="/profile" className="fit-profile-link">Update profile</Link></div>
    {state.analysis && <FitAnalysis analysis={state.analysis} />}
  </section>;
}

function FitNotice({ title, text, action }) {
  return <section className="fit-card fit-unavailable fit-notice"><Sparkles aria-hidden="true" /><div><p className="fit-kicker">CarrerNex AI</p><h2>{title}</h2><p>{text}</p>{action && <Link to="/login" className="fit-notice-action">{action}</Link>}</div></section>;
}

function FitAnalysis({ analysis }) {
  return <div className="fit-results" aria-live="polite"><div className="fit-summary"><p className="fit-kicker">Your career review</p><p>{analysis.summary}</p></div>
    <div className="fit-result-grid"><ResultGroup title="Evidence that connects" items={analysis.strengths} empty="No direct matches were evidenced in the text provided." render={item => <><strong>{item.requirement}</strong><p>{item.explanation}</p><blockquote>Job: “{item.jobEvidence}”</blockquote><blockquote>Résumé: “{item.resumeEvidence}”</blockquote></>} /><ResultGroup title="Worth strengthening" items={analysis.gaps} empty="No specific gaps were identified from the job text." render={item => <><strong>{item.requirement}</strong><p>{item.suggestion}</p><blockquote>Job: “{item.jobEvidence}”</blockquote></>} /></div>
    {analysis.improvements?.length > 0 && <div className="fit-improvements"><h3>Next edits to consider</h3><ul>{analysis.improvements.map((improvement, index) => <li key={`${improvement}-${index}`}>{improvement}</li>)}</ul></div>}
  </div>;
}

function ResultGroup({ title, items, empty, render }) { return <section className="fit-result-group"><h3>{title}</h3>{items.length ? items.map((item, index) => <article key={`${item.requirement}-${index}`}>{render(item)}</article>) : <p className="fit-empty">{empty}</p>}</section>; }
