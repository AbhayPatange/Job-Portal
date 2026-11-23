import { useState } from 'react';
import axios from 'axios';
import { LoaderCircle, MessageCircleQuestion, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { JOB_API_END_POINT } from '@/utils/constant';

export default function InterviewPrepAssistant({ job, user }) {
  const [state, setState] = useState({ loading: false, error: '', prep: null });
  if (!job?._id) return null;
  if (!user) return <section className="prep-card prep-notice"><MessageCircleQuestion aria-hidden="true" /><div><p className="fit-kicker">CarrerNex AI</p><h2>Practice for this interview</h2><p>Sign in as a candidate for job-specific interview questions.</p><Link to="/login">Sign in to start</Link></div></section>;
  if (user.role !== 'student') return null;
  const generate = async () => { try { setState({ loading: true, error: '', prep: null }); const { data } = await axios.post(`${JOB_API_END_POINT}/${job._id}/interview-prep`, {}, { withCredentials: true }); setState({ loading: false, error: '', prep: data.prep }); } catch (error) { setState({ loading: false, error: error.response?.data?.message || 'Interview prep could not be created. Please try again later.', prep: null }); } };
  return <section className="prep-card" aria-labelledby="prep-title"><div className="prep-heading"><MessageCircleQuestion aria-hidden="true" /><div><p className="fit-kicker">CarrerNex AI interview prep</p><h2 id="prep-title">Practice for this role</h2><p>Generate focused questions and answer approaches from this job description. These are practice prompts, not employer questions.</p></div></div><button type="button" className="prep-button" disabled={state.loading} onClick={generate}>{state.loading ? <><LoaderCircle className="fit-spin" aria-hidden="true" />Creating your practice set…</> : <><Sparkles aria-hidden="true" />Generate interview prep</>}</button>{state.error && <p className="fit-error" role="alert">{state.error}</p>}{state.prep && <div className="prep-results"><p className="prep-tip">{state.prep.openingTip}</p>{state.prep.questions.map((item, index) => <article key={`${item.question}-${index}`}><span>Question {index + 1}</span><h3>{item.question}</h3><p><strong>Why it matters:</strong> {item.whyItMatters}</p><p><strong>How to approach it:</strong> {item.answerApproach}</p></article>)}</div>}</section>;
}
