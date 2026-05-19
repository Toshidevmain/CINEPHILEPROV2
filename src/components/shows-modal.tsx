'use client';

import * as React from 'react';
import { useModalStore } from '@/stores/modal';
import {
  MediaType,
  type Genre,
  type ShowWithGenreAndVideo,
  type VideoResult,
} from '@/types';
import Youtube from 'react-youtube';
import Image from 'next/image';
import { getMobileDetect, getYear } from '@/lib/utils';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import Link from 'next/link';
import MovieService from '@/services/MovieService';
import { usePathname } from 'next/navigation';

type YouTubePlayer = {
  mute: () => void;
  unMute: () => void;
  playVideo: () => void;
  seekTo: (value: number) => void;
  container: HTMLDivElement;
  internalPlayer: YouTubePlayer;
};

type YouTubeEvent = {
  target: YouTubePlayer;
};

const userAgent =
  typeof navigator === 'undefined' ? 'SSR' : navigator.userAgent;
const { isMobile } = getMobileDetect(userAgent);
const defaultOptions: Record<string, object> = {
  playerVars: {
    rel: 0,
    mute: 1,
    loop: 1,
    autoplay: 1,
    controls: 0,
    showinfo: 0,
    disablekb: 1,
    enablejsapi: 1,
    playsinline: 1,
    cc_load_policy: 0,
    modestbranding: 3,
  },
};

const ShowModal = () => {
  const pathname = usePathname();
  const modalStore = useModalStore();
  const IS_MOBILE: boolean = isMobile();

  const [trailer, setTrailer] = React.useState('');
  const [genres, setGenres] = React.useState<Genre[]>([]);
  const [isMuted, setIsMuted] = React.useState<boolean>(true);
  const [options, setOptions] =
    React.useState<Record<string, object>>(defaultOptions);
  const [showVideo, setShowVideo] = React.useState(false);

  const youtubeRef = React.useRef(null);
  const imageRef = React.useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    if (IS_MOBILE) {
      setOptions((state: Record<string, object>) => ({
        ...state,
        playerVars: { ...state.playerVars, mute: 1 },
      }));
    }
    void handleGetData();
  }, []);

  const handleGetData = async () => {
    const id: number | undefined = modalStore.show?.id;
    const type: string =
      modalStore.show?.media_type === MediaType.TV ? 'tv' : 'movie';
    if (!id || !type) return;
    const data: ShowWithGenreAndVideo = await MovieService.findMovieByIdAndType(
      id,
      type,
    );
    if (data?.genres) {
      setGenres(data.genres);
    }
    if (data.videos?.results?.length) {
      const videoData: VideoResult[] = data.videos?.results;
      const result: VideoResult | undefined = videoData.find(
        (item: VideoResult) => item.type === 'Trailer',
      );
      if (result?.key) {
        setTrailer(result.key);
        setShowVideo(true);
      }
    }
  };

  const handleCloseModal = () => {
    modalStore.reset();
    if (!modalStore.show || modalStore.firstLoad) {
      window.history.pushState(null, '', '/home');
    } else {
      window.history.back();
    }
  };

  const onEnd = (event: YouTubeEvent) => {
    event.target.seekTo(0);
  };

  const onPlay = () => {
    if (imageRef.current) {
      imageRef.current.style.opacity = '0';
    }
    if (youtubeRef.current) {
      const iframeRef: HTMLElement | null =
        document.getElementById('video-trailer');
      if (iframeRef) iframeRef.classList.remove('opacity-0');
    }
  };

  const onReady = (event: YouTubeEvent) => {
    event.target.playVideo();
  };

  const handleChangeMute = () => {
    setIsMuted((state: boolean) => !state);
    if (!youtubeRef.current) return;
    const videoRef: YouTubePlayer = youtubeRef.current as YouTubePlayer;
    if (isMuted && youtubeRef.current) {
      videoRef.internalPlayer.unMute();
    } else if (youtubeRef.current) {
      videoRef.internalPlayer.mute();
    }
  };

  return (
    <Dialog
      open={modalStore.open}
      onOpenChange={handleCloseModal}
      aria-label="Modal containing show's details">
      <DialogContent className="w-full max-w-4xl overflow-hidden rounded-md bg-[#181818] p-0 text-left shadow-xl animate-scale-in">
        <div className="relative aspect-video w-full bg-black">
          <Image
            fill
            priority
            ref={imageRef}
            alt={modalStore?.show?.title ?? 'poster'}
            className="object-cover"
            src={`https://image.tmdb.org/t/p/original/${modalStore.show?.backdrop_path}`}
          />
          {trailer && showVideo && (
            <Youtube
              opts={options}
              onEnd={onEnd}
              onPlay={onPlay}
              ref={youtubeRef}
              onReady={onReady}
              videoId={trailer}
              id="video-trailer"
              title={
                modalStore.show?.title ??
                modalStore.show?.name ??
                'video-trailer'
              }
              className="relative aspect-video w-full"
              style={{ width: '100%', height: '100%' }}
              iframeClassName={`relative pointer-events-none w-[100%] h-[100%] z-[-10] opacity-0`}
            />
          )}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#181818] to-transparent" />
          <div className="absolute bottom-4 left-6 z-20 flex items-center gap-3">
            <Link
              href={`/watch/${
                modalStore.show?.media_type === MediaType.MOVIE
                  ? 'movie'
                  : 'tv'
              }/${modalStore.show?.id}`}>
              <Button className="flex items-center gap-2 rounded bg-white px-6 py-1.5 text-black font-bold hover:bg-white/80 transition">
                <Icons.play className="h-5 w-5 fill-black" aria-hidden="true" />
                Play
              </Button>
            </Link>
            <Button
              aria-label={`${isMuted ? 'Unmute' : 'Mute'} video`}
              variant="ghost"
              className="h-10 w-10 rounded-full border border-white/40 bg-transparent p-0 text-white hover:bg-white/20"
              onClick={handleChangeMute}>
              {isMuted ? (
                <Icons.volumeMute className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Icons.volume className="h-5 w-5" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
        <div className="px-6 pb-6 pt-4">
          <div className="flex items-center gap-3 text-sm">
            <span className="font-semibold text-green-400">
              {Math.round((Number(modalStore.show?.vote_average) / 10) * 100) ??
                '-'}% Match
            </span>
            {modalStore.show?.release_date ? (
              <span className="text-[#B3B3B3]">{getYear(modalStore.show?.release_date)}</span>
            ) : modalStore.show?.first_air_date ? (
              <span className="text-[#B3B3B3]">{getYear(modalStore.show?.first_air_date)}</span>
            ) : null}
            {modalStore.show?.original_language && (
              <span className="grid h-5 w-8 place-items-center text-xs font-bold uppercase text-[#B3B3B3] border border-[#B3B3B3]">
                {modalStore.show.original_language}
              </span>
            )}
          </div>
          <DialogTitle className="mt-3 text-xl font-bold text-white">
            {modalStore.show?.title ?? modalStore.show?.name}
          </DialogTitle>
          <DialogDescription className="mt-3 text-sm leading-relaxed text-[#B3B3B3]">
            {modalStore.show?.overview ?? ''}
          </DialogDescription>
          {genres?.length > 0 && (
            <div className="mt-3 text-sm text-[#777]">
              <span className="text-[#B3B3B3]">Genres: </span>
              {genres.map((g) => g.name).filter(Boolean).join(', ')}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShowModal;
