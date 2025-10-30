"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * PhotoPuzzle
 * - gridSize: change to 3,4 etc.
 * - images served from public/photos/{imageId}.jpg
 *
 * Behavior:
 * - Drag from Basket -> drop on Play slot
 * - Only accepted if piece.correctPosition === slotIndex
 * - Can drag from Play slot back to Basket
 * - Hint, audio, theme, levels supported
 */

export default function PhotoPuzzle() {
  const [imageId, setImageId] = useState(1);
  const [gridSize, setGridSize] = useState(3); // change to 4 for 4x4
  const [basket, setBasket] = useState([]); // pieces available to place
  const [playArea, setPlayArea] = useState([]); // slots: null or piece
  const [isPlaying, setIsPlaying] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [backgroundTheme, setBackgroundTheme] = useState(0);
  const audioRef = useRef(null);
  const [wrongSlot, setWrongSlot] = useState(null); // used to show quick red flash when dropped wrong

  const totalPhotos = 8;
  const loveMessages = [
    "Your smile is my favorite view 💫",
    "Piece by piece, you made my life beautiful 🌹",
    "Every moment with you is a treasure 💎",
    "You complete the puzzle of my heart 💗",
    "In you, I found my missing piece ✨",
    "Together, we create the perfect picture 🎨",
    "You're the masterpiece of my life 🖼️",
    "With you, everything falls into place 💕",
  ];

  const backgroundThemes = [
    'radial-gradient(circle at 20% 50%, rgba(120, 0, 150, 0.3), transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 0, 100, 0.3), transparent 50%), linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    'radial-gradient(circle at 30% 70%, rgba(255, 100, 150, 0.4), transparent 60%), radial-gradient(circle at 70% 30%, rgba(100, 200, 255, 0.3), transparent 50%), linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'radial-gradient(circle at 50% 50%, rgba(255, 200, 100, 0.3), transparent 70%), linear-gradient(135deg, #ffecd2 0%, #fcb69f 50%, #ff9a9e 100%)',
  ];

  // build pieces (ordered), and shuffle basket
  const initializePuzzle = (gs = gridSize, img = imageId) => {
    const totalPieces = gs * gs;
    const pieces = Array.from({ length: totalPieces }, (_, i) => {
      const row = Math.floor(i / gs);
      const col = i % gs;
      return { id: i, correctPosition: i, row, col };
    });

    // shuffle for basket
    const shuffled = [...pieces].sort(() => Math.random() - 0.5);

    setBasket(shuffled);
    setPlayArea(Array(totalPieces).fill(null));
    setWrongSlot(null);
    setGameOver(false);
  };

  useEffect(() => {
    initializePuzzle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gridSize, imageId]);

  // DRAG helpers: we use dataTransfer with JSON string
  const onDragStart = (e, piece, source) => {
    // source: 'basket' or 'play'
    const payload = JSON.stringify({ pieceId: piece.id, source });
    e.dataTransfer.setData("application/x-piece", payload);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOverSlot = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const onDropOnSlot = (e, slotIndex) => {
    e.preventDefault();
    const raw = e.dataTransfer.getData("application/x-piece");
    if (!raw) return;
    let parsed = null;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      return;
    }
    const { pieceId, source } = parsed;
    // find piece data (pieceId refers to correctPosition)
    // find piece either in basket or playArea
    const pieceInBasket = basket.find((p) => p.id === pieceId);
    const pieceInPlay = playArea.find((p) => p && p.id === pieceId);
    const piece = pieceInBasket || pieceInPlay;
    if (!piece) return;

    // If slot already filled, reject
    if (playArea[slotIndex] !== null) {
      // If dragging from play area to same slot, ignore
      return;
    }

    // Accept only if correctPosition matches slotIndex
    if (piece.correctPosition !== slotIndex) {
      // quick red flash on wrong slot and return piece to basket
      setWrongSlot(slotIndex);
      setTimeout(() => setWrongSlot(null), 600);
      return;
    }

    // Place the piece into playArea[slotIndex]
    const newPlay = [...playArea];
    newPlay[slotIndex] = piece;
    setPlayArea(newPlay);

    // remove from basket if it came from basket
    if (source === "basket") {
      setBasket((prev) => prev.filter((p) => p.id !== pieceId));
    } else if (source === "play") {
      // remove from its previous slot
      const prevIndex = playArea.findIndex((p) => p && p.id === pieceId);
      if (prevIndex !== -1) {
        const copy = [...newPlay];
        copy[prevIndex] = null;
        copy[slotIndex] = piece; // already placed above, but ensure prev deleted
        setPlayArea(copy);
      }
    }

    // check completion
    const isComplete = newPlay.every((p, idx) => p && p.correctPosition === idx);
    if (isComplete) {
      setTimeout(() => setGameOver(true), 350);
    }
  };

  const onDropOnBasket = (e) => {
    e.preventDefault();
    const raw = e.dataTransfer.getData("application/x-piece");
    if (!raw) return;
    let parsed = null;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      return;
    }
    const { pieceId, source } = parsed;
    // If piece came from play area, remove it from playArea and add to basket (if not present)
    if (source === "play") {
      const idx = playArea.findIndex((p) => p && p.id === pieceId);
      if (idx !== -1) {
        const copy = [...playArea];
        const piece = copy[idx];
        copy[idx] = null;
        setPlayArea(copy);
        setBasket((prev) => {
          // prevent duplicates
          if (prev.find((p) => p.id === pieceId)) return prev;
          return [...prev, piece];
        });
      }
    }
    // If source is basket, ignore (already there)
  };

  const shuffleBasket = () => {
    // combine playArea pieces back to basket, then shuffle
    const placedPieces = playArea.filter(Boolean);
    const combined = [...basket, ...placedPieces];
    const unique = Array.from(new Map(combined.map((p) => [p.id, p])).values());
    const shuffled = [...unique].sort(() => Math.random() - 0.5);
    setBasket(shuffled);
    setPlayArea(Array(gridSize * gridSize).fill(null));
    setWrongSlot(null);
    setGameOver(false);
  };

  const nextLevel = () => {
    setImageId((prev) => (prev < totalPhotos ? prev + 1 : 1));
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying((v) => !v);
  };

  const changeTheme = () =>
    setBackgroundTheme((t) => (t + 1) % backgroundThemes.length);

  // helper for backgroundPosition CSS for a piece
  const bgPositionFor = (piece) => {
    // piece.row and piece.col are based on correctPosition
    const x = (piece.col * 100) / (gridSize - 1);
    const y = (piece.row * 100) / (gridSize - 1);
    return `${x}% ${y}%`;
  };

  // styles for dynamic tile sizes
  const tileGap = 6;
  const playGridSizePx = Math.min(500, Math.max(280, gridSize * 100)); // adapt
  const basketCols = Math.min(4, gridSize);

  return (
    <>
      <style jsx>{`
        /* (same animation + theme CSS condensed) */
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes sparkleFloat {
          0% { opacity: 0; transform: translateY(0) scale(0); }
          50% { opacity: 1; }
          100% { opacity: 0; transform: translateY(-100px) scale(1.5); }
        }
        .puzzle-container {
          min-height: 100vh;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          background: ${backgroundThemes[backgroundTheme]};
          background-size: 200% 200%;
          animation: gradientShift 10s ease infinite;
          padding: 20px;
          position: relative;
          overflow-x: hidden;
          font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
        }

        .controls {
          position: fixed;
          top: 20px;
          right: 20px;
          display: flex;
          gap: 8px;
          z-index: 1200;
        }

        .control-btn {
          background: linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.12));
          border: none;
          padding: 8px 12px;
          border-radius: 12px;
          color: #fff;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 6px 18px rgba(0,0,0,0.15);
        }

        .stats-display {
          position: fixed;
          top: 20px;
          left: 20px;
          z-index: 1200;
          display: flex;
          gap: 10px;
        }
        .stat-box {
          background: linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.12));
          padding: 8px 12px;
          border-radius: 12px;
          color: #fff;
          font-weight: 700;
        }

        .title {
          margin-top: 28px;
          font-size: 28px;
          font-weight: 900;
          color: white;
          text-shadow: 0 6px 18px rgba(0,0,0,0.25);
        }

        .game-wrapper {
          display: flex;
          gap: 28px;
          width: 100%;
          max-width: 1100px;
          margin-top: 26px;
          align-items: flex-start;
          justify-content: center;
          z-index: 10;
        }

        .play-section, .basket-section {
          background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03));
          padding: 14px;
          border-radius: 16px;
          box-shadow: 0 18px 50px rgba(0,0,0,0.25);
        }

        .section-title {
          color: white;
          font-weight: 800;
          margin-bottom: 10px;
        }

        .play-grid {
          display: grid;
          gap: ${tileGap}px;
          border-radius: 12px;
          width: ${playGridSizePx}px;
          height: ${playGridSizePx}px;
          padding: ${tileGap}px;
          background: rgba(255,255,255,0.03);
        }

        .play-slot {
          border-radius: 10px;
          overflow: hidden;
          background: rgba(255,255,255,0.04);
          display:flex;
          align-items:center;
          justify-content:center;
          transition: box-shadow .18s ease, transform .12s ease;
        }

        .play-slot.empty {
          border: 2px dashed rgba(255,255,255,0.12);
        }

        .play-slot.wrong {
          animation: shake .45s ease;
          border-color: rgba(255,80,80,0.9);
          box-shadow: 0 8px 30px rgba(255,80,80,0.12);
        }

        @keyframes shake {
          0% { transform: translateX(0) }
          25% { transform: translateX(-8px) }
          50% { transform: translateX(8px) }
          75% { transform: translateX(-6px) }
          100% { transform: translateX(0) }
        }

        .piece-tile {
          width: 100%;
          height: 100%;
          background-size: ${gridSize * 100}% ${gridSize * 100}%;
          background-repeat: no-repeat;
          border-radius: 8px;
          cursor: grab;
          box-shadow: 0 6px 18px rgba(0,0,0,0.24);
        }

        .basket-grid {
          display: grid;
          grid-template-columns: repeat(${basketCols}, 1fr);
          gap: 10px;
          min-width: 220px;
          max-width: 360px;
          padding: 10px;
        }

        .basket-piece {
          aspect-ratio: 1;
          border-radius: 8px;
          background-size: ${gridSize * 100}% ${gridSize * 100}%;
          background-repeat: no-repeat;
          cursor: grab;
          box-shadow: 0 8px 26px rgba(0,0,0,0.28);
          transition: transform .12s ease;
        }
        .basket-piece:active { transform: scale(0.98) }

        .hint-preview {
          position: fixed;
          right: 22px;
          top: 90px;
          background: rgba(255,255,255,0.98);
          padding: 12px;
          border-radius: 12px;
          z-index: 1300;
          box-shadow: 0 18px 40px rgba(0,0,0,0.25);
        }
        .hint-preview img { width: 140px; height: 140px; object-fit: cover; border-radius: 8px; display:block }

        /* Completion overlay */
        .overlay {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.8);
          z-index: 2000;
        }
        .overlay-content {
          background: linear-gradient(135deg, rgba(255,255,255,0.98), rgba(255,220,230,0.95));
          padding: 36px;
          border-radius: 20px;
          text-align: center;
          max-width: 420px;
        }
        .overlay-emoji { font-size: 48px; margin-bottom: 8px }
        .overlay h2 { margin: 8px 0 14px 0; color: #d6336c }

        .sparkles { position: absolute; inset: 0; pointer-events: none; }

        @media (max-width: 1024px) {
          .game-wrapper { flex-direction: column; gap: 18px; align-items:center }
          .basket-grid { grid-template-columns: repeat(3, 1fr) }
          .hint-preview { right: 12px; top: 120px; }
        }
        @media (max-width: 640px) {
          .play-grid { width: min(84vw, 360px); height: min(84vw, 360px) }
          .basket-grid { max-width: 320px }
          .title { font-size: 20px }
        }
      `}</style>

      <div className="puzzle-container">
        <audio ref={audioRef} src={`/bg-music.mp3`} loop preload="auto" />
        {/* Controls */}
        <div className="controls" role="toolbar" aria-label="controls">
          <button className="control-btn" onClick={toggleMusic}>
            {isPlaying ? "🔇" : "🎵"}
          </button>
          <button className="control-btn" onClick={() => setShowHint((s) => !s)}>
            💡
          </button>
          {/* <button
            className="control-btn"
            onClick={() => {
              setGridSize((g) => (g === 3 ? 4 : 3)); // quick toggle example
              // reinitialize after changing grid size
              setTimeout(() => initializePuzzle(), 80);
            }}
            title="Toggle grid 3x3 / 4x4"
          >
            🧩 {gridSize}x{gridSize}
          </button> */}
          <button
            className="control-btn"
            onClick={() => {
              shuffleBasket();
            }}
          >
            🔄 Reset
          </button>
          <button className="control-btn" onClick={changeTheme}>
            🎨
          </button>
        </div>

        <div className="stats-display" aria-hidden>
          <div className="stat-box">Level {imageId}/{totalPhotos}</div>
          <div className="stat-box">Placed {playArea.filter(Boolean).length}/{gridSize * gridSize}</div>
        </div>

        <h1 className="title">💗 Photo Puzzle 💗</h1>

        {/* Intro overlay */}
        {showIntro && (
          <div
            className="overlay"
            onClick={() => setShowIntro(false)}
            role="dialog"
            aria-label="intro"
          >
            <div className="overlay-content" style={{ maxWidth: 520 }}>
              <div className="overlay-emoji">💗</div>
              <h2>Drag & Drop — Piece the memory</h2>
              <p style={{ marginBottom: 14 }}>Drag pieces from the basket into their correct spot. Only the right piece fits each slot.</p>
              <button
                className="control-btn"
                onClick={() => {
                  setShowIntro(false);
                }}
              >
                Start ✨
              </button>
            </div>
          </div>
        )}

        {/* hint preview */}
        {showHint && (
          <div className="hint-preview" aria-hidden>
            <img src={`/photos/${imageId}.jpg`} alt="Hint preview" />
            <div style={{ textAlign: "center", marginTop: 8, fontWeight: 700, color: "#d6336c" }}>Hint</div>
          </div>
        )}

        <div className="game-wrapper">
          {/* Play area */}
          <div className="play-section" aria-label="play area">
            <div className="section-title">🎯 Build Here</div>

            <div
              className="play-grid"
              style={{
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
              }}
            >
              {playArea.map((slotPiece, slotIndex) => {
                const isEmpty = slotPiece === null;
                const showWrong = wrongSlot === slotIndex;
                return (
                  <div
                    key={slotIndex}
                    className={`play-slot ${isEmpty ? "empty" : "filled"} ${showWrong ? "wrong" : ""}`}
                    onDragOver={onDragOverSlot}
                    onDrop={(e) => onDropOnSlot(e, slotIndex)}
                    role="button"
                    tabIndex={0}
                  >
                    {!isEmpty && (
                      <div
                        className="piece-tile"
                        draggable
                        onDragStart={(e) => onDragStart(e, slotPiece, "play")}
                        style={{
                          backgroundImage: `url(/photos/${imageId}.jpg)`,
                          backgroundPosition: bgPositionFor(slotPiece),
                          backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
                        }}
                        title={`Piece ${slotPiece.correctPosition}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Basket */}
          <div className="basket-section" aria-label="basket">
            <div className="section-title">🧺 Pieces</div>
            <div
              className="basket-grid"
              onDragOver={(e) => {
                e.preventDefault();
              }}
              onDrop={onDropOnBasket}
            >
              {basket.map((piece) => (
                <div
                  key={piece.id}
                  className="basket-piece"
                  draggable
                  onDragStart={(e) => onDragStart(e, piece, "basket")}
                  style={{
                    backgroundImage: `url(/photos/${imageId}.jpg)`,
                    backgroundPosition: bgPositionFor(piece),
                    backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
                  }}
                  title={`Drag piece ${piece.correctPosition}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* completion overlay */}
        {gameOver && (
          <div className="overlay" role="dialog">
            <div className="overlay-content">
              <div className="overlay-emoji">🎉</div>
              <h2>Puzzle Complete!</h2>
              <p style={{ marginBottom: 10 }}>{loveMessages[(imageId - 1) % loveMessages.length]}</p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                <button
                  className="control-btn"
                  onClick={() => {
                    initializePuzzle();
                  }}
                >
                  🔄 Play Again
                </button>
                <button
                  className="control-btn"
                  onClick={() => {
                    nextLevel();
                  }}
                >
                  💕 Next Level
                </button>
              </div>
            </div>

            <div className="sparkles" aria-hidden>
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    fontSize: 16 + Math.floor(Math.random() * 12),
                    opacity: Math.random() * 0.9 + 0.2,
                    transform: `translateY(0)`,
                    transition: "none",
                  }}
                >
                  ✨
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
