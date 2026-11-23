import { FilePenLine, MessageCircleQuestion, ScanSearch, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  { icon: ScanSearch, label: '01 · APPLY WITH CLARITY', title: 'Résumé fit review', copy: 'Compare reviewed résumé text with a role and see evidence-based strengths and gaps.' },
  { icon: MessageCircleQuestion, label: '02 · PRACTICE WITH PURPOSE', title: 'Interview prep', copy: 'Practice job-specific questions and learn how to frame your answers clearly.' },
  { icon: FilePenLine, label: '03 · WRITE WITH CONFIDENCE', title: 'Cover letter drafts', copy: 'Turn your approved highlights into an editable, role-specific first draft.' },
];

export default function AIShowcase() {
  return <section className="ai-showcase" id="carrernex-ai"><div className="ai-showcase-top"><div className="section-heading"><div><span className="eyebrow"><Sparkles size={14} /> CARRERNEX AI</span><h2>Practical help for every application.</h2></div><Link to="/jobs" className="button-outline">Explore jobs to try it</Link></div><p className="ai-showcase-intro">Private, candidate-controlled tools that start from a job you choose. You review any personal text before it is sent for AI assistance.</p></div><div className="ai-feature-grid">{features.map(({ icon: Icon, label, title, copy }) => <article key={title}><span className="ai-icon"><Icon size={23} /></span><small>{label}</small><h3>{title}</h3><p>{copy}</p><Link to="/jobs">Try it on a job <span aria-hidden="true">→</span></Link></article>)}</div><p className="ai-showcase-footnote">You stay in control: review details, edit drafts, and decide what to use.</p></section>;
}
