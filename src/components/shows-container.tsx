'use client';

import { usePathname } from 'next/navigation';
import { useSearchStore } from '@/stores/search';
import type { CategorizedShows } from '@/types';

import { getIdFromSlug } from '@/lib/utils';
import ShowModal from '@/components/shows-modal';
import ShowsCarousel from '@/components/shows-carousel';
import ShowsGrid from '@/components/shows-grid';
import { useModalStore } from '@/stores/modal';
import React from 'react';
import { type Show } from '@/types/index';
import { type AxiosResponse } from 'axios';
import MovieService from '@/services/MovieService';

interface ShowsContainerProps {
  show?: Show;
  shows: CategorizedShows[];
}

const ShowsContainer = ({ shows }: ShowsContainerProps) => {
  const pathname = usePathname();

  const modalStore = useModalStore();
  const searchStore = useSearchStore();

  React.useEffect(() => {
    void handleOpenModal();
  }, []);

  const handleOpenModal = async (): Promise<void> => {
    if (!/\d/.test(pathname) || modalStore.open) {
      return;
    }
    const movieId: number = getIdFromSlug(pathname);
    if (!movieId) {
      return;
    }
    try {
      const response: AxiosResponse<Show> = pathname.includes('/tv-shows')
        ? await MovieService.findTvSeries(movieId)
        : await MovieService.findMovie(movieId);
      const data: Show = response.data;
      if (data)
        useModalStore.setState({
          show: data,
          open: true,
          play: true,
          firstLoad: true,
        });
    } catch (error) {}
  };

  if (searchStore.query.length > 0) {
    return <ShowsGrid shows={searchStore.shows} query={searchStore.query} />;
  }

  return (
    <div className="relative z-10 mt-0 space-y-4 pb-16 animate-fade-in">
      {modalStore.open && <ShowModal />}
      {shows.map(
        (item, index) =>
          item.visible && (
            <div
              key={item.title}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}>
              <ShowsCarousel
                title={item.title}
                shows={item.shows ?? []}
              />
            </div>
          ),
      )}
    </div>
  );
};

export default ShowsContainer;
