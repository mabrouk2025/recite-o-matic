
import React, { useState } from 'react';
import { AudioPlayerProvider } from "@/context/AudioPlayerContext";
import AudioPlayer from "@/components/AudioPlayer";
import RecitationList from "@/components/RecitationList";

const AudioPlayerPage: React.FC = () => {
  return (
    <AudioPlayerProvider>
      <div className="min-h-screen bg-background/95 py-6">
        <div className="container mx-auto p-4">
          <header className="text-right mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">مشغل التلاوات</h1>
            <p className="text-muted-foreground">استمع إلى تلاوات القرآن الكريم بصوت كبار القراء</p>
          </header>
          
          <RecitationList />
        </div>
        <AudioPlayer />
      </div>
    </AudioPlayerProvider>
  );
};

export default AudioPlayerPage;
