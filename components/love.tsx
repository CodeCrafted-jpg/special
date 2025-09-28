'use client'; 

import { redirect } from 'next/dist/server/api-utils';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react'; 

// Defining types for clarity
interface Heart { id: number, x: number, delay: number, duration: number }
interface Sparkle { id: number, x: number, y: number, delay: number }
interface FloatingWord { id: number, word: string, x: number, delay: number, duration: number, color: string }
interface BurstHeart { id: number, x: number, y: number }
interface MouseTrail { id: number, x: number, y: number }
interface Particle { id: number, x: number, y: number, vx: number, vy: number, color: string }

const App = () => { 
    // State copied from user's original component
    const [hearts, setHearts] = useState<Heart[]>([]); 
    const [sparkles, setSparkles] = useState<Sparkle[]>([]); 
    const [floatingWords, setFloatingWords] = useState<FloatingWord[]>([]); 
    const [burstHearts, setBurstHearts] = useState<BurstHeart[]>([]); 
    const [mouseTrail, setMouseTrail] = useState<MouseTrail[]>([]); 
    const [currentMessage, setCurrentMessage] = useState(0); 
    const [showFireworks, setShowFireworks] = useState(false); 
    const [clickCount, setClickCount] = useState(0); 
    const [particles, setParticles] = useState<Particle[]>([]); 
    const [textSize, setTextSize] = useState(5); 
    const [backgroundTheme, setBackgroundTheme] = useState(0); 
    const [shakeScreen, setShakeScreen] = useState(false); 
    const router=useRouter()

    // NEW: State and Ref for Song Player
    const [showSongModal, setShowSongModal] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null); 
    
    // Original data arrays
    const words = ['Love', 'Forever', 'Always', 'Beautiful', 'Amazing', 'Special', 'Darling', 'Sweetheart', 'Angel', 'Treasure']; 
    const loveMessages = [ 
        "You make my heart skip a beat!", 
        "Every moment with you is magic ✨", 
        "You are my sunshine in the darkest days ☀️", 
        "My love for you grows stronger each day 💕", 
        "You complete me in every way possible 💫", 
        "Together we create our own fairy tale 🏰", 
        "You are my happily ever after 👑" 
    ]; 

    const backgroundThemes = [ 
        'linear-gradient(45deg, #ff4d6d, #ff758f, #ff99ac, #ff4d6d)', 
  'linear-gradient(45deg, #667eea, #764ba2, #f093fb, #f5576c)', 
  'linear-gradient(45deg, #ffecd2, #fcb69f, #ff9a9e, #fad0c4)', 
  'linear-gradient(45deg, #a8edea, #fed6e3, #ffeaa7, #fab1a0)', 
  'linear-gradient(45deg, #d299c2, #fef9d7, #daa4de, #f093fb)', 

  // new ones
  'linear-gradient(45deg, #ff9a9e, #fad0c4, #fbc2eb, #a6c1ee)', 
  'linear-gradient(45deg, #84fab0, #8fd3f4, #a1c4fd, #c2e9fb)', 
  'linear-gradient(45deg, #ffdde1, #ee9ca7, #ffdde1, #ff9a9e)', 
  'linear-gradient(45deg, #ff6a00, #ee0979, #ff6a00, #ff512f)', 
  'linear-gradient(45deg, #36d1dc, #5b86e5, #6a11cb, #2575fc)', 
  'linear-gradient(45deg, #fdfbfb, #ebedee, #d7d2cc, #304352)', 
  'linear-gradient(45deg, #fffc00, #ffd200, #ff512f, #dd2476)', 
  'linear-gradient(45deg, #43cea2, #185a9d, #2bc0e4, #eaecc6)', 
  'linear-gradient(45deg, #30cfd0, #330867, #6a11cb, #2575fc)', 
  'linear-gradient(45deg, #f7971e, #ffd200, #ff5858, #f09819)'
    ]; 

    // Helper to control the song modal
    const openSongWindow = () => {
        if (audioRef.current) {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    setShowSongModal(true);
                }).catch(error => {
                    console.error("Autoplay prevented:", error);
                    // Inform user without using alert()
                    const instructionDiv = document.querySelector('.instructions');
                    if (instructionDiv) {
                        instructionDiv.textContent = "🔊 Please click 'Play Our Song' again to start the music!";
                    }
                });
            }
        }
    };

    const closeSongWindow = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0; // Rewind
        }
        setShowSongModal(false);
        // Restore instructions text
        const instructionDiv = document.querySelector('.instructions');
        if (instructionDiv) {
             instructionDiv.textContent = "💡 Click ❤️ for bursts • Double-click anywhere for explosions • Move mouse for trails | 🎯 Special effects at 5, 10, 15 clicks!";
        }
    };

    // Original useEffect for background animations
    useEffect(() => { 
        // Hearts 
        const heartInterval = setInterval(() => { 
            const newHeart = { 
                id: Date.now() + Math.random(), 
                x: Math.random() * 100, 
                delay: Math.random() * 2, 
                duration: Math.random() * 3 + 4 
            }; 
            setHearts(prev => [...prev, newHeart]); 
            setTimeout(() => setHearts(prev => prev.filter(h => h.id !== newHeart.id)), 8000); 
        }, 800); 

        // Sparkles 
        const sparkleInterval = setInterval(() => { 
            const newSparkle = { 
                id: Date.now() + Math.random(), 
                x: Math.random() * 100, 
                y: Math.random() * 100, 
                delay: Math.random() * 2 
            }; 
            setSparkles(prev => [...prev, newSparkle]); 
            setTimeout(() => setSparkles(prev => prev.filter(s => s.id !== newSparkle.id)), 2000); 
        }, 300); 

        // Floating words 
        const wordInterval = setInterval(() => { 
            const newWord = { 
                id: Date.now() + Math.random(), 
                word: words[Math.floor(Math.random() * words.length)], 
                x: Math.random() * 80, 
                delay: Math.random() * 2, 
                duration: Math.random() * 3 + 6, 
                color: `hsl(${Math.random() * 60 + 300}, 70%, 80%)` 
            }; 
            setFloatingWords(prev => [...prev, newWord]); 
            setTimeout(() => setFloatingWords(prev => prev.filter(w => w.id !== newWord.id)), 9000); 
        }, 2000); 

        return () => { 
            clearInterval(heartInterval); 
            clearInterval(sparkleInterval); 
            clearInterval(wordInterval); 
        }; 
    }, []); 

    // Mouse trail effect 
    const handleMouseMove = (e: React.MouseEvent) => { 
        const newTrail: MouseTrail = { 
            id: Date.now(), 
            x: e.clientX, 
            y: e.clientY 
        }; 
        setMouseTrail(prev => [...prev.slice(-20), newTrail]); 
        setTimeout(() => { 
            setMouseTrail(prev => prev.filter(t => t.id !== newTrail.id)); 
        }, 1000); 
    }; 

    const createHeartBurst = () => { 
        const burstArray: BurstHeart[] = []; 
        for (let i = 0; i < 15; i++) { 
            const angle = (i / 15) * Math.PI * 2; 
            const distance = 200; 
            burstArray.push({ 
                id: Date.now() + i, 
                x: Math.cos(angle) * distance, 
                y: Math.sin(angle) * distance 
            }); 
        } 
        setBurstHearts(burstArray); 
        setTimeout(() => setBurstHearts([]), 2000); 
        
        setClickCount(prev => prev + 1); 
        
        // Special effects based on click count 
        // Note: The logic in the original file had special effects at 4, 9, 14. 
        // We'll adjust them to be simpler for the user to hit: 5, 10, 15
        if (clickCount === 4) { // Will trigger on 5th click
            triggerFireworks(); 
        } else if (clickCount === 9) { // Will trigger on 10th click
            shakeScreenEffect(); 
        } else if (clickCount === 14) { // Will trigger on 15th click
            changeBackgroundTheme(); 
        } 
    }; 

    const triggerFireworks = () => { 
        setShowFireworks(true); 
        const newParticles: Particle[] = []; 
        
        for (let i = 0; i < 50; i++) { 
            newParticles.push({ 
                id: Date.now() + i, 
                x: Math.random() * window.innerWidth, 
                y: window.innerHeight, 
                vx: (Math.random() - 0.5) * 10, 
                vy: Math.random() * -15 - 5, 
                color: `hsl(${Math.random() * 360}, 70%, 60%)` 
            }); 
        } 
        
        setParticles(newParticles); 
        setTimeout(() => { 
            setShowFireworks(false); 
            setParticles([]); 
        }, 3000); 
    }; 

    const shakeScreenEffect = () => { 
        setShakeScreen(true); 
        setTimeout(() => setShakeScreen(false), 1000); 
    }; 

    const changeBackgroundTheme = () => { 
        setBackgroundTheme(prev => (prev + 1) % backgroundThemes.length); 
    }; 

    const cycleMessage = () => { 
        setCurrentMessage(prev => (prev + 1) % loveMessages.length); 
    }; 

    const growText = () => { 
        setTextSize(prev => prev === 8 ? 5 : prev + 0.5); 
    }; 

    const handleDoubleClick = (e: React.MouseEvent) => { 
        // Create explosion of hearts at click position 
        const rect = e.currentTarget.getBoundingClientRect(); 
        const clickX = e.clientX - rect.left; 
        const clickY = e.clientY - rect.top; 
        
        const explosionHearts: BurstHeart[] = []; 
        for (let i = 0; i < 8; i++) { 
            const angle = (i / 8) * Math.PI * 2; 
            const distance = 100; 
            explosionHearts.push({ 
                id: Date.now() + Math.random(), 
                x: Math.cos(angle) * distance + clickX, 
                y: Math.sin(angle) * distance + clickY 
            }); 
        } 
        setBurstHearts(prev => [...prev, ...explosionHearts]); 
        setTimeout(() => { 
            setBurstHearts(prev => prev.filter(h => !explosionHearts.find(eh => eh.id === h.id))); 
        }, 2000); 
    }; 

    return ( 
        <> 
            {/* Global Styles */}
            <style global jsx>{` 
                html, body, #__next { 
                    margin: 0; 
                    padding: 0; 
                    height: 100%; 
                    overflow: hidden; /* Hide scrollbars for the animations */
                } 
                * { 
                    cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><text y="16" font-size="16">❤️</text></svg>'), auto; 
                } 
                .AppContainer {
                    /* Ensures the main container fills the viewport */
                    height: 100vh;
                    width: 100vw;
                }
            `}</style> 

            {/* Component-specific Animation Styles */}
            <style jsx>{` 
                @keyframes gradientShift { 
                    0%, 100% { background-position: 0% 50%; } 
                    50% { background-position: 100% 50%; } 
                } 
                @keyframes pulse { 
                    0%, 100% { transform: scale(1); } 
                    50% { transform: scale(1.05); } 
                } 
                @keyframes rainbow { 
                    0% { filter: hue-rotate(0deg); } 
                    100% { filter: hue-rotate(360deg); } 
                } 
                @keyframes float { 
                    0% { transform: translateY(100vh) rotate(0); opacity: 0; } 
                    10% { opacity: 1; } 
                    90% { opacity: 1; } 
                    100% { transform: translateY(-100px) rotate(360deg); opacity: 0; } 
                } 
                @keyframes sparkle { 
                    0%, 100% { transform: scale(0) rotate(0); opacity: 0; } 
                    50% { transform: scale(1) rotate(180deg); opacity: 1; } 
                } 
                @keyframes wordFloat { 
                    0% { transform: translateY(100vh) translateX(0); opacity: 0; } 
                    10%, 90% { opacity: 1; } 
                    100% { transform: translateY(-100px) translateX(50px); opacity: 0; } 
                } 
                @keyframes burstHeart { 
                    0% { transform: translate(-50%, -50%) scale(0); opacity: 1; } 
                    100% { transform: translate(calc(-50% + var(--x)), calc(-50% + var(--y))) scale(0.5); opacity: 0; } 
                } 
                @keyframes heartbeat { 
                    0%, 100% { transform: scale(1); } 
                    50% { transform: scale(1.3); } 
                } 
                @keyframes shake { 
                    0%, 100% { transform: translateX(0); } 
                    25% { transform: translateX(-10px) rotate(-2deg); } 
                    75% { transform: translateX(10px) rotate(2deg); } 
                } 
                @keyframes mouseTrail { 
                    0% { transform: scale(1); opacity: 1; } 
                    100% { transform: scale(0); opacity: 0; } 
                } 
                @keyframes firework { 
                    0% { transform: translateY(0) scale(1); opacity: 1; } 
                    100% { transform: translateY(var(--vy)) translateX(var(--vx)) scale(0); opacity: 0; } 
                } 
                @keyframes bounce { 
                    0%, 20%, 50%, 80%, 100% { transform: translateY(0); } 
                    40% { transform: translateY(-20px); } 
                    60% { transform: translateY(-10px); } 
                } 
                @keyframes glow { 
                    0%, 100% { text-shadow: 0 0 30px rgba(255, 255, 255, 0.9), 0 0 60px #ff4d6d; } 
                    50% { text-shadow: 0 0 50px rgba(255, 255, 255, 1), 0 0 80px #ff4d6d, 0 0 100px #ff758f; } 
                } 

                .container { 
                    min-height: 100vh; 
                    width: 100vw; 
                    background: ${backgroundThemes[backgroundTheme]}; 
                    background-size: 400% 400%; 
                    animation: gradientShift 6s ease infinite ${showFireworks ? ', rainbow 2s linear infinite' : ''} ${shakeScreen ? ', shake 0.1s linear infinite' : ''}; 
                    display: flex; 
                    justify-content: center; 
                    align-items: center; 
                    overflow: hidden; 
                    font-family: 'Arial', sans-serif; 
                    position: relative; 
                } 
                
                .content { 
                    text-align: center; 
                    z-index: 10; 
                    animation: ${clickCount > 10 ? 'bounce 2s ease-in-out infinite' : 'none'}; 
                } 
                
                .love-text { 
                    font-size: ${textSize}rem; 
                    font-weight: bold; 
                    color: white; 
                    animation: pulse 2s ease-in-out infinite, glow 3s ease-in-out infinite; 
                    margin-bottom: 1.5rem; 
                    letter-spacing: 4px; 
                    transition: font-size 0.5s ease; 
                } 
                
                .message-box { 
                    background: rgba(255, 255, 255, 0.25); 
                    backdrop-filter: blur(15px); 
                    border-radius: 25px; 
                    padding: 2.5rem; 
                    border: 3px solid rgba(255, 255, 255, 0.4); 
                    transition: all 0.3s ease; 
                    transform-style: preserve-3d; 
                } 
                
                .message-box:hover { 
                    transform: rotateY(5deg) rotateX(5deg); 
                    box-shadow: 0 20px 40px rgba(0,0,0,0.2); 
                } 
                
                .sub-text { 
                    color: white; 
                    font-size: 1.3rem; 
                    font-style: italic; 
                    margin-top: 0.8rem; 
                    transition: all 0.3s ease; 
                } 
                
                .interactive-heart { 
                    font-size: 4rem; 
                    color: #ff1744; 
                    cursor: pointer; 
                    animation: heartbeat 1.2s ease-in-out infinite; 
                    transition: all 0.3s ease; 
                    display: inline-block; 
                } 
                
                .interactive-heart:hover { 
                    transform: scale(1.4) rotate(15deg); 
                    filter: drop-shadow(0 0 30px #ff1744) saturate(1.5); 
                } 
                
                .controls { 
                    position: fixed; 
                    top: 20px; 
                    right: 20px; 
                    display: flex; 
                    flex-wrap: wrap; /* Added for responsiveness */
                    gap: 10px; 
                    z-index: 1000; 
                } 
                
                .control-btn { 
                    background: rgba(255, 255, 255, 0.2); 
                    border: 2px solid rgba(255, 255, 255, 0.3); 
                    border-radius: 15px; 
                    padding: 10px 15px; 
                    color: white; 
                    cursor: pointer; 
                    transition: all 0.3s ease; 
                    backdrop-filter: blur(10px); 
                    font-size: 0.9rem; 
                    font-weight: bold;
                } 
                
                .control-btn:hover { 
                    background: rgba(255, 255, 255, 0.3); 
                    transform: translateY(-2px); 
                } 
                
                .click-counter { 
                    position: fixed; 
                    top: 20px; 
                    left: 20px; 
                    background: rgba(255, 255, 255, 0.2); 
                    backdrop-filter: blur(10px); 
                    padding: 15px 20px; 
                    border-radius: 20px; 
                    color: white; 
                    font-weight: bold; 
                    border: 2px solid rgba(255, 255, 255, 0.3); 
                    text-shadow: 0 0 5px rgba(0,0,0,0.5);
                    z-index: 1000;
                } 

                .heart { 
                    position: absolute; 
                    width: 20px; 
                    height: 20px; 
                    background: #ff1744; 
                    border-radius: 50%; 
                    animation: float var(--duration) ease-in-out forwards; 
                    animation-delay: var(--delay); 
                    left: var(--x); 
                } 
                .heart::before, 
                .heart::after { 
                    content: ''; 
                    width: 20px; 
                    height: 20px; 
                    position: absolute; 
                    background: #ff1744; 
                    border-radius: 50%; 
                } 
                .heart::before { top: -10px; left: 0; } 
                .heart::after { top: 0; left: -10px; } 
                
                .sparkle { 
                    position: absolute; 
                    width: 6px; 
                    height: 6px; 
                    background: white; 
                    border-radius: 50%; 
                    animation: sparkle 2s linear forwards; 
                    animation-delay: var(--delay); 
                    left: var(--x); 
                    top: var(--y); 
                    box-shadow: 0 0 10px white; 
                } 
                
                .floating-word { 
                    position: absolute; 
                    font-size: 1.8rem; 
                    font-weight: bold; 
                    animation: wordFloat var(--duration) linear forwards; 
                    animation-delay: var(--delay); 
                    left: var(--x); 
                    color: var(--color); 
                    text-shadow: 0 0 10px rgba(255,255,255,0.5); 
                } 
                
                .burst-heart { 
                    position: fixed; 
                    left: 50%; 
                    top: 50%; 
                    font-size: 2.5rem; 
                    animation: burstHeart 2s ease-out forwards; 
                    color: #ff1744; 
                    pointer-events: none; 
                    filter: drop-shadow(0 0 10px #ff1744); 
                } 
                
                .mouse-trail { 
                    position: fixed; 
                    width: 15px; 
                    height: 15px; 
                    background: radial-gradient(circle, #ff1744, transparent); 
                    border-radius: 50%; 
                    pointer-events: none; 
                    animation: mouseTrail 1s linear forwards; 
                    z-index: 1; 
                } 
                
                .firework-particle { 
                    position: fixed; 
                    width: 8px; 
                    height: 8px; 
                    border-radius: 50%; 
                    background: var(--color); 
                    animation: firework 3s ease-out forwards; 
                    box-shadow: 0 0 15px var(--color); 
                } 
                
                .instructions { 
                    position: fixed; 
                    bottom: 20px; 
                    left: 50%; 
                    transform: translateX(-50%); 
                    background: rgba(0,0,0,0.3); 
                    color: white; 
                    padding: 15px 25px; 
                    border-radius: 20px; 
                    backdrop-filter: blur(10px); 
                    font-size: 0.9rem; 
                    text-align: center; 
                    border: 1px solid rgba(255,255,255,0.2); 
                    max-width: 90%;
                } 

                @media (max-width: 768px) { 
                    .love-text { font-size: 3rem; } 
                    .sub-text { font-size: 1rem; } 
                    .controls {  
                        top: 10px;  
                        right: 10px;  
                        flex-direction: row;  
                        flex-wrap: wrap;
                        gap: 8px;
                    } 
                    .control-btn {
                        padding: 8px 12px;
                        font-size: 0.8rem;
                    }
                    .click-counter { 
                        top: 10px; 
                        left: 10px; 
                        padding: 10px 15px; 
                        font-size: 0.8rem;
                    } 
                    .instructions { 
                        bottom: 10px; 
                        left: 50%; 
                        transform: translateX(-50%); 
                        font-size: 0.75rem; 
                    } 
                } 
            `}</style> 

            <div className="container AppContainer" onMouseMove={handleMouseMove} onDoubleClick={handleDoubleClick}> 
                {/* Hidden Audio Element */}
                <audio ref={audioRef} src="perfect.mp3" preload="auto" />

                {/* Controls */} 
                <div className="controls"> 
                    <button className="control-btn" onClick={cycleMessage}>💬 Message</button> 
                    <button className="control-btn" onClick={growText}>🔍 Grow Text</button> 
                    <button className="control-btn" onClick={changeBackgroundTheme}>🎨 Theme</button> 
                    <button className="control-btn" onClick={triggerFireworks}>🎆 Fireworks</button> 
                    {/* NEW: Song Button */}
                    <button className="control-btn bg-pink-600 hover:bg-pink-700" onClick={()=>router.push("/newLove")}>
                        🎵 Our Song
                    </button>
                </div> 

                {/* Click Counter */} 
                <div className="click-counter"> 
                    ❤️ Clicks: {clickCount} 
                    {clickCount >= 5 && <div className="text-xs mt-1">🔥 You're on fire!</div>} 
                    {clickCount >= 15 && <div className="text-xs mt-1">🌟 Love Master!</div>} 
                </div> 

                {/* Main Content */} 
                <div className="content"> 
                    <h1 className="love-text">I LOVE YOU</h1> 
                    <div className="message-box"> 
                        <div className="interactive-heart" onClick={createHeartBurst}> 
                            ❤️ 
                        </div> 
                        <p className="sub-text">{loveMessages[currentMessage]}</p> 
                    </div> 
                </div> 

                {/* Instructions */} 
                <div className="instructions"> 
                    💡 Click ❤️ for bursts • Double-click anywhere for explosions • Move mouse for trails 
                    <br /> 
                    🎯 Special effects at 5, 10, 15 clicks! 
                </div> 

                {/* Animated Elements (Rest of original component logic) */} 
                {hearts.map(h => ( 
                    <div key={h.id} className="heart" 
                        style={{'--x': `${h.x}%`, '--delay': `${h.delay}s`, '--duration': `${h.duration}s`} as React.CSSProperties} 
                    /> 
                ))} 

                {sparkles.map(s => ( 
                    <div key={s.id} className="sparkle" 
                        style={{'--x': `${s.x}%`, '--y': `${s.y}%`, '--delay': `${s.delay}s`} as React.CSSProperties} 
                    /> 
                ))} 

                {floatingWords.map(w => ( 
                    <div key={w.id} className="floating-word" 
                        style={{'--x': `${w.x}%`, '--delay': `${w.delay}s`, '--duration': `${w.duration}s`, '--color': w.color} as React.CSSProperties} 
                    > 
                        {w.word} 
                    </div> 
                ))} 

                {burstHearts.map(b => ( 
                    <div key={b.id} className="burst-heart" 
                        style={{'--x': `${b.x}px`, '--y': `${b.y}px`} as React.CSSProperties} 
                    > 
                        ❤️ 
                    </div> 
                ))} 

                {/* Mouse Trail */} 
                {mouseTrail.map(trail => ( 
                    <div key={trail.id} className="mouse-trail" 
                        style={{left: trail.x - 7.5, top: trail.y - 7.5}} 
                    /> 
                ))} 

                {/* Firework Particles */} 
                {particles.map(p => ( 
                    <div key={p.id} className="firework-particle" 
                        style={{ 
                            left: p.x, 
                            top: p.y, 
                            '--color': p.color, 
                            '--vx': `${p.vx * 20}px`, 
                            '--vy': `${p.vy * 20}px` 
                        } as React.CSSProperties} 
                    /> 
                ))} 
            </div> 

            {/* Song Window Modal (NEW) */}
            {showSongModal && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-[2000] backdrop-blur-sm"
                    onClick={closeSongWindow} // Close modal if backdrop is clicked
                >
                    <div 
                        className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-sm w-full animate-in zoom-in duration-300"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
                    >
                        <div className="flex justify-center mb-4">
                             <span className="text-6xl animate-spin-slow">🎶</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Listening to "Perfect"</h2>
                        <p className="text-gray-500 text-center mb-6">
                            Enjoy this moment together. The music is playing now!
                        </p>
                        <button 
                            className="w-full px-6 py-3 bg-indigo-500 text-white font-bold rounded-full hover:bg-indigo-600 transition duration-150 ease-in-out shadow-lg"
                            onClick={closeSongWindow}
                        >
                            Close & Pause
                        </button>
                    </div>
                </div>
            )}
        </> 
    ); 
}; 

export default App;
