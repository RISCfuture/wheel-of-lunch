"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Restaurant } from "@/types";
import WinnerModal from "./WinnerModal";
import { RotateCw, Loader2 } from "lucide-react";

interface RouletteWheelProps {
  restaurants: Restaurant[];
}

export default function RouletteWheel({ restaurants }: RouletteWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<Restaurant | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [, setDragStart] = useState({ x: 0, y: 0, angle: 0 });

  const animationRef = useRef<number>(0);
  const lastFrameTime = useRef<number>(0);
  const spinVelocity = useRef<number>(0);
  const lastPointerAngle = useRef<number>(0);
  const velocityHistory = useRef<{ angle: number; time: number }[]>([]);

  // Audio context for ding sounds
  const audioContextRef = useRef<AudioContext | null>(null);

  const WHEEL_SIZE = 400;
  const CENTER_X = WHEEL_SIZE / 2;
  const CENTER_Y = WHEEL_SIZE / 2;
  const WHEEL_RADIUS = 180;

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, []);


  const playDingSound = useCallback(() => {
    if (!audioContextRef.current) return;

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    oscillator.frequency.setValueAtTime(800, audioContextRef.current.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, audioContextRef.current.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.1);

    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + 0.1);
  }, []);

  const drawWheel = useCallback((ctx: CanvasRenderingContext2D, currentRotation: number) => {
    const colors = [
      "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
      "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9"
    ];
    const anglePerSegment = (2 * Math.PI) / restaurants.length;

    // Clear canvas
    ctx.clearRect(0, 0, WHEEL_SIZE, WHEEL_SIZE);

    // Draw wheel segments
    restaurants.forEach((restaurant, index) => {
      const startAngle = (index * anglePerSegment) + currentRotation;
      const endAngle = ((index + 1) * anglePerSegment) + currentRotation;

      // Draw segment
      ctx.beginPath();
      ctx.moveTo(CENTER_X, CENTER_Y);
      ctx.arc(CENTER_X, CENTER_Y, WHEEL_RADIUS, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = colors[index % colors.length];
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw text
      ctx.save();
      ctx.translate(CENTER_X, CENTER_Y);
      ctx.rotate(startAngle + anglePerSegment / 2);
      ctx.textAlign = "left";
      ctx.fillStyle = "#fff";
      ctx.font = "bold 14px Arial";
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 2;

      const maxTextWidth = WHEEL_RADIUS - 40;
      const text = restaurant.name.length > 15 ? restaurant.name.substring(0, 15) + "…" : restaurant.name;
      ctx.fillText(text, 20, 5, maxTextWidth);

      ctx.restore();
    });

    // Draw center circle
    ctx.beginPath();
    ctx.arc(CENTER_X, CENTER_Y, 20, 0, 2 * Math.PI);
    ctx.fillStyle = "#333";
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw pointer
    ctx.beginPath();
    ctx.moveTo(CENTER_X + WHEEL_RADIUS + 10, CENTER_Y);
    ctx.lineTo(CENTER_X + WHEEL_RADIUS - 10, CENTER_Y - 15);
    ctx.lineTo(CENTER_X + WHEEL_RADIUS - 10, CENTER_Y + 15);
    ctx.closePath();
    ctx.fillStyle = "#333";
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [restaurants, CENTER_X, CENTER_Y, WHEEL_RADIUS, WHEEL_SIZE]);

  const getPointerAngle = useCallback((clientX: number, clientY: number): number => {
    const canvas = canvasRef.current;
    if (!canvas) return 0;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left - CENTER_X;
    const y = clientY - rect.top - CENTER_Y;

    return Math.atan2(y, x);
  }, [CENTER_X, CENTER_Y]);

  const determineWinner = useCallback((finalRotation: number): Restaurant => {
    const normalizedRotation = ((finalRotation % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);
    const anglePerSegment = (2 * Math.PI) / restaurants.length;
    const pointerAngle = 0; // Pointer points to the right (0 radians)

    // Calculate which segment the pointer is pointing to
    const targetAngle = (2 * Math.PI - normalizedRotation + pointerAngle) % (2 * Math.PI);
    const segmentIndex = Math.floor(targetAngle / anglePerSegment) % restaurants.length;

    return restaurants[segmentIndex];
  }, [restaurants]);

  const startSpin = useCallback((velocity: number) => {
    if (isSpinning) return;

    setIsSpinning(true);
    setWinner(null);
    // Support both positive and negative velocities for backwards spinning
    spinVelocity.current = velocity > 0 ? Math.max(velocity, 5) : Math.min(velocity, -5);
    lastFrameTime.current = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastFrameTime.current;
      lastFrameTime.current = currentTime;

      // Apply friction (increased for quicker stops)
      spinVelocity.current *= 0.985;

      // Update rotation
      const deltaRotation = (spinVelocity.current * deltaTime) / 1000;
      setRotation(prev => {
        const newRotation = prev + deltaRotation;

        // Check for segment crossings to play ding sound
        const anglePerSegment = (2 * Math.PI) / restaurants.length;
        const prevSegment = Math.floor(((prev % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI) / anglePerSegment);
        const currentSegment = Math.floor(((newRotation % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI) / anglePerSegment);

        if (prevSegment !== currentSegment && Math.abs(spinVelocity.current) > 0.5) {
          playDingSound();
        }

        return newRotation;
      });

      // Continue animation if still spinning fast enough
      if (Math.abs(spinVelocity.current) > 0.1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Spinning stopped
        setIsSpinning(false);
        setRotation(prev => {
          const finalRotation = prev;
          const chosenRestaurant = determineWinner(finalRotation);
          // Add a short pause before showing the modal for better UX
          setTimeout(() => {
            setWinner(chosenRestaurant);
          }, 800);
          return finalRotation;
        });
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [isSpinning, restaurants.length, playDingSound, determineWinner]);

  // Mouse/touch event handlers
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (isSpinning) return;

    e.preventDefault();
    setIsDragging(true);

    const angle = getPointerAngle(e.clientX, e.clientY);
    setDragStart({ x: e.clientX, y: e.clientY, angle });
    lastPointerAngle.current = angle;
    velocityHistory.current = [];

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.setPointerCapture(e.pointerId);
    }
  }, [isSpinning, getPointerAngle]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging || isSpinning) return;

    e.preventDefault();
    const currentAngle = getPointerAngle(e.clientX, e.clientY);
    let angleDiff = currentAngle - lastPointerAngle.current;

    // Handle angle wrap-around
    if (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
    if (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

    setRotation(prev => prev + angleDiff);

    // Track velocity for smooth release (preserve direction)
    const now = performance.now();
    velocityHistory.current.push({ angle: angleDiff, time: now });
    velocityHistory.current = velocityHistory.current.filter(v => now - v.time < 100);

    lastPointerAngle.current = currentAngle;
  }, [isDragging, isSpinning, getPointerAngle]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;

    setIsDragging(false);

    // Calculate velocity from recent history (preserve direction)
    let totalAngle = 0;
    let totalTime = 0;

    if (velocityHistory.current.length > 1) {
      velocityHistory.current.forEach(v => {
        totalAngle += v.angle; // Don't use Math.abs to preserve direction
        totalTime = Math.max(totalTime, v.time);
      });

      const velocity = totalAngle / Math.max(totalTime / 1000, 0.1) * 10;

      // Start spinning if there was enough velocity (in either direction)
      if (Math.abs(velocity) > 1) {
        startSpin(velocity);
      }
    }

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.releasePointerCapture(e.pointerId);
    }
  }, [isDragging, startSpin]);

  // Draw wheel on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || restaurants.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    drawWheel(ctx, rotation);
  }, [rotation, restaurants, drawWheel]);

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  if (restaurants.length === 0) {
    return <div>No restaurants available</div>;
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={WHEEL_SIZE}
          height={WHEEL_SIZE}
          className={`border-4 border-gray-300 rounded-full shadow-lg ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          } ${isSpinning ? "pointer-events-none" : ""}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          style={{ touchAction: "none" }}
        />

      </div>

      <div className="text-center space-y-4">
        <p className="text-gray-600">
          Drag the wheel to spin, or click the button below!
        </p>

        <div className="flex justify-center">
          <button
            onClick={() => startSpin((Math.random() * 20 + 10) * (Math.random() > 0.5 ? 1 : -1))}
            disabled={isSpinning}
            className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
          {isSpinning ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Spinning...
            </>
          ) : (
            <>
              <RotateCw className="w-5 h-5" />
              Spin the Wheel!
            </>
          )}
          </button>
        </div>

        <WinnerModal
          winner={winner}
          onClose={() => setWinner(null)}
        />
      </div>
    </div>
  );
}
