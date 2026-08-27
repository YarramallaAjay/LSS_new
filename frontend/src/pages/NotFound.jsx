import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
      <div className="text-8xl mb-4">🍬</div>
      <h2 className="text-4xl font-bold text-gray-800 mb-2">404</h2>
      <p className="text-xl text-gray-500 mb-6">Page not found</p>
      <Link
        to="/"
        className="bg-gradient-to-r from-orange-400 to-orange-600 text-white font-semibold px-8 py-3 rounded-full hover:shadow-lg transition-all no-underline"
      >
        Go back home
      </Link>
    </div>
  );
}
