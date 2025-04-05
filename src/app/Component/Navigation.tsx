import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="pt-8 px-4 sm:px-8 md:px-16 lg:px-20">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="w-full md:w-auto flex justify-center md:justify-start">
          <Link 
            className="inline-block px-6 py-3 min-w-32 text-center bg-violet-500 text-white font-bold rounded-full hover:bg-violet-600 focus:outline-2 focus:outline-offset-2 focus:outline-violet-500 active:bg-violet-700" 
            href="/"
          >
            Home
          </Link>
        </div>

        <div className="w-full md:w-auto flex flex-wrap justify-center gap-3 md:gap-4 lg:gap-6">
          <Link 
            className="inline-block px-4 py-3 min-w-24 text-center bg-violet-500 text-white font-bold rounded-full hover:bg-violet-600 focus:outline-2 focus:outline-offset-2 focus:outline-violet-500 active:bg-violet-700" 
            href="/Games"
          >
            All Games
          </Link>
          <Link 
            className="inline-block px-4 py-3 min-w-24 text-center bg-violet-500 text-white font-bold rounded-full hover:bg-violet-600 focus:outline-2 focus:outline-offset-2 focus:outline-violet-500 active:bg-violet-700" 
            href="/Help"
          >
            Help
          </Link>
          <Link 
            className="inline-block px-4 py-3 min-w-24 text-center bg-violet-500 text-white font-bold rounded-full hover:bg-violet-600 focus:outline-2 focus:outline-offset-2 focus:outline-violet-500 active:bg-violet-700" 
            href="/Contact"
          >
            Contact
          </Link>
          <Link 
            className="inline-block px-4 py-3 min-w-24 text-center bg-violet-500 text-white font-bold rounded-full hover:bg-violet-600 focus:outline-2 focus:outline-offset-2 focus:outline-violet-500 active:bg-violet-700" 
            href="/Blogs"
          >
            Blogs
          </Link>
        </div>
      </div>
    </nav>
  );
}