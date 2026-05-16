export function MeshBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* Base subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-background to-indigo-50/60" />

      {/* Animated blobs */}
      <div className="animate-blob-1 absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-blue-200/30 blur-3xl" />
      <div className="animate-blob-2 absolute -right-24 top-1/4 h-[420px] w-[420px] rounded-full bg-indigo-200/25 blur-3xl" />
      <div className="animate-blob-3 absolute -bottom-20 left-1/3 h-[380px] w-[380px] rounded-full bg-sky-200/20 blur-3xl" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, #5D87FF 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />
    </div>
  )
}
