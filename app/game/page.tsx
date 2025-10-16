"use client";

import React, { useState, useEffect, useRef } from "react";

export default function MemoryGame() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [moves, setMoves] = useState(0);
  const [backgroundTheme, setBackgroundTheme] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // List of your photo file names (repeat each twice for pairs)
  const photoIds = [1, 2, 3, 4, 5, 6];

  const backgroundThemes = [
    'radial-gradient(circle at 20% 50%, rgba(120, 0, 150, 0.3), transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 0, 100, 0.3), transparent 50%), linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    'radial-gradient(circle at 30% 70%, rgba(255, 100, 150, 0.4), transparent 60%), radial-gradient(circle at 70% 30%, rgba(100, 200, 255, 0.3), transparent 50%), linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'radial-gradient(circle at 50% 50%, rgba(255, 200, 100, 0.3), transparent 70%), linear-gradient(135deg, #ffecd2 0%, #fcb69f 50%, #ff9a9e 100%)',
    'radial-gradient(circle at 10% 80%, rgba(168, 237, 234, 0.5), transparent 50%), radial-gradient(circle at 90% 20%, rgba(254, 214, 227, 0.5), transparent 50%), linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'radial-gradient(circle at 40% 40%, rgba(255, 150, 200, 0.4), transparent 60%), linear-gradient(135deg, #d299c2 0%, #fef9d7 50%, #f093fb 100%)',
  ];

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const allCards = [...photoIds, ...photoIds]
      .sort(() => Math.random() - 0.5)
      .map((id, index) => ({
        id: index,
        imageId: id,
      }));
    setCards(allCards);
    setFlipped([]);
    setMatched([]);
    setGameOver(false);
    setMoves(0);
  };

  // Flip logic
  const handleFlip = (id) => {
    if (flipped.length === 2 || flipped.includes(id) || matched.includes(id))
      return;

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      const [first, second] = newFlipped;
      const firstCard = cards[first];
      const secondCard = cards[second];

      if (firstCard.imageId === secondCard.imageId) {
        setTimeout(() => {
          setMatched((prev) => [...prev, first, second]);
          setFlipped([]);
        }, 600);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  useEffect(() => {
    if (matched.length && matched.length === cards.length) {
      setTimeout(() => setGameOver(true), 800);
    }
  }, [matched, cards]);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const changeTheme = () => {
    setBackgroundTheme((prev) => (prev + 1) % backgroundThemes.length);
  };

  return (
    <div className="memory-container">
      <audio ref={audioRef} src="/bg-music.mp3" loop preload="auto" />

      {/* Floating Orbs */}
      <div className="floating-orb orb1"></div>
      <div className="floating-orb orb2"></div>
      <div className="floating-orb orb3"></div>

      {/* Controls */}
      <div className="controls">
        <button className="control-btn" onClick={toggleMusic}>
          {isPlaying ? '🔇 Pause' : '🎵 Music'}
        </button>
        <button className="control-btn" onClick={changeTheme}>
          🎨 Theme
        </button>
        <button className="control-btn" onClick={initializeGame}>
          🔄 Reset
        </button>
      </div>

      {/* Stats */}
      <div className="stats-display">
        <div className="stat-box">
          <span className="stat-label">Moves:</span> {moves}
        </div>
        <div className="stat-box">
          <span className="stat-label">Pairs:</span> {matched.length / 2}/6
        </div>
      </div>

      <h1 className="title">💞 Memory Match Game 💞</h1>

      <div className="grid">
        {cards.map((card, index) => {
          const isFlipped = flipped.includes(index) || matched.includes(index);
          const isMatched = matched.includes(index);
          return (
            <div
              key={index}
              className={`card ${isFlipped ? "flipped" : ""} ${isMatched ? "matched" : ""}`}
              onClick={() => handleFlip(index)}
            >
              <div className="card-inner">
                <div className="card-front">
                  <img
                    src={`/photos/${card.imageId}.jpg`}
                    alt="memory"
                    className="card-img"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const parent = e.target.parentElement;
                      if (parent && !parent.querySelector('.emoji-fallback')) {
                        const emoji = document.createElement('div');
                        emoji.className = 'emoji-fallback';
                        emoji.textContent = ['😍', '💕', '🥰', '💖', '✨', '🌹'][card.imageId - 1];
                        parent.appendChild(emoji);
                      }
                    }}
                  />
                </div>
                <div className="card-back">❤️</div>
              </div>
            </div>
          );
        })}
      </div>

      {gameOver && (
        <div className="overlay">
          <div className="overlay-content">
            <div className="modal-emoji">💝</div>
            <h2>You remembered every moment 💫</h2>
            <p className="modal-message">Just like I remember every reason I love you ❤️</p>
            <p className="modal-stats">Completed in {moves} moves!</p>
            <button className="restart-btn" onClick={initializeGame}>
              💕 Play Again
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        /* 🌸 Animations */
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes orbFloat1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(100px, -50px) scale(1.2); }
          66% { transform: translate(-50px, 80px) scale(0.9); }
        }
        @keyframes orbFloat2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-80px, 60px) scale(1.1); }
          66% { transform: translate(120px, -30px) scale(0.95); }
        }
        @keyframes orbFloat3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(60px, 90px) scale(1.15); }
          66% { transform: translate(-90px, -40px) scale(0.85); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pop {
          0% { transform: scale(0.8); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        @keyframes matchPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes textGradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes glow {
          0%, 100% { 
            text-shadow: 0 0 40px rgba(255, 255, 255, 1), 0 0 80px rgba(255, 182, 193, 0.8); 
          }
          50% { 
            text-shadow: 0 0 60px rgba(255, 255, 255, 1), 0 0 120px rgba(255, 182, 193, 1); 
          }
        }

        /* 🌸 General Layout */
        .memory-container {
          min-height: 100vh;
          width: 100vw;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: ${backgroundThemes[backgroundTheme]};
          background-size: 200% 200%;
          animation: gradientShift 8s ease infinite;
          font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
          padding: 20px;
          position: relative;
          overflow: hidden;
        }

        .memory-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 40% 20%, rgba(255, 182, 193, 0.25) 0%, transparent 50%);
          pointer-events: none;
          animation: shimmer 10s ease-in-out infinite;
          z-index: 1;
        }

        .memory-container::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
          pointer-events: none;
          animation: rotate 120s linear infinite;
          opacity: 0.4;
        }

        /* Floating Orbs */
        .floating-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
        }

        .orb1 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(255, 100, 150, 0.4), transparent);
          top: 20%;
          left: 10%;
          animation: orbFloat1 20s ease-in-out infinite;
        }

        .orb2 {
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(150, 100, 255, 0.3), transparent);
          bottom: 20%;
          right: 15%;
          animation: orbFloat2 25s ease-in-out infinite;
        }

        .orb3 {
          width: 350px;
          height: 350px;
          background: radial-gradient(circle, rgba(100, 200, 255, 0.35), transparent);
          top: 50%;
          left: 50%;
          animation: orbFloat3 30s ease-in-out infinite;
        }

        /* Controls */
        .controls {
          position: fixed;
          top: 25px;
          right: 25px;
          display: flex;
          gap: 12px;
          z-index: 1000;
          flex-wrap: wrap;
        }

        .control-btn {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1));
          border: 2px solid rgba(255, 255, 255, 0.4);
          border-radius: 22px;
          padding: 12px 20px;
          color: white;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          font-size: 0.95rem;
          font-weight: 700;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.4);
          border: none;
        }

        .control-btn:hover {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.2));
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.5);
        }

        /* Stats Display */
        .stats-display {
          position: fixed;
          top: 25px;
          left: 25px;
          display: flex;
          gap: 12px;
          z-index: 1000;
        }

        .stat-box {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1));
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          padding: 12px 20px;
          border-radius: 20px;
          color: white;
          font-weight: 700;
          border: 2px solid rgba(255, 255, 255, 0.4);
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.4);
          font-size: 0.95rem;
        }

        .stat-label {
          opacity: 0.9;
        }

        /* Title */
        .title {
          margin-bottom: 30px;
          font-size: 3rem;
          font-weight: 900;
          background: linear-gradient(45deg, #fff, #ffd1dc, #fff, #ffb6c1, #fff);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: pulse 2s ease-in-out infinite, glow 3s ease-in-out infinite, textGradient 5s ease infinite;
          letter-spacing: 6px;
          filter: drop-shadow(0 0 30px rgba(255, 255, 255, 0.9));
          text-transform: uppercase;
          z-index: 10;
          position: relative;
        }

        /* 🌸 Grid */
        .grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
          width: 100%;
          max-width: 500px;
          z-index: 10;
          position: relative;
          margin-bottom: 20px;
        }

        /* 🌸 Card */
        .card {
          perspective: 1000px;
          width: 100%;
          aspect-ratio: 1;
          cursor: pointer;
        }

        .card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          transform-style: preserve-3d;
        }

        .card.flipped .card-inner {
          transform: rotateY(180deg);
        }

        .card.matched .card-inner {
          animation: matchPulse 0.6s ease;
        }

        .card-front,
        .card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 20px;
          backface-visibility: hidden;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
          border: 3px solid rgba(255, 255, 255, 0.5);
        }

        .card-front {
          transform: rotateY(180deg);
          background: white;
        }

        .card-back {
          background: linear-gradient(135deg, rgba(255, 100, 150, 0.95), rgba(150, 100, 255, 0.95));
          backdrop-filter: blur(10px);
          color: white;
          font-size: 3rem;
          filter: drop-shadow(0 0 20px rgba(255, 23, 68, 0.6));
        }

        .card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .emoji-fallback {
          font-size: 4rem;
          color: #ff69b4;
        }

        .card:hover .card-inner {
          transform: scale(1.05);
        }

        .card.flipped:hover .card-inner {
          transform: rotateY(180deg) scale(1.05);
        }

        /* 🌸 Overlay */
        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(15px);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.6s ease forwards;
          flex-direction: column;
          padding: 20px;
          text-align: center;
          z-index: 2000;
        }

        .overlay-content {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(255, 182, 193, 0.95));
          padding: 50px 40px;
          border-radius: 35px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          animation: pop 0.6s ease forwards;
          border: 3px solid rgba(255, 255, 255, 0.8);
          max-width: 500px;
        }

        .modal-emoji {
          font-size: 5rem;
          margin-bottom: 20px;
          animation: pulse 1.5s ease-in-out infinite;
        }

        .overlay-content h2 {
          color: #d6336c;
          font-size: 2.5rem;
          margin-bottom: 15px;
          font-weight: 900;
        }

        .modal-message {
          font-size: 1.4rem;
          color: #333;
          margin-bottom: 15px;
          font-weight: 600;
          line-height: 1.6;
        }

        .modal-stats {
          font-size: 1.1rem;
          color: #666;
          margin-bottom: 25px;
          font-weight: 500;
        }

        .restart-btn {
          background: linear-gradient(135deg, #d6336c, #ff4569);
          color: white;
          border: none;
          padding: 15px 35px;
          border-radius: 25px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1.1rem;
          font-weight: 700;
          box-shadow: 0 8px 25px rgba(214, 51, 108, 0.4);
        }

        .restart-btn:hover {
          background: linear-gradient(135deg, #ff4569, #d6336c);
          transform: translateY(-3px);
          box-shadow: 0 12px 35px rgba(214, 51, 108, 0.6);
        }

        /* 🌸 Mobile */
        @media (max-width: 768px) {
          .title {
            font-size: 2rem;
            letter-spacing: 3px;
            margin-bottom: 20px;
          }

          .grid {
            gap: 10px;
            max-width: 350px;
          }

          .controls {
            top: 15px;
            right: 15px;
            gap: 8px;
          }

          .control-btn {
            padding: 10px 16px;
            font-size: 0.85rem;
          }

          .stats-display {
            top: 15px;
            left: 15px;
            gap: 8px;
          }

          .stat-box {
            padding: 10px 15px;
            font-size: 0.85rem;
          }

          .card-back {
            font-size: 2rem;
          }

          .overlay-content {
            padding: 35px 25px;
            margin: 20px;
          }

          .overlay-content h2 {
            font-size: 1.8rem;
          }

          .modal-message {
            font-size: 1.1rem;
          }

          .modal-emoji {
            font-size: 3.5rem;
          }

          .restart-btn {
            padding: 12px 25px;
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
}