import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 text-white px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <div className="w-24 h-1 bg-accent mx-auto my-4 rounded-full"></div>
        <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
        <p className="text-neutral mb-8 max-w-md mx-auto">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="btn btn-primary text-black font-bold px-8 py-3 rounded-full"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
