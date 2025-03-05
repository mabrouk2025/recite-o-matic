
import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { toast } from "@/components/ui/sonner";

export interface Reciter {
  id: string;
  name: string;
  arabicName?: string;
  image: string;
}

export interface Surah {
  id: number;
  name: string;
  arabicName: string;
  englishName: string;
  numberOfAyahs: number;
}

export interface Recitation {
  id: string;
  reciterId: string;
  surahId: number;
  audioUrl: string;
  reciter: Reciter;
  surah: Surah;
}

export type RepeatMode = 'none' | 'surah' | 'verse' | 'selection';

interface AudioPlayerContextType {
  currentRecitation: Recitation | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  loading: boolean;
  repeatMode: RepeatMode;
  recitations: Recitation[];
  playRecitation: (recitation: Recitation) => void;
  togglePlayPause: () => void;
  seekTo: (time: number) => void;
  nextRecitation: () => void;
  previousRecitation: () => void;
  setVolumeLevel: (level: number) => void;
  toggleRepeatMode: () => void;
  downloadRecitation: () => void;
  addToPlaylist: () => void;
  shareRecitation: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRecitation, setCurrentRecitation] = useState<Recitation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [loading, setLoading] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('none');
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Mock recitation data
  const recitations: Recitation[] = [
    {
      id: '1',
      reciterId: 'mishari-rashid',
      surahId: 1,
      audioUrl: 'https://server8.mp3quran.net/afs/001.mp3',
      reciter: {
        id: 'mishari-rashid',
        name: 'Mishari Rashid al-Afasy',
        arabicName: 'مشاري راشد العفاسي',
        image: 'https://i1.sndcdn.com/artworks-000133952182-92v3cl-t500x500.jpg'
      },
      surah: {
        id: 1,
        name: 'Al-Fatiha',
        arabicName: 'الفاتحة',
        englishName: 'The Opening',
        numberOfAyahs: 7
      }
    },
    {
      id: '2',
      reciterId: 'mishari-rashid',
      surahId: 2,
      audioUrl: 'https://server8.mp3quran.net/afs/002.mp3',
      reciter: {
        id: 'mishari-rashid',
        name: 'Mishari Rashid al-Afasy',
        arabicName: 'مشاري راشد العفاسي',
        image: 'https://i1.sndcdn.com/artworks-000133952182-92v3cl-t500x500.jpg'
      },
      surah: {
        id: 2,
        name: 'Al-Baqarah',
        arabicName: 'البقرة',
        englishName: 'The Cow',
        numberOfAyahs: 286
      }
    },
    {
      id: '3',
      reciterId: 'abdul-basit',
      surahId: 1,
      audioUrl: 'https://server7.mp3quran.net/basit/001.mp3',
      reciter: {
        id: 'abdul-basit',
        name: 'Abdul Basit Abd us-Samad',
        arabicName: 'عبد الباسط عبد الصمد',
        image: 'https://i1.sndcdn.com/artworks-000078284092-02xnqp-t500x500.jpg'
      },
      surah: {
        id: 1,
        name: 'Al-Fatiha',
        arabicName: 'الفاتحة',
        englishName: 'The Opening',
        numberOfAyahs: 7
      }
    }
  ];

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
    }

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setLoading(false);
    };

    const handleEnded = () => {
      switch (repeatMode) {
        case 'surah':
          // Repeat the current surah
          audio.currentTime = 0;
          audio.play();
          break;
        case 'none':
          // Play next recitation if available
          nextRecitation();
          break;
        default:
          setIsPlaying(false);
      }
    };

    const handleLoadStart = () => {
      setLoading(true);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadstart', handleLoadStart);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadstart', handleLoadStart);
    };
  }, [repeatMode]);

  const playRecitation = (recitation: Recitation) => {
    if (audioRef.current) {
      if (currentRecitation?.id === recitation.id) {
        togglePlayPause();
        return;
      }
      
      audioRef.current.src = recitation.audioUrl;
      audioRef.current.load();
      setLoading(true);
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setCurrentRecitation(recitation);
        })
        .catch((error) => {
          console.error('Error playing audio:', error);
          setLoading(false);
        });
    }
  };

  const togglePlayPause = () => {
    if (!currentRecitation) return;
    
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play()
          .catch((error) => {
            console.error('Error playing audio:', error);
          });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const nextRecitation = () => {
    if (!currentRecitation) return;
    
    const currentIndex = recitations.findIndex(r => r.id === currentRecitation.id);
    if (currentIndex < recitations.length - 1) {
      playRecitation(recitations[currentIndex + 1]);
    }
  };

  const previousRecitation = () => {
    if (!currentRecitation) return;
    
    const currentIndex = recitations.findIndex(r => r.id === currentRecitation.id);
    if (currentIndex > 0) {
      playRecitation(recitations[currentIndex - 1]);
    } else {
      // If it's the first track, restart the current track
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        setCurrentTime(0);
      }
    }
  };

  const setVolumeLevel = (level: number) => {
    if (audioRef.current) {
      audioRef.current.volume = level;
      setVolume(level);
    }
  };

  const toggleRepeatMode = () => {
    const modes: RepeatMode[] = ['none', 'surah', 'verse', 'selection'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setRepeatMode(modes[nextIndex]);
    
    toast(`تم تفعيل وضع التكرار: ${getRepeatModeText(modes[nextIndex])}`);
  };

  const getRepeatModeText = (mode: RepeatMode): string => {
    switch(mode) {
      case 'none': return 'لا تكرار';
      case 'surah': return 'تكرار السورة';
      case 'verse': return 'تكرار الآية';
      case 'selection': return 'تكرار المقطع';
      default: return '';
    }
  };

  const downloadRecitation = () => {
    if (!currentRecitation) return;
    
    // Create a temporary link element to download the audio
    const link = document.createElement('a');
    link.href = currentRecitation.audioUrl;
    link.download = `${currentRecitation.reciter.name} - ${currentRecitation.surah.name}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('جاري تحميل التلاوة');
  };

  const addToPlaylist = () => {
    // Placeholder for adding to playlist functionality
    toast.success('تمت إضافة التلاوة إلى قائمة التشغيل');
  };

  const shareRecitation = () => {
    if (!currentRecitation) return;
    
    if (navigator.share) {
      navigator.share({
        title: `${currentRecitation.reciter.name} - ${currentRecitation.surah.name}`,
        text: `استمع إلى تلاوة سورة ${currentRecitation.surah.arabicName} بصوت ${currentRecitation.reciter.arabicName}`,
        url: window.location.href,
      })
      .catch((error) => console.error('Error sharing:', error));
    } else {
      // Fallback copy to clipboard
      navigator.clipboard.writeText(window.location.href)
        .then(() => toast.success('تم نسخ رابط التلاوة إلى الحافظة'))
        .catch((error) => console.error('Error copying to clipboard:', error));
    }
  };

  const value = {
    currentRecitation,
    isPlaying,
    currentTime,
    duration,
    volume,
    loading,
    repeatMode,
    recitations,
    playRecitation,
    togglePlayPause,
    seekTo,
    nextRecitation,
    previousRecitation,
    setVolumeLevel,
    toggleRepeatMode,
    downloadRecitation,
    addToPlaylist,
    shareRecitation,
  };

  return <AudioPlayerContext.Provider value={value}>{children}</AudioPlayerContext.Provider>;
};

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
};
