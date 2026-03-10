"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

interface Star {
  id: string;
  x: number; // 0-1 (fraction of canvas width)
  y: number; // 0-1 (fraction of canvas height)
  name: string;
  size: number;
  claimed: boolean;
}

interface CanvasStar {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

const STAR_COUNT = 200;
const CLAIMED_STARS_TABLE = "stars";

function generateBackgroundStars(width: number, height: number): CanvasStar[] {
  return Array.from({ length: STAR_COUNT }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 1.2 + 0.3,
    opacity: Math.random() * 0.6 + 0.2,
    twinkleSpeed: Math.random() * 0.02 + 0.005,
    twinkleOffset: Math.random() * Math.PI * 2,
  }));
}

export default function SkyClient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const bgStarsRef = useRef<CanvasStar[]>([]);
  const timeRef = useRef(0);

  const [claimedStars, setClaimedStars] = useState<Star[]>([]);
  const [selectedStar, setSelectedStar] = useState<Star | null>(null);
  const [clickPos, setClickPos] = useState<{ x: number; y: number } | null>(null);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch claimed stars from Supabase
  useEffect(() => {
    async function fetchStars() {
      const { data, error } = await supabase
        .from(CLAIMED_STARS_TABLE)
        .select("id, x, y, name, size")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setClaimedStars(
          data.map((s) => ({
            id: s.id,
            x: s.x,
            y: s.y,
            name: s.name,
            size: s.size ?? 3,
            claimed: true,
          }))
        );
      }
      setLoading(false);
    }
    fetchStars();

    // Subscribe to real-time updates
    const channel = supabase
      .channel("stars-channel")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: CLAIMED_STARS_TABLE }, (payload) => {
        const s = payload.new as { id: string; x: number; y: number; name: string; size?: number };
        setClaimedStars((prev) => [
          { id: s.id, x: s.x, y: s.y, name: s.name, size: s.size ?? 3, claimed: true },
          ...prev,
        ]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // Canvas drawing
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { width, height } = canvas;
    timeRef.current += 1;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Draw background stars with twinkling
    bgStarsRef.current.forEach((star) => {
      const opacity = star.opacity + Math.sin(timeRef.current * star.twinkleSpeed + star.twinkleOffset) * 0.15;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${Math.max(0.05, Math.min(1, opacity))})`;
      ctx.fill();
    });

    // Draw claimed stars
    claimedStars.forEach((star) => {
      const px = star.x * width;
      const py = star.y * height;
      const glow = ctx.createRadialGradient(px, py, 0, px, py, star.size * 6);
      glow.addColorStop(0, "rgba(255,255,200,0.9)");
      glow.addColorStop(0.4, "rgba(255,255,180,0.4)");
      glow.addColorStop(1, "rgba(255,255,200,0)");
      ctx.beginPath();
      ctx.arc(px, py, star.size * 6, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(px, py, star.size, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,220,0.95)";
      ctx.fill();
    });

    animRef.current = requestAnimationFrame(drawCanvas);
  }, [claimedStars]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      bgStarsRef.current = generateBackgroundStars(canvas.width, canvas.height);
    }

    resize();
    window.addEventListener("resize", resize);
    animRef.current = requestAnimationFrame(drawCanvas);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animRef.current);
    };
  }, [drawCanvas]);

  function handleCanvasClick(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const xFrac = px / canvas.width;
    const yFrac = py / canvas.height;

    // Check if clicking on existing claimed star
    const clicked = claimedStars.find((s) => {
      const sx = s.x * canvas.width;
      const sy = s.y * canvas.height;
      return Math.sqrt((px - sx) ** 2 + (py - sy) ** 2) < 20;
    });

    if (clicked) {
      setSelectedStar(clicked);
      setClickPos({ x: e.clientX, y: e.clientY });
      setSuccess(false);
      setName("");
      setNameError("");
      return;
    }

    // New unclaimed position
    const newStar: Star = {
      id: `pending-${Date.now()}`,
      x: xFrac,
      y: yFrac,
      name: "",
      size: Math.random() * 1.5 + 2,
      claimed: false,
    };
    setSelectedStar(newStar);
    setClickPos({ x: e.clientX, y: e.clientY });
    setSuccess(false);
    setName("");
    setNameError("");
  }

  async function handleClaim(e: React.FormEvent) {
    e.preventDefault();
    setNameError("");

    const trimmed = name.trim();
    if (!trimmed) {
      setNameError("Please enter your name.");
      return;
    }
    if (trimmed.length < 2) {
      setNameError("Name must be at least 2 characters.");
      return;
    }
    if (trimmed.length > 50) {
      setNameError("Name must be under 50 characters.");
      return;
    }

    if (!selectedStar || selectedStar.claimed) return;

    setSubmitting(true);

    const { error } = await supabase.from(CLAIMED_STARS_TABLE).insert({
      x: selectedStar.x,
      y: selectedStar.y,
      name: trimmed,
      size: selectedStar.size,
    });

    setSubmitting(false);

    if (error) {
      setNameError("Failed to claim star. Please try again.");
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      setSelectedStar(null);
      setClickPos(null);
      setSuccess(false);
    }, 2000);
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#020408]">
      {/* Nebula background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-900/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-900/5 rounded-full blur-3xl" />
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-crosshair"
        onClick={handleCanvasClick}
        aria-label="Sky — click anywhere to claim a star"
        role="img"
      />

      {/* Header overlay */}
      <div className="relative z-10 pt-24 px-6 text-center pointer-events-none">
        <p className="text-xs tracking-[0.4em] uppercase text-[#333333] mb-3">Anastoria</p>
        <h1 className="text-3xl md:text-4xl font-light tracking-[0.3em] uppercase text-white/80">The Sky</h1>
        <p className="text-xs text-[#333333] mt-3 tracking-wider">
          {loading ? "Loading stars..." : `${claimedStars.length} star${claimedStars.length !== 1 ? "s" : ""} claimed · Click anywhere to claim yours`}
        </p>
      </div>

      {/* Claim popup */}
      {selectedStar && clickPos && (
        <div
          className="fixed z-50 bg-[#0d0d0d] border border-[#222222] p-6 w-72 shadow-2xl"
          style={{
            left: Math.min(clickPos.x, window.innerWidth - 310),
            top: Math.min(clickPos.y + 10, window.innerHeight - 200),
          }}
          role="dialog"
          aria-modal="true"
          aria-label={selectedStar.claimed ? "Star details" : "Claim a star"}
        >
          <button
            onClick={() => { setSelectedStar(null); setClickPos(null); }}
            className="absolute top-3 right-3 text-[#444444] hover:text-white transition-colors text-lg leading-none"
            aria-label="Close"
          >
            ×
          </button>

          {selectedStar.claimed ? (
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-[#444444] mb-3">Claimed by</p>
              <p className="text-white font-light text-lg tracking-wide">{selectedStar.name}</p>
            </div>
          ) : success ? (
            <div className="text-center">
              <p className="text-white text-sm tracking-wider mb-1">✦ Star claimed!</p>
              <p className="text-[#555555] text-xs">Your star shines in the sky.</p>
            </div>
          ) : (
            <form onSubmit={handleClaim}>
              <p className="text-xs tracking-[0.3em] uppercase text-[#444444] mb-4">Claim this star</p>
              <div className="mb-4">
                <label htmlFor="star-name" className="sr-only">Your name</label>
                <input
                  id="star-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  maxLength={50}
                  className="w-full bg-[#111111] border border-[#222222] text-white placeholder-[#444444] px-3 py-2.5 text-sm focus:outline-none focus:border-[#444444] transition-colors"
                  autoFocus
                  aria-describedby={nameError ? "names-error" : undefined}
                />
                {nameError && (
                  <p id="names-error" role="alert" className="text-red-400 text-xs mt-2 tracking-wide">
                    {nameError}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-white text-black text-xs tracking-[0.3em] uppercase font-medium hover:bg-[#e0e0e0] transition-colors disabled:opacity-50"
              >
                {submitting ? "Claiming..." : "Claim Star"}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Bottom info */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none">
        <p className="text-xs text-[#222222] tracking-widest uppercase">Click a glowing star to see who claimed it</p>
      </div>
    </div>
  );
}
