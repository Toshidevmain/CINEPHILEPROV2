import React from 'react';
import EmbedPlayer from '@/components/watch/embed-player';
import Link from 'next/link';
import { Icons } from '@/components/icons';

export const revalidate = 3600;

export default function Page({ params }: { params: { slug: string } }) {
  const id = params.slug.split('-').pop();
  return (
    <div className="relative h-full w-full bg-black">
      <div className="absolute left-0 right-0 top-0 z-50 bg-gradient-to-b from-black/80 to-transparent px-6 py-4">
        <Link
          href="/home"
          className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">
          <Icons.chevronLeft className="h-5 w-5" />
          <span className="font-medium">Exit</span>
        </Link>
      </div>
      <EmbedPlayer url={`https://vidsrc.cc/v2/embed/movie/${id}`} />
    </div>
  );
}
