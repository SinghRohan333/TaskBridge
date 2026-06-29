export default function SkeletonCard() {
  return (
    <div className="bg-white border border-[#e5e7eb] rounded-xl p-5 animate-pulse">
      <div className="h-4 bg-[#e5e7eb] rounded w-3/4 mb-3" />
      <div className="h-3 bg-[#e5e7eb] rounded w-1/2 mb-4" />
      <div className="flex gap-2 mb-4">
        <div className="h-6 bg-[#e5e7eb] rounded-full w-16" />
        <div className="h-6 bg-[#e5e7eb] rounded-full w-16" />
      </div>
      <div className="h-3 bg-[#e5e7eb] rounded w-1/3" />
    </div>
  );
}
