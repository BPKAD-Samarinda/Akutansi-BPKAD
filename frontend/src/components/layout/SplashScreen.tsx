import { useEffect, useState, useRef } from "react";
import * as THREE from "three";
// @ts-ignore
import BIRDS from "vanta/dist/vanta.birds.min";
import bpkadLogoHitam from "../../assets/images/bpkad-building-hitam.webp";
import bpkadLogoPutih from "../../assets/images/bpkad-building-putih.webp";

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const vantaRef = useRef<HTMLDivElement>(null);
  const [vantaEffect, setVantaEffect] = useState<any>(0);

  useEffect(() => {
    // Make THREE globally available for Vanta just in case
    if (typeof window !== "undefined" && !(window as any).THREE) {
      (window as any).THREE = THREE;
    }

    let vantaInterval: any;
    
    const initVanta = () => {
      if (!vantaEffect && vantaRef.current && typeof (window as any).VANTA !== 'undefined' && (window as any).VANTA.BIRDS) {
        try {
          const effect = (window as any).VANTA.BIRDS({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            backgroundColor: 0xffffff,
            color1: 0xff5700,
            color2: 0xf97316,
            colorMode: "varianceGradient",
            birdSize: 1.5,
            wingSpan: 30,
            speedLimit: 4,
            separation: 20,
            alignment: 20,
            cohesion: 20,
            quantity: 4.0
          });
          setVantaEffect(effect);
          if (vantaInterval) clearInterval(vantaInterval);
        } catch (err) {
          console.error("[Vanta.js Error]", err);
          if (vantaInterval) clearInterval(vantaInterval);
        }
      }
    };

    // Try immediately
    initVanta();
    // Poll if not loaded yet
    if (!vantaEffect) {
      vantaInterval = setInterval(initVanta, 100);
    }

    return () => {
      if (vantaInterval) clearInterval(vantaInterval);
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  useEffect(() => {
    // Animate progress
    const duration = 4000; // 4 seconds total loading
    const intervalTime = 30;
    const steps = duration / intervalTime;
    let step = 0;
    
    const interval = setInterval(() => {
      step++;
      setProgress((step / steps) * 100);
      if (step >= steps) {
        clearInterval(interval);
        // Start fade out
        setIsFadingOut(true);
        setTimeout(() => {
          onFinish();
        }, 600); // 600ms fade out duration
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div className={`fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center transition-opacity duration-500 ease-in-out ${isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      
      {/* Vanta Background Layer */}
      <div ref={vantaRef} className="absolute inset-0 z-0" />

      {/* Top left text */}
      <div className="absolute top-8 left-8 text-sm font-bold text-slate-800 z-10 tracking-wide animate-[fadeIn_1s_ease-out]">
        BPKAD Kota Samarinda
      </div>

      {/* Center card */}
      <div className="relative z-10 w-full max-w-sm px-6 flex flex-col items-center">
        {/* Logo Card */}
        <div className="w-64 h-64 bg-white/90 backdrop-blur-md rounded-[2.5rem] shadow-2xl shadow-slate-300/60 flex items-center justify-center mb-16 p-10 border border-slate-200 animate-[scaleInSplash_1s_cubic-bezier(0.16,1,0.3,1)_both]">
          <img
            src={bpkadLogoHitam}
            alt="BPKAD Logo"
            className="w-full h-auto object-contain animate-[fadeIn_1.2s_ease-out_0.2s_both]"
          />
        </div>

        {/* Progress Bar Container */}
        <div className="w-full max-w-[320px] animate-[slideUpSplash_1s_cubic-bezier(0.16,1,0.3,1)_0.3s_both]">
          {/* Progress Bar */}
          <div className="w-full h-[3px] bg-slate-100 rounded-full overflow-hidden mb-10 relative">
            <div 
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-75 ease-linear shadow-[0_0_10px_rgba(249,115,22,0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Text */}
          <div className="text-center space-y-3">
            <h2 className="text-slate-600 font-semibold text-sm animate-pulse">
              Menyiapkan Portal Layanan...
            </h2>
            <p className="text-[10px] font-bold text-slate-400 tracking-[0.25em] uppercase">
              Sistem Manajemen Dokumen
            </p>
          </div>
        </div>
      </div>

      {/* Global CSS for the splash animations */}
      <style>{`
        @keyframes scaleInSplash {
          from { opacity: 0; transform: scale(0.85) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes slideUpSplash {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
