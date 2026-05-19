'use client';

import * as React from 'react';
import { useModalStore } from '@/stores/modal';
import { MediaType, type Show } from '@/types';

import { cn, getNameFromShow, getSlug } from '@/lib/utils';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

interface ShowsCarouselProps {
  title: string;
  shows: Show[];
}

const ShowsCarousel = ({ title, shows }: ShowsCarouselProps) => {
  const pathname = usePathname();

  const showsRef = React.useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = React.useState(false);
  const [showRightArrow, setShowRightArrow] = React.useState(true);

  const checkScroll = () => {
    if (!showsRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = showsRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 1);
  };

  const scrollToDirection = (direction: 'left' | 'right') => {
    if (!showsRef.current) return;
    const { scrollLeft, clientWidth } = showsRef.current;
    const offset =
      direction === 'left'
        ? scrollLeft - clientWidth * 0.75
        : scrollLeft + clientWidth * 0.75;
    showsRef.current.scrollTo({ left: offset, behavior: 'smooth' });
    setTimeout(checkScroll, 400);
  };

  React.useEffect(() => {
    checkScroll();
  }, [shows]);

  if (!shows?.length) return null;

  return (
    <section aria-label={title} className="relative pl-[4%]">
      <h2 className="text-lg font-semibold text-white md:text-xl lg:text-2xl mb-3">
        {title}
      </h2>
      <div className="relative group">
        <Button
          aria-label="Scroll left"
          variant="ghost"
          className={cn(
            'absolute left-0 top-0 z-10 h-full w-12 items-center justify-center rounded-none bg-black/60 opacity-0 transition-all duration-300 hover:bg-black/80 group-hover:opacity-100',
            showLeftArrow ? 'flex' : 'hidden',
          )}>
          <Icons.chevronLeft
            className="h-8 w-8 text-white drop-shadow"
            aria-hidden="true"
            onClick={() => scrollToDirection('left')}
          />
        </Button>
        <div
          ref={showsRef}
          onScroll={checkScroll}
          className="scrollbar-thin flex gap-1.5 overflow-x-auto overflow-y-hidden pb-2"
          style={{ scrollBehavior: 'smooth' }}>
          {shows.map((show) => (
            <ShowCard key={show.id} show={show} pathname={pathname} />
          ))}
        </div>
        <Button
          aria-label="Scroll right"
          variant="ghost"
          className={cn(
            'absolute right-0 top-0 z-10 h-full w-12 items-center justify-center rounded-none bg-black/60 opacity-0 transition-all duration-300 hover:bg-black/80 group-hover:opacity-100',
            showRightArrow ? 'flex' : 'hidden',
          )}
          onClick={() => scrollToDirection('right')}>
          <Icons.chevronRight className="h-8 w-8 text-white drop-shadow" aria-hidden="true" />
        </Button>
      </div>
    </section>
  );
};

export default ShowsCarousel;

export const ShowCard = ({
  show,
  pathname,
}: {
  show: Show;
  pathname: string;
}) => {
  const imageOnErrorHandler = (
    event: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    event.currentTarget.src = '/images/grey-thumbnail.jpg';
  };

  return (
    <div
      className="relative flex-shrink-0 w-[150px] sm:w-[170px] md:w-[190px] lg:w-[210px] cursor-pointer rounded overflow-hidden transition-all duration-300 hover:scale-110 hover:z-20 hover:shadow-xl hover:shadow-black/50 card-hover group/card"
      onClick={() => {
        const name = getNameFromShow(show);
        const path: string =
          show.media_type === MediaType.TV ? 'tv-shows' : 'movies';
        window.history.pushState(
          null,
          '',
          `${path}/${getSlug(show.id, name)}`,
        );
        useModalStore.setState({
          show: show,
          open: true,
          play: true,
        });
      }}>
      <div className="aspect-[2/3] w-full relative">
        <img
          src={
            show.poster_path ?? show.backdrop_path
              ? `https://image.tmdb.org/t/p/w500/${
                  show.poster_path ?? show.backdrop_path
                }`
              : '/images/grey-thumbnail.jpg'
          }
          alt={show.title ?? show.name ?? 'poster'}
          className="h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-110"
          loading="lazy"
          onError={imageOnErrorHandler}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
      </div>
    </div>
  );
};
