import Link from "next/link";

export default function GlobalNotFound() {
  return (
    <div className="min-h-screen bg-spot-beige flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-spot-red mb-4">404</h1>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            Oops! The page you&apos;re looking for doesn&apos;t exist.
          </p>
          <p className="text-gray-500">
            The page you&apos;re trying to access may have been moved or is no
            longer available.
          </p>
        </div>

        <Link
          href="/en"
          className="inline-block bg-spot-red text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
