'use client';
import React from 'react';

interface EmbedPlayerProps {
  url: string;
}

function EmbedPlayer({ url }: EmbedPlayerProps) {
  const ref = React.useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    if (ref.current) {
      ref.current.src = url;
    }
  }, [url]);

  const handleIframeLoad = () => {
    setLoaded(true);
    if (ref.current) {
      ref.current.style.opacity = '1';
    }
  };

  return (
    <div className="relative h-full w-full">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        </div>
      )}
      <iframe
        ref={ref}
        width="100%"
        height="100%"
        allowFullScreen
        style={{ opacity: 0, transition: 'opacity 0.5s ease' }}
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={handleIframeLoad}
        title="Video player"
      />
    </div>
  );
}

export default EmbedPlayer;
