import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Reveal } from "../components/common/Reveal";
import { Seo } from "../components/common/Seo";
import { PageWrapper } from "../components/layout/PageWrapper";
import { fetchCareerJobs, submitCareerApplication } from "../lib/publicApi";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  experience: "",
};

export default function Careers() {
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [form, setForm] = useState(initialForm);

  const selectedJob = useMemo(() => jobs.find((item) => item._id === selectedJobId) || null, [jobs, selectedJobId]);

  useEffect(() => {
    let mounted = true;

    async function loadJobs() {
      setLoadingJobs(true);
      try {
        const data = await fetchCareerJobs();

        if (!mounted) {
          return;
        }

        const list = Array.isArray(data) ? data : [];
        setJobs(list);

        if (list.length) {
          setSelectedJobId(list[0]._id);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to load openings");
      } finally {
        if (mounted) {
          setLoadingJobs(false);
        }
      }
    }

    loadJobs();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!selectedJobId) {
      toast.error("No recruitment opening is available right now");
      return;
    }

    if (!form.name || !form.email || !form.phone || !form.experience) {
      toast.error("Please fill all fields");
      return;
    }

    setSubmitting(true);

    try {
      await submitCareerApplication({
        jobId: selectedJobId,
        name: form.name,
        email: form.email,
        phone: form.phone,
        experience: form.experience,
      });

      toast.success("Application submitted successfully");
      setForm(initialForm);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageWrapper>
      <Seo
        title="Careers | BRANDLINA LLP"
        description="Explore open roles at BRANDLINA LLP and apply to join our turnkey engineering and operations teams."
      />

      <section className="page-container py-14 md:py-20">
        <Reveal>
          <p className="section-kicker">Careers</p>
          <h1 className="section-heading">Build the systems that power critical environments.</h1>
        </Reveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-4">
            {loadingJobs ? (
              <article className="glass-card p-6 text-sm text-text-muted">Loading openings...</article>
            ) : jobs.length === 0 ? (
              <article className="glass-card p-6 text-sm text-text-muted">No recruitment openings are available right now.</article>
            ) : (
              jobs.map((job, index) => (
                <Reveal key={job._id} delay={index * 0.05}>
                  <article className="glass-card p-6">
                    <h2 className="text-2xl">{job.title}</h2>
                    <p className="mt-2 text-sm text-text-muted">
                      {job.employmentType || "Full Time"} • {job.location}
                    </p>
                    {job.description && <p className="mt-3 text-sm text-text-muted">{job.description}</p>}
                    <button
                      type="button"
                      onClick={() => setSelectedJobId(job._id)}
                      className="btn-secondary mt-5"
                    >
                      Apply
                    </button>
                  </article>
                </Reveal>
              ))
            )}
          </div>

          <Reveal className="glass-card p-7 md:p-9">
            <p className="section-kicker">Application Form</p>
            <h2 className="mt-2 text-3xl">Apply for {selectedJob?.title || "Current Opening"}</h2>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className="form-input"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                className="form-input"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={form.phone}
                onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                className="form-input"
              />
              <textarea
                rows="5"
                placeholder="Tell us about your experience"
                value={form.experience}
                onChange={(e) => setForm((prev) => ({ ...prev, experience: e.target.value }))}
                className="form-input resize-none"
              />
              <button
                type="submit"
                disabled={submitting || !selectedJobId}
                className="btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          </Reveal>
        </div>
      </section>
    </PageWrapper>
  );
}
