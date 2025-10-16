'use client'; 

import { useRouter } from 'next/navigation';
import LyricsPlayer from "./LyricsPlayer";
import React, { useState, useEffect, useRef } from 'react'; 

interface Heart { id: number, x: number, delay: number, duration: number }
interface Sparkle { id: number, x: number, y: number, delay: number }
interface FloatingWord { id: number, word: string, x: number, delay: number, duration: number, color: string }
interface BurstHeart { id: number, x: number, y: number }
interface MouseTrail { id: number, x: number, y: number }
interface Particle { id: number, x: number, y: number, vx: number, vy: number, color: string }

const App = () => { 
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
    const [showLyrics, setShowLyrics] = useState(false);
    const router = useRouter()

    const [showSongModal, setShowSongModal] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null); 
    
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
        'radial-gradient(circle at 20% 50%, rgba(120, 0, 150, 0.3), transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 0, 100, 0.3), transparent 50%), linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        'radial-gradient(circle at 30% 70%, rgba(255, 100, 150, 0.4), transparent 60%), radial-gradient(circle at 70% 30%, rgba(100, 200, 255, 0.3), transparent 50%), linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'radial-gradient(circle at 50% 50%, rgba(255, 200, 100, 0.3), transparent 70%), linear-gradient(135deg, #ffecd2 0%, #fcb69f 50%, #ff9a9e 100%)',
        'radial-gradient(circle at 10% 80%, rgba(168, 237, 234, 0.5), transparent 50%), radial-gradient(circle at 90% 20%, rgba(254, 214, 227, 0.5), transparent 50%), linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        'radial-gradient(circle at 40% 40%, rgba(255, 150, 200, 0.4), transparent 60%), linear-gradient(135deg, #d299c2 0%, #fef9d7 50%, #f093fb 100%)',
        'radial-gradient(circle at 60% 60%, rgba(255, 180, 200, 0.4), transparent 50%), linear-gradient(135deg, #ff9a9e 0%, #fad0c4 50%, #fbc2eb 100%)',
        'radial-gradient(circle at 25% 75%, rgba(132, 250, 176, 0.4), transparent 60%), linear-gradient(135deg, #84fab0 0%, #8fd3f4 50%, #c2e9fb 100%)',
        'radial-gradient(circle at 50% 30%, rgba(255, 221, 225, 0.5), transparent 50%), linear-gradient(135deg, #ffdde1 0%, #ee9ca7 50%, #ff9a9e 100%)',
        'radial-gradient(circle at 80% 50%, rgba(255, 106, 0, 0.3), transparent 60%), linear-gradient(135deg, #ff6a00 0%, #ee0979 50%, #ff512f 100%)',
        'radial-gradient(circle at 30% 30%, rgba(54, 209, 220, 0.4), transparent 50%), linear-gradient(135deg, #36d1dc 0%, #5b86e5 50%, #2575fc 100%)'
    ]; 

    const openSongWindow = () => {
        if (audioRef.current) {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    setShowSongModal(true);
                }).catch(error => {
                    console.error("Autoplay prevented:", error);
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
            audioRef.current.currentTime = 0;
        }
        setShowSongModal(false);
        const instructionDiv = document.querySelector('.instructions');
        if (instructionDiv) {
             instructionDiv.textContent = "💡 Click ❤️ for bursts • Double-click anywhere for explosions • Move mouse for trails | 🎯 Special effects at 5, 10, 15 clicks!";
        }
    };

    useEffect(() => { 
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
        
        if (clickCount === 4) {
            triggerFireworks(); 
        } else if (clickCount === 9) {
            shakeScreenEffect(); 
        } else if (clickCount === 14) {
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
            <style global jsx>{` 
                html, body, #__next { 
                    margin: 0; 
                    padding: 0; 
                    height: 100%; 
                    overflow: hidden;
                } 
                * { 
                    cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><text y="16" font-size="16">❤️</text></svg>'), auto; 
                } 
                .AppContainer {
                    height: 100vh;
                    width: 100vw;
                }
            `}</style> 

            <style jsx>{` 
                @keyframes gradientShift { 
                    0%, 100% { background-position: 0% 50%; } 
                    50% { background-position: 100% 50%; } 
                } 
                @keyframes pulse { 
                    0%, 100% { transform: scale(1); } 
                    50% { transform: scale(1.08); } 
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
                    0%, 100% { text-shadow: 0 0 40px rgba(255, 255, 255, 1), 0 0 80px rgba(255, 182, 193, 0.8); } 
                    50% { text-shadow: 0 0 60px rgba(255, 255, 255, 1), 0 0 120px rgba(255, 182, 193, 1), 0 0 160px rgba(255, 119, 143, 0.8); } 
                }
                @keyframes textGradient {
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
                @keyframes heartPulse {
                    0%, 100% { transform: scale(1); opacity: 0.6; }
                    50% { transform: scale(1.3); opacity: 0.3; }
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

                .container { 
                    min-height: 100vh; 
                    width: 100vw; 
                    background: ${backgroundThemes[backgroundTheme]}; 
                    background-size: 200% 200%; 
                    animation: gradientShift 8s ease infinite ${showFireworks ? ', rainbow 2s linear infinite' : ''} ${shakeScreen ? ', shake 0.1s linear infinite' : ''}; 
                    display: flex; 
                    justify-content: center; 
                    align-items: center; 
                    overflow: hidden; 
                    font-family: 'Inter', 'Segoe UI', system-ui, sans-serif; 
                    position: relative; 
                }
                
                .container::before {
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
                
                .container::after {
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
                
                .content { 
                    text-align: center; 
                    z-index: 10; 
                    animation: ${clickCount > 10 ? 'bounce 2s ease-in-out infinite' : 'none'}; 
                    position: relative;
                } 
                
                .love-text { 
                    font-size: ${textSize}rem; 
                    font-weight: 900; 
                    background: linear-gradient(45deg, #fff, #ffd1dc, #fff, #ffb6c1, #fff);
                    background-size: 300% 300%;
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: pulse 2s ease-in-out infinite, glow 3s ease-in-out infinite, textGradient 5s ease infinite; 
                    margin-bottom: 2rem; 
                    letter-spacing: 12px; 
                    transition: font-size 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                    filter: drop-shadow(0 0 30px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 60px rgba(255, 182, 193, 0.7));
                    text-transform: uppercase;
                    position: relative;
                } 
                
                .message-box { 
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05));
                    backdrop-filter: blur(30px) saturate(180%);
                    -webkit-backdrop-filter: blur(30px) saturate(180%);
                    border-radius: 35px; 
                    padding: 3.5rem; 
                    border: 2px solid rgba(255, 255, 255, 0.35);
                    box-shadow: 
                        0 10px 40px 0 rgba(255, 182, 193, 0.4),
                        inset 0 2px 0 0 rgba(255, 255, 255, 0.5),
                        0 20px 60px rgba(0, 0, 0, 0.15);
                    transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    transform-style: preserve-3d;
                    position: relative;
                    overflow: hidden;
                } 
                
                .message-box::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: conic-gradient(from 0deg, transparent, rgba(255, 255, 255, 0.15), transparent 30%);
                    animation: rotate 8s linear infinite;
                }
                
                .message-box::after {
                    content: '';
                    position: absolute;
                    inset: 2px;
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
                    border-radius: 33px;
                    z-index: -1;
                }
                
                .message-box:hover { 
                    transform: translateY(-15px) rotateY(5deg) rotateX(5deg) scale(1.03);
                    box-shadow: 
                        0 20px 70px 0 rgba(255, 182, 193, 0.6),
                        inset 0 2px 0 0 rgba(255, 255, 255, 0.7),
                        0 30px 100px rgba(0, 0, 0, 0.2);
                    border-color: rgba(255, 255, 255, 0.5);
                } 
                
                .sub-text { 
                    color: white; 
                    font-size: 1.5rem; 
                    font-style: italic; 
                    margin-top: 1.2rem; 
                    transition: all 0.3s ease;
                    font-weight: 300;
                    text-shadow: 0 3px 15px rgba(0, 0, 0, 0.4);
                    position: relative;
                    z-index: 1;
                    letter-spacing: 1px;
                } 
                
                .interactive-heart { 
                    font-size: 5.5rem; 
                    cursor: pointer; 
                    animation: heartbeat 1.2s ease-in-out infinite; 
                    transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                    display: inline-block;
                    filter: drop-shadow(0 0 25px rgba(255, 23, 68, 0.9)) drop-shadow(0 0 50px rgba(255, 23, 68, 0.5));
                    position: relative;
                    z-index: 1;
                } 
                
                .interactive-heart::before {
                    content: '❤️';
                    position: absolute;
                    left: 0;
                    top: 0;
                    filter: blur(20px);
                    opacity: 0.6;
                    animation: heartPulse 1.5s ease-in-out infinite;
                }
                
                .interactive-heart:hover { 
                    transform: scale(1.6) rotate(15deg);
                    filter: drop-shadow(0 0 40px rgba(255, 23, 68, 1)) 
                            drop-shadow(0 0 80px rgba(255, 23, 68, 0.7)) 
                            saturate(1.5) brightness(1.3);
                } 
                
                .controls { 
                    position: fixed; 
                    top: 25px; 
                    right: 25px; 
                    display: flex; 
                    flex-wrap: wrap;
                    gap: 12px; 
                    z-index: 1000; 
                } 
                
                .control-btn { 
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1));
                    border: 2px solid rgba(255, 255, 255, 0.4);
                    border-radius: 22px; 
                    padding: 14px 24px; 
                    color: white; 
                    cursor: pointer; 
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    backdrop-filter: blur(20px) saturate(180%);
                    -webkit-backdrop-filter: blur(20px) saturate(180%);
                    font-size: 1rem; 
                    font-weight: 700;
                    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.4);
                    position: relative;
                    overflow: hidden;
                } 
                
                .control-btn::before {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 0;
                    height: 0;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.4);
                    transform: translate(-50%, -50%);
                    transition: width 0.6s, height 0.6s;
                }
                
                .control-btn:hover::before {
                    width: 300px;
                    height: 300px;
                }
                
                .control-btn:hover { 
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.2));
                    transform: translateY(-4px) scale(1.08);
                    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.5);
                    border-color: rgba(255, 255, 255, 0.6);
                }
                
                .control-btn:active {
                    transform: translateY(-2px) scale(1.05);
                }
                
                .click-counter { 
                    position: fixed; 
                    top: 25px; 
                    left: 25px; 
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1));
                    backdrop-filter: blur(20px) saturate(180%);
                    -webkit-backdrop-filter: blur(20px) saturate(180%);
                    padding: 20px 28px; 
                    border-radius: 28px; 
                    color: white; 
                    font-weight: 800; 
                    border: 2px solid rgba(255, 255, 255, 0.4);
                    text-shadow: 0 3px 10px rgba(0, 0, 0, 0.4);
                    z-index: 1000;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.4);
                    transition: all 0.4s ease;
                }
                
                .click-counter:hover {
                    transform: scale(1.08);
                    box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.5);
                } 

                .heart { 
                    position: absolute; 
                    width: 20px; 
                    height: 20px; 
                    background: linear-gradient(45deg, #ff1744, #ff4569);
                    border-radius: 50%; 
                    animation: float var(--duration) ease-in-out forwards; 
                    animation-delay: var(--delay); 
                    left: var(--x);
                    filter: drop-shadow(0 0 8px rgba(255, 23, 68, 0.6));
                } 
                .heart::before, 
                .heart::after { 
                    content: ''; 
                    width: 20px; 
                    height: 20px; 
                    position: absolute; 
                    background: linear-gradient(45deg, #ff1744, #ff4569);
                    border-radius: 50%; 
                } 
                .heart::before { top: -10px; left: 0; } 
                .heart::after { top: 0; left: -10px; } 
                
                .sparkle { 
                    position: absolute; 
                    width: 8px; 
                    height: 8px; 
                    background: white; 
                    border-radius: 50%; 
                    animation: sparkle 2s linear forwards; 
                    animation-delay: var(--delay); 
                    left: var(--x); 
                    top: var(--y); 
                    box-shadow: 0 0 15px white, 0 0 30px rgba(255, 255, 255, 0.5); 
                } 
                
                .floating-word { 
                    position: absolute; 
                    font-size: 2rem; 
                    font-weight: 800; 
                    animation: wordFloat var(--duration) linear forwards; 
                    animation-delay: var(--delay); 
                    left: var(--x); 
                    color: var(--color); 
                    text-shadow: 0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.4);
                    filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
                } 
                
                .burst-heart { 
                    position: fixed; 
                    left: 50%; 
                    top: 50%; 
                    font-size: 3rem; 
                    animation: burstHeart 2s ease-out forwards; 
                    pointer-events: none; 
                    filter: drop-shadow(0 0 15px rgba(255, 23, 68, 0.8)) drop-shadow(0 0 30px rgba(255, 23, 68, 0.4));
                } 
                
                .mouse-trail { 
                    position: fixed; 
                    width: 18px; 
                    height: 18px; 
                    background: radial-gradient(circle, rgba(255, 23, 68, 0.8), transparent); 
                    border-radius: 50%; 
                    pointer-events: none; 
                    animation: mouseTrail 1s linear forwards; 
                    z-index: 1;
                    box-shadow: 0 0 20px rgba(255, 23, 68, 0.6);
                } 
                
                .firework-particle { 
                    position: fixed; 
                    width: 10px; 
                    height: 10px; 
                    border-radius: 50%; 
                    background: var(--color); 
                    animation: firework 3s ease-out forwards; 
                    box-shadow: 0 0 20px var(--color), 0 0 40px var(--color);
                } 
                
                .instructions { 
                    position: fixed; 
                    bottom: 25px; 
                    left: 50%; 
                    transform: translateX(-50%); 
                    background: linear-gradient(135deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3));
                    color: white; 
                    padding: 20px 35px; 
                    border-radius: 28px; 
                    backdrop-filter: blur(25px) saturate(180%);
                    -webkit-backdrop-filter: blur(25px) saturate(180%);
                    font-size: 1rem; 
                    text-align: center; 
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    max-width: 90%;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2);
                    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
                    transition: all 0.4s ease;
                    font-weight: 500;
                }
                
                .instructions:hover {
                    background: linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4));
                    transform: translateX(-50%) translateY(-5px);
                    box-shadow: 0 15px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3);
                }

                @media (max-width: 768px) { 
                    .love-text { font-size: 3rem; letter-spacing: 4px; } 
                    .sub-text { font-size: 1.1rem; } 
                    .controls {  
                        top: 15px;  
                        right: 15px;  
                        gap: 8px;
                    } 
                    .control-btn {
                        padding: 10px 16px;
                        font-size: 0.85rem;
                    }
                    .click-counter { 
                        top: 15px; 
                        left: 15px; 
                        padding: 12px 18px; 
                        font-size: 0.85rem;
                    } 
                    .instructions { 
                        bottom: 15px; 
                        padding: 14px 20px;
                        font-size: 0.8rem; 
                    }
                    .message-box {
                        padding: 2rem;
                    }
                    .interactive-heart {
                        font-size: 4rem;
                    }
                } 
            `}</style> 

            <div className="container AppContainer" onMouseMove={handleMouseMove} onDoubleClick={handleDoubleClick}> 
                <audio ref={audioRef} src="perfect.mp3" preload="auto" />

                {/* Floating Orbs */}
                <div className="floating-orb orb1"></div>
                <div className="floating-orb orb2"></div>
                <div className="floating-orb orb3"></div>

                <div className="controls"> 
                    <button className="control-btn" onClick={cycleMessage}>💬 Message</button> 
                    <button className="control-btn" onClick={growText}>🔍 Grow Text</button> 
                    <button className="control-btn" onClick={changeBackgroundTheme}>🎨 Theme</button> 
                    <button className="control-btn" onClick={triggerFireworks}>🎆 Fireworks</button> 
                    <button className="control-btn" onClick={()=>router.push("/newLove")}>
                        🎵 Our Song
                    </button>
                    <button className="control-btn" onClick={() => setShowLyrics(true)}>
                        🎤 Karaoke
                    </button>
                </div> 

                <div className="click-counter"> 
                    ❤️ Clicks: {clickCount} 
                    {clickCount >= 5 && <div style={{fontSize: '0.75rem', marginTop: '4px'}}>🔥 You're on fire!</div>} 
                    {clickCount >= 15 && <div style={{fontSize: '0.75rem', marginTop: '4px'}}>🌟 Love Master!</div>} 
                </div> 

                <div className="content"> 
                    <h1 className="love-text">I LOVE YOU</h1> 
                    <div className="message-box"> 
                        <div className="interactive-heart" onClick={createHeartBurst}> 
                            ❤️ 
                        </div> 
                        <p className="sub-text">{loveMessages[currentMessage]}</p> 
                    </div> 
                </div> 

                <div className="instructions"> 
                    💡 Click ❤️ for bursts • Double-click anywhere for explosions • Move mouse for trails 
                    <br /> 
                    🎯 Special effects at 5, 10, 15 clicks! 
                </div> 

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

                {mouseTrail.map((trail, index) => (
                    <div
                        key={`${trail.id}-${index}`}
                        className="mouse-trail"
                        style={{ left: trail.x - 9, top: trail.y - 9 }}
                    />
                ))}

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
                
            {showLyrics && (
                <LyricsPlayer
                    audioSrc="/love.mp3"
                    onClose={() => setShowLyrics(false)}
                />
            )}

            {showSongModal && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-[2000] backdrop-blur-sm"
                    onClick={closeSongWindow}
                >
                    <div 
                        className="bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-1 rounded-3xl shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-white p-10 rounded-3xl text-center max-w-sm w-full">
                            <div className="flex justify-center mb-6">
                                <span className="text-7xl animate-pulse">🎶</span>
                            </div>
                            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-3">
                                Listening to "Perfect"
                            </h2>
                            <p className="text-gray-600 text-center mb-8 font-medium">
                                Enjoy this moment together. The music is playing now!
                            </p>
                            <button 
                                className="w-full px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-bold rounded-full hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                                onClick={closeSongWindow}
                            >
                                Close & Pause
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </> 
    ); 
}; 

export default App;