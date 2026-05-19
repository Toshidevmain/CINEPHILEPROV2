'use client';

import { useModalStore } from '@/stores/modal';
import type { Show } from '@/types';
import ShowModal from './shows-modal';
import { ShowCard } from './shows-carousel';
import { usePathname } from 'next/navigation';
import { useSearchStore } from '@/stores/search';
import ShowsSkeleton from './shows-skeleton';

interface SearchedShowsProps {
  shows: Show[];
  query?: string;
}

const ShowsGrid = ({ shows, query }: SearchedShowsProps) => {
  const pathname = usePathname();
  const modalStore = useModalStore();
  const searchStore = useSearchStore();

  return (
    <section aria-label="Grid of shows" className="w-full px-[4%] pt-20">
      {modalStore.open && <ShowModal />}
      <div className="min-h-[60vh]" id="main-view">
        {query && searchStore.loading ? (
          <ShowsSkeleton />
        ) : query && !shows?.length ? (
          <div className="mt-12 text-center">
            <div className="inline-block text-left text-sm text-[#B3B3B3]">
              <p className="mb-4">{`Your search for "${query}" did not have any matches.`}</p>
              <p className="mb-4">Suggestions:</p>
              <ul className="list-disc pl-8 space-y-1">
                <li>Try different keywords</li>
                <li>Looking for a movie or TV show?</li>
                <li>Try using a movie, TV show title, an actor or director</li>
                <li>Try a genre, like comedy, romance, sports, or drama</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {shows.map((show: Show, index: number) => (
              <div
                key={show.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 30}ms`, animationFillMode: 'both' }}>
                <ShowCard show={show} pathname={pathname} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ShowsGrid;
