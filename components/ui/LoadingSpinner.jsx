export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-primary font-semibold text-lg tracking-widest uppercase">
          Loading...
        </p>
      </div>
    </div>
  );
}