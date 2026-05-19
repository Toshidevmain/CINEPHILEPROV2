'use client';

import React from 'react';
import { type Show, type NavItem } from '@/types';
import Link from 'next/link';
import {
  cn,
  getSearchValue,
  handleDefaultSearchBtn,
  handleDefaultSearchInp,
} from '@/lib/utils';
import { siteConfig } from '@/configs/site';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';
import { useSearchStore } from '@/stores/search';
import { ModeToggle as ThemeToggle } from '@/components/theme-toggle';
import { DebouncedInput } from '@/components/debounced-input';
import MovieService from '@/services/MovieService';

interface MainNavProps {
  items?: NavItem[];
}

interface SearchResult {
  results: Show[];
}

export function MainNav({ items }: MainNavProps) {
  const path = usePathname();
  const router = useRouter();
  const searchStore = useSearchStore();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    if (!isMounted) return;
    window.addEventListener('popstate', handlePopstateEvent, false);
    return () => {
      window.removeEventListener('popstate', handlePopstateEvent, false);
    };
  }, [isMounted]);

  const handlePopstateEvent = () => {
    const pathname = window.location.pathname;
    const search: string = getSearchValue('q');

    if (!search?.length || !pathname.includes('/search')) {
      searchStore.reset();
      searchStore.setOpen(false);
    } else if (search?.length) {
      searchStore.setOpen(true);
      searchStore.setLoading(true);
      searchStore.setQuery(search);
      setTimeout(() => {
        handleDefaultSearchBtn();
      }, 10);
      setTimeout(() => {
        handleDefaultSearchInp();
      }, 20);
      MovieService.searchMovies(search)
        .then((response: SearchResult) => {
          void searchStore.setShows(response.results);
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => searchStore.setLoading(false));
    }
  };

  async function searchShowsByQuery(value: string) {
    if (!value?.trim()?.length) {
      if (path === '/search') {
        router.push('/home');
      } else {
        window.history.pushState(null, '', path);
      }
      return;
    }

    if (getSearchValue('q')?.trim()?.length) {
      window.history.replaceState(null, '', `search?q=${value}`);
    } else {
      window.history.pushState(null, '', `search?q=${value}`);
    }

    searchStore.setQuery(value);
    searchStore.setLoading(true);
    const shows = await MovieService.searchMovies(value);
    searchStore.setLoading(false);
    void searchStore.setShows(shows.results);

    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  React.useEffect(() => {
    if (!isMounted) return;
    const changeBgColor = () => {
      window.scrollY > 50 ? setIsScrolled(true) : setIsScrolled(false);
    };
    window.addEventListener('scroll', changeBgColor);
    return () => window.removeEventListener('scroll', changeBgColor);
  }, [isMounted]);

  const handleChangeStatusOpen = (value: boolean): void => {
    searchStore.setOpen(value);
    if (!value) searchStore.reset();
  };

  return (
    <div
      className={cn(
        'fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between px-[4%] transition-all duration-500',
        isScrolled
          ? 'bg-[#141414] shadow-lg shadow-black/20'
          : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent',
      )}>
      <div className="flex items-center gap-8">
        <Link
          href="/"
          className="flex items-center group"
          onClick={() => handleChangeStatusOpen(false)}>
          <span className="text-2xl font-bold text-netflix tracking-tight transition-transform duration-300 group-hover:scale-105">
            CINEPHILE
          </span>
        </Link>
        {items?.length ? (
          <nav className="hidden items-center gap-6 md:flex">
            {items?.map(
              (item, index) =>
                item.href && (
                  <Link
                    key={index}
                    href={item.href}
                    className={cn(
                      'text-sm font-medium transition-all duration-200 relative after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-netflix after:transition-all after:duration-300 hover:after:w-full',
                      path === item.href
                        ? 'text-white font-semibold after:w-full'
                        : 'text-[#B3B3B3] hover:text-white',
                      item.disabled && 'cursor-not-allowed opacity-80',
                    )}
                    onClick={() => handleChangeStatusOpen(false)}>
                    {item.title}
                  </Link>
                ),
            )}
          </nav>
        ) : null}
      </div>
      <div className="flex items-center gap-2">
        <DebouncedInput
          id="search-input"
          open={searchStore.isOpen}
          value={searchStore.query}
          onChange={searchShowsByQuery}
          onChangeStatusOpen={handleChangeStatusOpen}
          containerClassName={cn(path === '/' ? 'hidden' : 'flex')}
        />
        <Link
          rel="noreferrer"
          target="_blank"
          href={siteConfig.links.github}
          className={cn(
            'hidden md:flex',
            path === '/' ? 'md:hidden' : 'md:flex',
          )}>
          <Icons.gitHub className="h-5 w-5 text-[#B3B3B3] hover:text-white transition-colors" />
        </Link>
        <ThemeToggle />
        <div className="flex md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-transparent"
            onClick={() => handleChangeStatusOpen(!searchStore.isOpen)}>
            <Icons.search className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MainNav;
