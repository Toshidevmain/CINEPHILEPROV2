'use client';

import React, { useEffect, useState } from 'react';
import { MediaType, type Show } from '@/types';
import { useSearchStore } from '@/stores/search';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import Image from 'next/image';
import { useModalStore } from '@/stores/modal';
import Link from 'next/link';
import { getIdFromSlug } from '@/lib/utils';
import MovieService from '@/services/MovieService';
import { type AxiosResponse } from 'axios';

interface HeroProps {
  shows: Show[];
}

const Hero = ({ shows }: HeroProps) => {
  const [randomShow, setRandomShow] = useState<Show | null>(null);
  useEffect(() => {
    if (!shows?.length) return;
    const randomNumber = Math.floor(Math.random() * shows.length);
    setRandomShow(shows[randomNumber] ?? null);
  }, [shows]);

  React.useEffect(() => {
    window.addEventListener('popstate', handlePopstateEvent, false);
    return () => {
      window.removeEventListener('popstate', handlePopstateEvent, false);
    };
  }, []);

  const handlePopstateEvent = () => {
    const pathname = window.location.pathname;
    if (!/\d/.test(pathname)) {
      modalStore.reset();
    } else if (/\d/.test(pathname)) {
      const movieId: number = getIdFromSlug(pathname);
      if (!movieId) {
        return;
      }
      const findMovie: Promise<AxiosResponse<Show>> = pathname.includes(
        '/tv-shows',
      )
        ? MovieService.findTvSeries(movieId)
        : MovieService.findMovie(movieId);
      findMovie
        .then((response: AxiosResponse<Show>) => {
          const { data } = response;
          useModalStore.setState({ show: data, open: true, play: true });
        })
        .catch((error) => {
          console.log(`findMovie: `, error);
        });
    }
  };

  const modalStore = useModalStore();
  const searchStore = useSearchStore();

  if (searchStore.query.length > 0) {
    return null;
  }

  if (!randomShow) return null;

  return (
    <section aria-label="Hero" className="relative -mt-16">
      <div className="relative h-[56.25vw] max-h-[80vh] min-h-[400px] w-full">
        <Image
          src={`https://image.tmdb.org/t/p/original/${
            randomShow?.backdrop_path ?? randomShow?.poster_path ?? ''
          }`}
          alt={randomShow?.title ?? 'poster'}
          className="object-cover"
          fill
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/10 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#141414]/60" />
        <div className="absolute bottom-[15%] left-[4%] z-10 w-full max-w-[600px] animate-fade-in">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg md:text-5xl lg:text-6xl">
            {randomShow?.title ?? randomShow?.name}
          </h1>
          <div className="mt-3 flex items-center gap-3 text-sm">
            <span className="rounded bg-green-500/20 px-2 py-0.5 text-green-400 font-semibold">
              {Math.round((randomShow?.vote_average ?? 0) * 10)}% Match
            </span>
            <span className="text-[#B3B3B3]">{randomShow?.release_date?.split('-')[0] ?? randomShow?.first_air_date?.split('-')[0] ?? ''}</span>
          </div>
          <p className="mt-4 line-clamp-3 text-sm text-[#B3B3B3] md:text-base leading-relaxed drop-shadow">
            {randomShow?.overview ?? ''}
          </p>
          <div className="mt-6 flex items-center gap-3">
            <Link
              prefetch={false}
              href={`/watch/${
                randomShow.media_type === MediaType.MOVIE ? 'movie' : 'tv'
              }/${randomShow.id}`}>
              <Button className="flex items-center gap-2 rounded bg-white px-8 py-2 text-black font-semibold hover:bg-white/80 transition-all hover:scale-105 active:scale-95">
                <Icons.play className="h-5 w-5 fill-black" aria-hidden="true" />
                Play
              </Button>
            </Link>
            <Button
              variant="outline"
              className="flex items-center gap-2 rounded border border-white/40 bg-white/10 px-8 py-2 text-white font-semibold hover:bg-white/20 transition-all hover:scale-105 active:scale-95"
              onClick={() => {
                modalStore.setShow(randomShow);
                modalStore.setOpen(true);
                modalStore.setPlay(true);
              }}>
              <Icons.info className="h-5 w-5" aria-hidden="true" />
              More Info
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
