import { FilePenLine, MessageCircleQuestion, ScanSearch, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  { icon: ScanSearch, title: 'Résumé fit review', copy: 'Compare reviewed résumé text with a role and see evidence-based strengths and gaps.' },
  { icon: MessageCircleQuestion, title: 'Interview prep', copy: 'Practice job-specific questions and learn how to frame your answers clearly.' },
  { icon: FilePenLine, title: 'Cover letter drafts', copy: 'Turn your approved highlights into an editable, role-specific first draft.' },
];

export default function AIShowcase() {
  return <section className="ai-showcase"><div className="section-heading"><div><span className="eyebrow"><Sparkles size={14} /> CARRERNEX AI</span><h2>Practical help for every application.</h2></div><Link to="/jobs" className="button-outline">Explore jobs to try it</Link></div><p className="ai-showcase-intro">Private, candidate-controlled tools that start from a job you choose. You review any personal text before it is sent for AI assistance.</p><div className="ai-feature-grid">{features.map(({ icon: Icon, title, copy }) => <article key={title}><span><Icon size={23} /></span><h3>{title}</h3><p>{copy}</p><Link to="/jobs">Try it on a job <span aria-hidden="true">→</span></Link></article>)}</div></section>;
}
