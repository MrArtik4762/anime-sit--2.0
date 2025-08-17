import React from 'react';
import Hls from 'hls.js';

const HlsPlayer: React.FC<{ sources: { url: string }[] }> = ({ sources }) => {
  const ref = React.useRef<HTMLVideoElement | null>(null);
  const url = sources?.[0]?.url ?? null;

  React.useEffect(() => {
    if (!url || !ref.current) return;
    const video = ref.current;
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
      return () => { hls.destroy(); };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
    }
  }, [url]);

  return (
    <video ref={ref} controls className="w-full h-64 bg-black rounded">
      Your browser does not support video.
    </video>
  );
};

export default HlsPlayer;