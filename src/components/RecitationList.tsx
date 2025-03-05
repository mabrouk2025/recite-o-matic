
import React from 'react';
import { useAudioPlayer, type Recitation } from "@/context/AudioPlayerContext";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Play, Pause } from "lucide-react";

const RecitationItem: React.FC<{ recitation: Recitation }> = ({ recitation }) => {
  const { currentRecitation, isPlaying, playRecitation } = useAudioPlayer();
  
  const isActive = currentRecitation?.id === recitation.id;
  
  // Open the player without auto-playing
  const handleRecitationSelect = () => {
    playRecitation(recitation);
    if (isActive && isPlaying) {
      // If it's already playing, toggle pause
    } else {
      // If it's not playing, pause it immediately
      setTimeout(() => {
        const { togglePlayPause } = useAudioPlayer();
        if (isPlaying) {
          togglePlayPause();
        }
      }, 0);
    }
  };
  
  return (
    <Card 
      className={cn(
        "flex items-center gap-4 p-4 cursor-pointer transition-all hover:shadow-md",
        isActive ? "border-primary/30 bg-primary/5" : "hover:bg-accent/50"
      )}
      onClick={handleRecitationSelect}
    >
      <Avatar className="h-14 w-14 rounded-full border-2 border-primary/20 overflow-hidden flex-shrink-0">
        <img 
          src={recitation.reciter.image} 
          alt={recitation.reciter.name} 
          className="object-cover"
        />
      </Avatar>
      
      <div className="flex-1 text-right">
        <h3 className="font-semibold text-lg">{recitation.surah.arabicName}</h3>
        <p className="text-sm text-muted-foreground">{recitation.reciter.arabicName}</p>
      </div>
      
      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-background border">
        {isActive && isPlaying ? (
          <Pause className="h-5 w-5 text-primary" />
        ) : (
          <Play className="h-5 w-5 ml-0.5 text-primary" />
        )}
      </div>
    </Card>
  );
};

const RecitationList: React.FC = () => {
  const { recitations } = useAudioPlayer();
  
  return (
    <div className="container mx-auto p-4 space-y-4 pb-32">
      <h2 className="text-2xl font-bold text-right mb-6">التلاوات المتاحة</h2>
      <div className="space-y-3">
        {recitations.map((recitation) => (
          <RecitationItem key={recitation.id} recitation={recitation} />
        ))}
      </div>
    </div>
  );
};

export default RecitationList;
