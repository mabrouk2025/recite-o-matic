
import React from 'react';
import { useAudioPlayer, type RepeatMode } from "@/context/AudioPlayerContext";
import { cn } from "@/lib/utils";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Repeat, 
  Repeat1, 
  Divide, 
  Download,
  ListPlus,
  Share2,
  Volume2,
  Volume1,
  VolumeX,
  X,
  RotateCcw
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const formatTime = (time: number) => {
  if (isNaN(time)) return "0:00";
  
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const AudioPlayer: React.FC = () => {
  const {
    currentRecitation,
    isPlaying,
    currentTime,
    duration,
    volume,
    loading,
    repeatMode,
    togglePlayPause,
    seekTo,
    nextRecitation,
    previousRecitation,
    setVolumeLevel,
    toggleRepeatMode,
    downloadRecitation,
    addToPlaylist,
    shareRecitation,
    replayRecitation
  } = useAudioPlayer();

  const [showVolumeSlider, setShowVolumeSlider] = React.useState(false);
  const [isMinimized, setIsMinimized] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(true);

  const getRepeatIcon = (mode: RepeatMode) => {
    switch (mode) {
      case 'verse':
        return <Repeat1 className="h-5 w-5" />;
      case 'selection':
        return <div className="relative"><Repeat className="h-5 w-5" /><Divide className="h-3 w-3 absolute bottom-0 right-0" /></div>;
      case 'surah':
        return <Repeat className="h-5 w-5" />;
      default:
        return <Repeat className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX className="h-5 w-5" />;
    if (volume < 0.5) return <Volume1 className="h-5 w-5" />;
    return <Volume2 className="h-5 w-5" />;
  };

  if (!currentRecitation || !isVisible) {
    return null;
  }

  const { reciter, surah } = currentRecitation;

  const handleClose = () => {
    if (isPlaying) {
      togglePlayPause();
    }
    setIsVisible(false);
  };

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border animate-slide-up z-50 player-container",
      isMinimized && "h-16"
    )}>
      <div className="container mx-auto p-4 md:p-6">
        <div className="absolute top-2 right-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full hover:bg-primary/10 transition-colors"
                  onClick={handleClose}
                >
                  <X className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent dir="rtl">
                <p>إغلاق</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
          <div className="flex items-center gap-3 flex-shrink-0">
            <Avatar className="h-12 w-12 md:h-16 md:w-16 rounded-full border-2 border-primary/20">
              <img 
                src={reciter.image} 
                alt={reciter.name} 
                className="object-cover rounded-full"
              />
            </Avatar>
            <div className="text-right">
              <h3 className="text-lg font-medium leading-none">{surah.arabicName}</h3>
              <p className="text-sm text-muted-foreground mt-1">{reciter.arabicName}</p>
            </div>
          </div>

          {!isMinimized && (
            <div className="flex-1 w-full flex flex-col gap-2">
              <div className="w-full flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-10 text-center">{formatTime(currentTime)}</span>
                <div className="flex-1 relative">
                  <Slider
                    value={[currentTime]}
                    min={0}
                    max={duration || 100}
                    step={0.1}
                    onValueChange={(value) => seekTo(value[0])}
                    className={cn(
                      "transition-opacity",
                      loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                    )}
                    disabled={loading}
                  />
                  <div 
                    className="absolute top-1/2 left-0 h-1 bg-primary/30 -translate-y-1/2 progress-animation" 
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-10 text-center">{formatTime(duration)}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 md:h-10 md:w-10 rounded-full hover:bg-primary/10 transition-colors"
                          onClick={toggleRepeatMode}
                        >
                          {getRepeatIcon(repeatMode)}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent dir="rtl">
                        <p>وضع التكرار</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <div className="relative">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 md:h-10 md:w-10 rounded-full hover:bg-primary/10 transition-colors"
                            onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                          >
                            {getVolumeIcon()}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent dir="rtl">
                          <p>مستوى الصوت</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    {showVolumeSlider && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 bg-background border rounded-lg shadow-lg min-w-[120px] animate-scale-in">
                        <Slider
                          value={[volume * 100]}
                          min={0}
                          max={100}
                          step={1}
                          onValueChange={(value) => setVolumeLevel(value[0] / 100)}
                          className="w-full"
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-9 w-9 md:h-10 md:w-10 rounded-full hover:bg-primary/10 transition-colors"
                          onClick={previousRecitation}
                        >
                          <SkipBack className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent dir="rtl">
                        <p>السابق</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-9 w-9 md:h-10 md:w-10 rounded-full hover:bg-primary/10 transition-colors mr-1"
                          onClick={replayRecitation}
                        >
                          <RotateCcw className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent dir="rtl">
                        <p>إعادة تشغيل</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className={cn(
                      "h-12 w-12 md:h-14 md:w-14 rounded-full border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-all",
                      isPlaying ? "bg-primary/10" : "bg-background"
                    )}
                    onClick={togglePlayPause}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    ) : isPlaying ? (
                      <Pause className="h-6 w-6" />
                    ) : (
                      <Play className="h-6 w-6 ml-0.5" />
                    )}
                  </Button>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-9 w-9 md:h-10 md:w-10 rounded-full hover:bg-primary/10 transition-colors"
                          onClick={nextRecitation}
                        >
                          <SkipForward className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent dir="rtl">
                        <p>التالي</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                
                <div className="flex items-center gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 md:h-10 md:w-10 rounded-full hover:bg-primary/10 transition-colors"
                          onClick={downloadRecitation}
                        >
                          <Download className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent dir="rtl">
                        <p>تحميل</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 md:h-10 md:w-10 rounded-full hover:bg-primary/10 transition-colors"
                          onClick={addToPlaylist}
                        >
                          <ListPlus className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent dir="rtl">
                        <p>إضافة إلى قائمة التشغيل</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 md:h-10 md:w-10 rounded-full hover:bg-primary/10 transition-colors"
                          onClick={shareRecitation}
                        >
                          <Share2 className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent dir="rtl">
                        <p>مشاركة</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          )}
          
          {isMinimized && (
            <div className="flex-1 flex items-center justify-between">
              <div className="flex-1 ml-4">
                <div className="w-full bg-primary/10 h-1 rounded relative">
                  <div 
                    className="absolute top-0 left-0 h-1 bg-primary/50 rounded progress-animation" 
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 rounded-full hover:bg-primary/10 transition-colors"
                onClick={togglePlayPause}
              >
                {loading ? (
                  <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                ) : isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5 ml-0.5" />
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
