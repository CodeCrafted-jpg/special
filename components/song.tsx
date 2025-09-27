"use client"
import React, { useState, useEffect, useRef } from 'react';

// --- GlassKaraokeFrame Component Definition ---
// This is the component that will float over the ILoveYouPage background.
export const GlassKaraokeFrame = ({ 
  audioSrc = "perfect.mp3", 
  title = "Perfect", 
  artist = "Ed Sheeran",
  lyrics = [],
  width = "100%", // Use 100% since it's inside a responsive wrapper
  height = "100%" 
}) => {
  const [currentLyricIndex, setCurrentLyricIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [hearts, setHearts] = useState([]);
  const [sparkles, setSparkles] = useState([]);
  const [notes, setNotes] = useState([]);
  const [lyricPulse, setLyricPulse] = useState(false);
  const [musicTime, setMusicTime] = useState(0);
  const audioRef = useRef(null);

  // Default lyrics structure (same timing as your original)
  const defaultLyrics = [
    { time: 0.0, text: "I found a love for me" },
    { time: 9.0, text: "Darling, just dive right in and follow my lead" },
    { time: 16.0, text: "Well, I found a girl, beautiful and sweet" },
    { time: 24.0, text: "Oh, I never knew you were the someone waiting for me" },
    { time: 32.0, text: "'Cause we were just kids when we fell in love" },
    { time: 35.0, text: "Not knowing what it was" },
    { time: 39.0, text: "I will not give you up this time" },
    { time: 49.0, text: "Darling, just kiss me slow" },
    { time: 51.0, text: "Your heart is all I own" },
    { time: 55.0, text: "And in your eyes, you're holding mine" },
    { time: 61.0, text: "Baby, I'm dancing in the dark with you between my arms" },
    { time: 72.0, text: "Barefoot on the grass, listening to our favorite song" },
    { time: 80.0, text: "When you said you looked a mess" },
    { time: 84.0, text: "I whispered underneath my breath" },
    { time: 88.0, text: "But you heard it" },
    { time: 92.0, text: "Darling, you look perfect tonight" },
    { time: 96.0, text: "Well, I found a woman, stronger than anyone I know" },
    { time: 104.0, text: "She shares my dreams, I hope that someday I'll share her home" },
    { time: 112.0, text: "I found a love to carry more than just my secrets" },
    { time: 118.0, text: "To carry love, to carry children of our own" },
    { time: 125.0, text: "We are still kids, but we're so in love" },
    { time: 131.0, text: "Fighting against all odds" },
    { time: 135.0, text: "I know we'll be alright this time" },
    { time: 142.0, text: "Darling, just hold my hand" },
    { time: 146.0, text: "Be my girl, I'll be your man" },
    { time: 150.0, text: "I see my future in your eyes" },
    { time: 157.0, text: "Baby, I'm dancing in the dark with you between my arms" },
    { time: 165.0, text: "Barefoot on the grass, listening to our favorite song" },
    { time: 173.0, text: "When I saw you in that dress, looking so beautiful" },
    { time: 179.0, text: "I don't deserve this" },
    { time: 182.0, text: "Darling, you look perfect tonight" },
    { time: 192.0, text: "Baby, I'm dancing in the dark with you between my arms" },
    { time: 200.0, text: "Barefoot on the grass, listening to our favorite song" },
    { time: 208.0, text: "I have faith in what I see" },
    { time: 212.0, text: "Now I know I have met an angel in person" },
    { time: 218.0, text: "And she looks perfect" },
    { time: 222.0, text: "I don't deserve this" },
    { time: 226.0, text: "You look perfect tonight" }
  ];

  const activeLyrics = lyrics.length > 0 ? lyrics : defaultLyrics;

  // --- Emitter Effects (Heart, Sparkle, Note Logic) ---
  useEffect(() => {
    // Floating hearts
    if (isPlaying) {
      const heartInterval = setInterval(() => {
        const newHeart = { 
          id: Date.now() + Math.random(), 
          x: Math.random() * 100, 
          delay: Math.random() * 2, 
          size: Math.random() * 15 + 20 
        };
        setHearts(prev => [...prev, newHeart]);
        setTimeout(() => setHearts(prev => prev.filter(h => h.id !== newHeart.id)), 8000);
      }, 1000);
      return () => clearInterval(heartInterval);
    }
    // Cleanup function runs when component unmounts or dependencies change
    return () => {};
  }, [isPlaying]);

  useEffect(() => {
    // Sparkles
    if (isPlaying) {
      const sparkleInterval = setInterval(() => {
        const newSparkle = { 
          id: Date.now() + Math.random(), 
          x: Math.random() * 100, 
          y: Math.random() * 100, 
          delay: Math.random() * 2, 
          duration: Math.random() * 3 + 1 
        };
        setSparkles(prev => [...prev, newSparkle]);
        setTimeout(() => setSparkles(prev => prev.filter(s => s.id !== newSparkle.id)), newSparkle.duration * 1000);
      }, 500);
      return () => clearInterval(sparkleInterval);
    }
    return () => {};
  }, [isPlaying]);

  useEffect(() => {
    // Musical notes
    if (isPlaying) {
      const noteInterval = setInterval(() => {
        const newNote = { 
          id: Date.now() + Math.random(), 
          x: Math.random() * 100, 
          size: Math.random() * 10 + 15, 
          duration: Math.random() * 2 + 3 
        };
        setNotes(prev => [...prev, newNote]);
        setTimeout(() => setNotes(prev => prev.filter(n => n.id !== newNote.id)), (newNote.duration * 1000));
      }, 800);
      return () => clearInterval(noteInterval);
    }
    return () => {};
  }, [isPlaying]);

  // --- Playback and Synchronization Logic ---
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // Ensure the audio source is set before playing (important if audioSrc is a prop)
        audioRef.current.src = audioSrc; 
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
        setIsPlaying(true);
        setShowLyrics(true);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      // Use a slight negative offset to make the text appear slightly before the sound
      const SYNC_OFFSET_SECONDS = -0.2; 
      const time = audioRef.current.currentTime + SYNC_OFFSET_SECONDS;
      setMusicTime(audioRef.current.currentTime);

      const currentLyricIndexToDisplay = activeLyrics.findIndex((lyric, index) => {
        const nextLyric = activeLyrics[index + 1];
        return time >= lyric.time && (!nextLyric || time < nextLyric.time);
      });

      if (currentLyricIndexToDisplay !== -1 && currentLyricIndexToDisplay !== currentLyricIndex) {
        setLyricPulse(true);
        setTimeout(() => setLyricPulse(false), 300);
        setCurrentLyricIndex(currentLyricIndexToDisplay);
      }
    }
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
    setShowLyrics(false);
    setCurrentLyricIndex(-1);
    setMusicTime(0);
  };

  return (
    <div 
      className="glass-karaoke-container"
      style={{
        width,
        height,
        position: 'relative',
        borderRadius: '20px',
        // Glassmorphism effect
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        fontFamily: 'Georgia, serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <style>
        {`
          /* Keyframes for the karaoke component's background and effects */
          @keyframes glassGradient {
            0% { background: rgba(255, 182, 193, 0.3); }
            25% { background: rgba(255, 218, 185, 0.3); }
            50% { background: rgba(255, 192, 203, 0.3); }
            75% { background: rgba(255, 160, 122, 0.3); }
            100% { background: rgba(255, 182, 193, 0.3); }
          }

          .glass-karaoke-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, 
              rgba(255, 182, 193, 0.2), 
              rgba(255, 218, 185, 0.2), 
              rgba(255, 192, 203, 0.2)
            );
            animation: glassGradient 10s ease infinite;
            pointer-events: none;
          }

          .karaoke-controls {
            position: absolute;
            top: 20px;
            right: 20px;
            z-index: 10;
          }

          .glass-play-button {
            font-size: 1.8rem;
            background: rgba(255, 255, 255, 0.2);
            border: 2px solid rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: white;
            transition: all 0.3s ease;
            padding-left: 3px;
            backdrop-filter: blur(10px);
          }

          .glass-play-button:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: scale(1.05);
          }

          .glass-lyrics-container {
            text-align: center;
            color: white;
            text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
            max-width: 90%;
            z-index: 5;
            position: relative;
          }

          .glass-song-title {
            font-size: 2.5rem;
            margin-bottom: 5px;
            font-weight: bold;
          }

          .glass-current-lyric {
            font-size: 1.8rem;
            font-weight: bold;
            margin: 15px 0;
            opacity: 1;
            transition: all 0.3s ease;
            line-height: 1.4;
          }

          .glass-current-lyric.pulse {
            transform: scale(1.05);
            color: #ffee00;
            text-shadow: 0 0 10px rgba(255, 238, 0, 0.5);
          }

          .glass-previous-lyric, .glass-next-lyric {
            font-size: 1.1rem;
            opacity: 0.6;
            transition: opacity 0.5s;
          }

          .glass-progress-bar {
            position: absolute;
            bottom: 15px;
            left: 15px;
            right: 15px;
            height: 6px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 3px;
            overflow: hidden;
            backdrop-filter: blur(5px);
          }

          .glass-progress-fill {
            height: 100%;
            background: linear-gradient(90deg, rgba(255, 255, 255, 0.8), rgba(255, 238, 0, 0.8));
            width: 0%;
            transition: width 0.1s linear;
            border-radius: 3px;
          }

          .glass-heart, .glass-sparkle, .glass-note {
            position: absolute;
            pointer-events: none;
            top: 100%;
            left: var(--x);
            animation-delay: var(--delay, 0s);
          }

          .glass-heart {
            font-size: var(--size, 20px);
            animation: glassFloatUp 8s linear forwards;
            color: rgba(255, 105, 180, 0.8);
          }

          .glass-sparkle {
            width: 6px;
            height: 6px;
            background: rgba(255, 235, 179, 0.9);
            box-shadow: 0 0 8px 2px rgba(255, 235, 179, 0.6);
            border-radius: 50%;
            top: var(--y);
            left: var(--x);
            animation: glassSparkleAnim var(--duration, 2s) ease-in-out forwards;
          }

          .glass-note {
            font-size: var(--size, 16px);
            color: rgba(255, 255, 255, 0.8);
            animation: glassFloatNote var(--duration, 4s) linear forwards;
          }

          @keyframes glassFloatUp {
            0% { transform: translateY(0); opacity: 0; }
            20% { opacity: 0.8; }
            100% { transform: translateY(-120vh) rotate(5deg); opacity: 0; }
          }

          @keyframes glassSparkleAnim {
            0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
            50% { opacity: 1; transform: scale(1.5) rotate(180deg); }
          }

          @keyframes glassFloatNote {
            0% { transform: translateY(0) rotate(0deg); opacity: 0; }
            20% { opacity: 0.8; }
            100% { transform: translateY(-120vh) rotate(360deg); opacity: 0; }
          }
        `}
      </style>

      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleAudioEnd}
        preload="metadata"
      />

      <div className="karaoke-controls">
        <button className="glass-play-button" onClick={togglePlay}>
          {isPlaying ? "⏸" : "▶"}
        </button>
      </div>

      {!showLyrics || currentLyricIndex === -1 ? (
        <div className="glass-lyrics-container">
          <h1 className="glass-song-title">{title}</h1>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "1.2rem", fontStyle: "italic" }}>
            by {artist}
          </p>
          <p style={{ marginTop: '15px', fontSize: '1rem' }}>Press ▶ to start the karaoke!</p>
        </div>
      ) : (
        <div className="glass-lyrics-container">
          {currentLyricIndex > 0 && (
            <div className="glass-previous-lyric">{activeLyrics[currentLyricIndex - 1]?.text}</div>
          )}
          <div className={`glass-current-lyric ${lyricPulse ? "pulse" : ""}`}>
            {activeLyrics[currentLyricIndex]?.text}
          </div>
          {currentLyricIndex < activeLyrics.length - 1 && (
            <div className="glass-next-lyric">{activeLyrics[currentLyricIndex + 1]?.text}</div>
          )}
        </div>
      )}

      <div className="glass-progress-bar">
        <div
          className="glass-progress-fill"
          style={{ width: `${(musicTime / (audioRef.current?.duration || 1)) * 100}%` }}
        />
      </div>

      {/* Floating Hearts, Sparkles, Notes */}
      {hearts.map(heart => (
        <div
          key={heart.id}
          className="glass-heart"
          style={{
            '--x': `${heart.x}%`,
            '--delay': `${heart.delay}s`,
            '--size': `${heart.size}px`
          }}
        >
          ❤️
        </div>
      ))}

      {sparkles.map(sparkle => (
        <div
          key={sparkle.id}
          className="glass-sparkle"
          style={{
            '--x': `${sparkle.x}%`,
            '--y': `${sparkle.y}%`,
            '--duration': `${sparkle.duration}s`,
            animationDelay: `${sparkle.delay}s`
          }}
        />
      ))}

      {notes.map(note => (
        <div
          key={note.id}
          className="glass-note"
          style={{
            '--x': `${note.x}%`,
            '--size': `${note.size}px`,
            '--duration': `${note.duration}s`
          }}
        >
          🎵
        </div>
      ))}
    </div>
  );
};