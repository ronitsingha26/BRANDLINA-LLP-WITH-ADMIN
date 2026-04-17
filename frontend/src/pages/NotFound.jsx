import { Link } from "react-router-dom";
import { Seo } from "../components/common/Seo";
import { PageWrapper } from "../components/layout/PageWrapper";

export default function NotFound() {
  return (
    <PageWrapper className="page-container grid place-items-center py-24 text-center">
      <Seo title="Page Not Found | BRANDLINA LLP" description="The page you requested could not be found." />
      <div className="glass-card max-w-xl p-10">
        <p className="section-kicker">404</p>
        <h1 className="mt-2 text-4xl md:text-5xl">Page not found</h1>
        <p className="mt-4 text-text-muted">The route you requested does not exist.</p>
        <Link to="/" className="btn-primary mt-8 inline-flex">
          Back to Home
        </Link>
      </div>
    </PageWrapper>
  );
}
