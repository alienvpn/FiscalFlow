import Link from "next/link";
import { allModules } from "@/lib/navigation";

export default function HomePage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">FiscalFlow</h1>
        <p className="text-muted-foreground mt-2">
          Your central hub for budget and contract management.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {allModules.map((item) => (
          <Link
            href={item.href}
            key={item.title}
            className="block rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105"
          >
            <div className="relative flex flex-col justify-center items-center h-32 text-white text-center bg-gradient-to-r from-cyan-400 to-indigo-600">
              {/* Glossy effect */}
              <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent"></div>

              <div className="relative z-10 w-full px-4">
                <div className="w-full h-px bg-white/50 mb-2" />
                <h2 className="py-2 text-xl font-bold tracking-wide uppercase">
                  {item.title}
                </h2>
                <div className="w-full h-px bg-white/50 mt-2" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
