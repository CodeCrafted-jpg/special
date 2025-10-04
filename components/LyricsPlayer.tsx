"use client";
import React, { useState, useEffect, useRef } from "react";

type LyricLine = {
  time: number;
  text: string;
};

const lyrics: LyricLine[] = [
 { time: 0, text: "[This is my favourite song Baby, hope you like it ❤️]" },
  { time: 10, text: "They say you know when you know" },
  { time: 14, text: " you know when you know" },
  { time: 18, text: "So, let's face it, you had me at 'Hello'" },
  { time: 25, text: "Hesitation never helps" },
  { time: 28, text: "How could this be anything, anything else?" },

  { time: 34, text: "[Chorus]" },
  { time: 35, text: "When all I dream of is your eyes" },
  { time: 37, text: "All I long for is your touch" },
  { time: 42, text: "And, darling, something tells me that's enough," },
  { time: 48.5, text: "You can say that I'm a fool" },
  { time: 52, text: "And I don't know very much" },
  { time: 55.7, text: "But I think they call this love" },

  { time: 60.0, text: "[Verse 2]" },
  { time: 66, text: "One smile, one kiss, two lonely hearts is all that it takes" },
  { time: 72, text: "Now, baby, you're on my mind every night, every day" },
  { time: 79, text: "Good vibrations getting loud" },
  { time: 83, text: "How could this be anything, anything else?" },

  { time: 87, text: "[Chorus]" },
  { time: 88, text: "When all I dream of is your eyes" },
  { time: 92, text: "All I long for is your touch" },
  { time: 95.3, text: "And, darling, something tells me that's enough," },
  { time: 102, text: "You can say that I'm a fool" },
  { time: 106.5, text: "And I don't know very much" },
  { time: 110.5, text: "But I think they call this love" },

  { time: 115.0, text: "[Post-Chorus]" },
  { time: 117, text: "Oh, I think they call this love" },

  { time: 120.0, text: "[Bridge]" },
  { time: 113.2, text: "Hmm, ooh-ooh, mm" },
  { time: 136.0, text: "What could this be" },
  { time: 138.2, text: "Between you and me? Oh, oh" },

  { time: 141.0, text: "[Chorus]" },
  { time: 145, text: "All I dream of is your eyes" },
  { time: 147, text: "All I long for is your touch" },
  { time: 151, text: "And, darling, something tells me, tells me it's enough" },
  { time: 157.5, text: "You can say that I'm a fool" },
  { time: 161.5, text: "And I don't know very much" },
  { time: 165, text: "But I think they call—" },
  { time: 169.0, text: "Oh, I think they call—" },
  { time: 171, text: "Yes, I think they call" },
  { time: 178.0, text: "This love ❤️" },

  { time: 183.5, text: "[Outro]" },
  { time: 185.0, text: "This love ❤️" },
];

interface LyricsPlayerProps {
  videoUrl?: string;
  audioSrc?: string;
  onClose: () => void;
}

const LyricsPlayer: React.FC<LyricsPlayerProps> = ({ videoUrl, audioSrc, onClose }) => {
  const videoRef = useRef<HTMLVideoElement | HTMLIFrameElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentLine, setCurrentLine] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const getSectionType = (index: number): string => {
    const text = lyrics[index].text;
    if (text.includes("[Chorus]")) return "chorus-label";
    if (text.includes("[Verse")) return "verse-label";
    if (text.includes("[Bridge]")) return "bridge-label";
    if (text.includes("[Post-Chorus]")) return "post-chorus-label";
    if (text.includes("[Outro]")) return "outro-label";
    
    // Determine section by index ranges
    if (index >= 7 && index <= 12) return "chorus";
    if (index >= 14 && index <= 17) return "verse2";
    if (index >= 19 && index <= 24) return "chorus";
    if (index === 26) return "post-chorus";
    if (index >= 28 && index <= 30) return "bridge";
    if (index >= 32 && index <= 42) return "chorus";
    if (index >= 44 && index <= 45) return "outro";
    return "verse1";
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => {
      const t = audio.currentTime;
      let idx = currentLine;
      while (idx < lyrics.length - 1 && t >= lyrics[idx + 1].time) {
        idx++;
      }
      while (idx > 0 && t < lyrics[idx].time) {
        idx--;
      }
      if (idx !== currentLine) {
        setCurrentLine(idx);
        scrollToLine(idx);
      }
    };
    audio.addEventListener("timeupdate", onTime);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
    };
  }, [currentLine]);

  const scrollToLine = (index: number) => {
    const container = document.getElementById("lyrics-scrollable");
    const lineEl = document.getElementById(`lyric-line-${index}`);
    if (container && lineEl) {
      const topOfLine = lineEl.offsetTop;
      const halfHeight = container.clientHeight / 2;
      container.scrollTo({
        top: topOfLine - halfHeight + lineEl.clientHeight / 2,
        behavior: "smooth",
      });
    }
  };

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="lyrics-overlay">
      <div className="player-controls">
        {audioSrc && (
          <audio ref={audioRef} src={audioSrc} preload="auto" onEnded={onClose} />
        )}
        <button className="play-btn" onClick={handlePlayPause}>
          {isPlaying ? "⏸ Pause" : "▶️ Play"}
        </button>
        <button className="close-btn" onClick={onClose}>✖ Close</button>
      </div>

      <div id="lyrics-scrollable" className="lyrics-container">
        {lyrics.map((line, i) => {
          const sectionType = i === currentLine ? getSectionType(i) : "";
          return (
            <p
              key={i}
              id={`lyric-line-${i}`}
              className={`lyric-line ${i === currentLine ? `active ${sectionType}` : ""}`}
            >
              {line.text}
            </p>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes fadeInSlide {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.5) translateY(-50px);
          }
          60% {
            opacity: 1;
            transform: scale(1.1) translateY(0);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes floatIn {
          0% {
            opacity: 0;
            transform: translateY(50px) rotate(-5deg);
          }
          100% {
            opacity: 1;
            transform: translateY(0) rotate(0deg);
          }
        }

        @keyframes glow {
          0%, 100% {
            text-shadow: 0 0 20px currentColor, 0 0 40px currentColor;
          }
          50% {
            text-shadow: 0 0 30px currentColor, 0 0 60px currentColor, 0 0 80px currentColor;
          }
        }

        .lyrics-overlay {
          position: fixed;
          top: 0; left: 0;
          width: 100vw; height: 100vh;
          background: rgba(0, 0, 0, 0.8);
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
        }
        
        .player-controls {
          display: flex;
          gap: 15px;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .play-btn, .close-btn {
          padding: 10px 20px;
          background: linear-gradient(135deg, #ff4d6d 0%, #ff758f 100%);
          color: white;
          border: none;
          border-radius: 25px;
          cursor: pointer;
          transition: all 0.3s;
          font-weight: 600;
          box-shadow: 0 4px 15px rgba(255, 77, 109, 0.4);
        }
        
        .play-btn:hover, .close-btn:hover {
          background: linear-gradient(135deg, #ff1744 0%, #ff4d6d 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 77, 109, 0.6);
        }
        
        .lyrics-container {
          flex: 1;
          width: 100%;
          max-width: 900px;
          overflow-y: auto;
          text-align: center;
          padding: 10px;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        
        .lyrics-container::-webkit-scrollbar {
          display: none;
        }
        
        .lyric-line {
          margin: 15px 0;
          font-size: 1.4rem;
          color: #666;
          opacity: 0.4;
          transition: all 0.5s ease;
          font-weight: 500;
        }
        
        /* Verse 1 - Gentle fade in slide */
        .lyric-line.active.verse1 {
          color: #87ceeb;
          font-size: 2rem;
          font-weight: 700;
          opacity: 1;
          animation: floatIn 0.9s ease-out;
          text-shadow: 0 0 20px rgba(135, 206, 235, 0.6);
        }
        
        /* Chorus - Bold bounce with glow */
        .lyric-line.active.chorus {
          color: #ff4d6d;
          font-size: 2.3rem;
          font-weight: 800;
          opacity: 1;
          animation:  floatIn  0.7s cubic-bezier(0.68, -0.55, 0.265, 1.55), glow 2s ease-in-out infinite;
        }
        
        /* Verse 2 - Scale in with rotation */
        .lyric-line.active.verse2 {
          color: #ffa07a;
          font-size: 2rem;
          font-weight: 700;
          opacity: 1;
          animation: scaleIn 0.6s ease-out;
          text-shadow: 0 0 25px rgba(255, 160, 122, 0.7);
        }
        
        /* Bridge - Float in with subtle rotation */
        .lyric-line.active.bridge {
          color: #9370db;
          font-size: 2.1rem;
          font-weight: 700;
          opacity: 1;
          animation: floatIn 0.9s ease-out;
          text-shadow: 0 0 30px rgba(147, 112, 219, 0.8);
        }
        
        /* Post-Chorus - Subtle glow */
        .lyric-line.active.post-chorus {
          color: #ff69b4;
          font-size: 2rem;
          font-weight: 700;
          opacity: 1;
          animation: fadeInSlide 0.7s ease-out, glow 3s ease-in-out infinite;
        }
        
        /* Outro - Gentle fade */
        .lyric-line.active.outro {
          color: #fff;
          font-size: 2.2rem;
          font-weight: 800;
          opacity: 1;
          animation: scaleIn 1s ease-out;
          text-shadow: 0 0 40px rgba(255, 255, 255, 0.8), 0 0 60px rgba(255, 77, 109, 0.6);
        }
        
        /* Section labels */
        .lyric-line.active.chorus-label,
        .lyric-line.active.verse-label,
        .lyric-line.active.bridge-label,
        .lyric-line.active.post-chorus-label,
        .lyric-line.active.outro-label {
          color: #888;
          font-size: 1rem;
          font-weight: 600;
          opacity: 0.8;
          animation: fadeInSlide 0.5s ease-out;
          text-shadow: none;
        }
      `}</style>
    </div>
  );
};

export default LyricsPlayer;