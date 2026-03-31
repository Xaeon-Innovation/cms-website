export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-surface">
      <img
        src="/assets/longlogo.png"
        alt="Creative Multi Solutions"
        className="loader-beat h-16 w-auto object-contain md:h-20"
      />
    </div>
  );
}
