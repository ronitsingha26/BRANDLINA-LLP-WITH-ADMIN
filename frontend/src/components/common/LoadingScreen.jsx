import { motion as Motion } from "framer-motion";

export function LoadingScreen() {
  return (
    <div className="min-h-[60vh] w-full bg-[#f8fafc] px-4 py-16">
      <div className="mx-auto flex max-w-lg flex-col gap-6">
        <div className="flex items-center gap-4">
          <Motion.div
            className="h-12 w-12 rounded-full border-2 border-[rgba(37,99,235,0.25)] border-t-[#2563eb]"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
          />
          <div className="flex flex-1 flex-col gap-2">
            <div className="shimmer-skeleton h-3 w-[60%] max-w-[200px] rounded-full" />
            <div className="shimmer-skeleton h-2 w-[40%] max-w-[120px] rounded-full opacity-80" />
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="shimmer-skeleton h-24 rounded-2xl" />
          <div className="shimmer-skeleton h-24 rounded-2xl" />
          <div className="shimmer-skeleton h-24 rounded-2xl sm:col-span-2" />
        </div>
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#64748b]">Loading</p>
      </div>
    </div>
  );
}
