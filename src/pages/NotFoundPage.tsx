import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NotFoundPage = () => (
  <div className="panel not-found-page">
    <span className="eyebrow">404 — PAGE NOT FOUND</span>
    <h2>This page wandered off.</h2>
    <p>The link may be outdated, or the page may have moved.</p>
    <Link className="button button-primary" to="/"><ArrowLeft size={15} />Back to dashboard</Link>
  </div>
);
