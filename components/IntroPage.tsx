'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const IntroPage = () => {
  const router = useRouter();
  const [step, setStep] = useState<'ask' | 'reveal' | 'done'>('ask');

  useEffect(() => {
    // First show "Enter your name"
    const revealTimeout = setTimeout(() => setStep('reveal'), 2500);

    // Then show "I know you are Archita"
    const doneTimeout = setTimeout(() => setStep('done'), 4500);

    // Then redirect to love page
    const redirectTimeout = setTimeout(() => router.push('/special'), 8500);

    return () => {
      clearTimeout(revealTimeout);
      clearTimeout(doneTimeout);
      clearTimeout(redirectTimeout);
    };
  }, [router]);

  return (
    <>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .container {
          height: 100vh;
          width: 100vw;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(120deg, #ff758f, #ff99ac);
          font-family: 'Arial', sans-serif;
          color: white;
          text-align: center;
          overflow: hidden;
        }
        .text {
          font-size: 2rem;
          font-weight: bold;
          animation: fadeIn 1s ease forwards;
        }
        .highlight {
          color: #ffe066;
          text-shadow: 0 0 15px rgba(255, 255, 255, 0.8);
        }
      `}</style>

      <div className="container">
        {step === 'ask' && <p className="text">Hey... can you tell me your name? 🤔</p>}
        {step === 'reveal' && <p className="text">Just kidding... I already know 💡</p>}
        {step === 'done' && <p className="text">You are <span className="highlight">Archita ❤️</span></p>}
      </div>
    </>
  );
};

export default IntroPage;
