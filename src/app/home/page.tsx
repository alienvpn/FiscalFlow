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
      <div className="flex flex-wrap justify-center gap-4 mt-8">
        {allModules.map((item) => (
          <Link
            href={item.href}
            key={item.title}
            className="inline-block rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 h-[45px]"
          >
            <div className="relative flex flex-col justify-center items-center h-full text-primary-foreground text-center bg-primary">
              <div className="relative z-10 px-4">
                <div className="w-full h-px bg-primary-foreground/50 mb-2" />
                <h2 className="py-2 text-[12px] font-bold tracking-wide uppercase whitespace-nowrap">
                  {item.title}
                </h2>
                <div className="w-full h-px bg-primary-foreground/50 mt-2" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
