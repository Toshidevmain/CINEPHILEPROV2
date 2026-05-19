import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/configs/site";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Index() {
  return (
    <div className="relative min-h-screen bg-[#141414] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-[#141414] z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-netflix/20 via-transparent to-transparent z-0" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-netflix/5 rounded-full blur-3xl z-0" />
      <section id="hero" aria-labelledby="hero-heading" className="relative z-20 container mx-auto flex min-h-screen flex-col items-center justify-center gap-6 pb-8 pt-28 text-center md:pb-12 lg:py-32">
        <div className="animate-fade-in">
          <Link href={siteConfig.links.marjhunf} target="_blank" rel="noreferrer">
            <Badge aria-hidden="true" className="rounded-md px-3.5 py-1.5 border border-netflix/50 bg-netflix/10 hover:bg-netflix/20 transition-all duration-300 hover:scale-105" variant="outline">
              <Icons.marjhunf className="mr-2 h-3.5 w-3.5 text-netflix" />
              <span className="text-netflix font-semibold">marjhunf</span>
            </Badge>
            <span className="sr-only">Marjhunf</span>
          </Link>
        </div>
        <h1 className="max-w-screen-lg text-center text-4xl font-bold text-white sm:text-5xl md:text-6xl lg:text-7xl animate-slide-up">
          Unlimited movies, TV shows, and more
        </h1>
        <p className="max-w-[42rem] text-lg text-[#B3B3B3] sm:text-xl animate-slide-up" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
          Watch anywhere. Cancel anytime. Ready to watch? Click below to start.
        </p>
        <div className="space-x-4 animate-slide-up" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
          <Link className={cn(buttonVariants({ variant: "destructive", size: "lg" }), 'glow-red hover:scale-105 active:scale-95 transition-all duration-300')} href="/home">
            Watch Now <ArrowRight className="ml-2 inline-block h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
