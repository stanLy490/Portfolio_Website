'use client';

import { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';

interface MusicTrack {
  name: string;
  url: string;
  volume: number;
}

interface MusicLibrary {
  [key: string]: MusicTrack;
}

interface AudioContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  play: () => void;
  pause: () => void;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
  switchTrack: (trackKey: string) => void;
}

const MusicLibrary: MusicLibrary = {
  mainTheme: {
    name: '主题音乐 - 空灵',
    url: '/music/main.mp3',
    volume: 0.25,
  },
  galaxyTheme: {
    name: '银河主题',
    url: '/music/second.mp3',
    volume: 0.25,
  },
  ambient1: {
    name: '环境音乐1',
    url: '/music/music1.mp3',
    volume: 0.3,
  },
  ambient2: {
    name: '环境音乐2',
    url: '/music/music2.mp3',
    volume: 0.3,
  },
};

const pageMusicMap: { [path: string]: string } = {
  '/': 'mainTheme',
  '/galaxy': 'galaxyTheme',
  '/meteorite': 'galaxyTheme',
};

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(0.25);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.loop = true;
    audioRef.current.volume = volume;

    const savedMuted = localStorage.getItem('musicMuted');
    if (savedMuted === 'true') {
      setIsMuted(true);
      audioRef.current.muted = true;
    }

    const savedVolume = localStorage.getItem('musicVolume');
    if (savedVolume) {
      const vol = parseFloat(savedVolume);
      setVolumeState(vol);
      audioRef.current.volume = vol;
    }

    const handleInteraction = () => {
      setHasInteracted(true);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
    window.addEventListener('click', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!hasInteracted) return;

    const path = window.location.pathname;
    let trackKey = 'mainTheme';

    for (const [pagePath, musicKey] of Object.entries(pageMusicMap)) {
      if (path === pagePath || (pagePath !== '/' && path.startsWith(pagePath))) {
        trackKey = musicKey;
        break;
      }
    }

    const track = MusicLibrary[trackKey];
    if (track && audioRef.current) {
      setCurrentTrack(track);
      audioRef.current.src = track.url;
      audioRef.current.volume = isMuted ? 0 : volume;

      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((error) => {
        console.log('Auto-play prevented:', error);
      });
    }
  }, [hasInteracted]);

  const play = () => {
    if (audioRef.current && currentTrack) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(console.error);
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const newMuted = !isMuted;
      audioRef.current.muted = newMuted;
      setIsMuted(newMuted);
      localStorage.setItem('musicMuted', String(newMuted));
    }
  };

  const setVolume = (newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setVolumeState(newVolume);
      localStorage.setItem('musicVolume', String(newVolume));
    }
  };

  const switchTrack = (trackKey: string) => {
    const track = MusicLibrary[trackKey];
    if (track && audioRef.current) {
      setCurrentTrack(track);
      audioRef.current.src = track.url;
      audioRef.current.volume = isMuted ? 0 : volume;

      if (hasInteracted) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(console.error);
      }
    }
  };

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
        isMuted,
        volume,
        play,
        pause,
        toggleMute,
        setVolume,
        switchTrack,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}

export { MusicLibrary };
