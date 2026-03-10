"use client";
import { useEffect, useState } from "react";

interface Review {
  id: string;
  name: string;
  email: string;
  rating: number;
  body: string;
  product_id: string;
  approved: boolean;
  created_at: string;
}

export default function AdminClient() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
    if (adminPass && password === adminPass) {
      setAuthed(true);
    } else {
      setError("Incorrect password.");
    }
  }

  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    fetch("/api/admin/reviews")
      .then((r) => r.json())
      .then((d) => { setReviews(d.reviews ?? []); setLoading(false); });
  }, [authed]);

  async function approve(id: string) {
    await fetch(`/api/admin/reviews/${id}/approve`, { method: "PATCH" });
    setReviews((prev) => prev.map((r) => r.id === id ? { ...r, approved: true } : r));
  }

  async function deleteReview(id: string) {
    await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
    setReviews((prev) => prev.filter((r) => r.id !== id));
  }

  if (!authed) {
    return (
      <div className="min-h-screen pt-24 px-6 flex items-center justify-center">
        <form onSubmit={handleLogin} className="bg-[#111111] border border-[#222222] p-8 w-80 space-y-4">
          <h1 className="text-sm tracking-[0.3em] uppercase text-white">Admin</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-[#080808] border border-[#222222] text-white px-4 py-3 text-sm focus:outline-none focus:border-[#444444]"
            aria-label="Admin password"
          />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button type="submit" className="w-full py-3 bg-white text-black text-xs tracking-widest uppercase">
            Login
          </button>
        </form>
      </div>
    );
  }

  const pending = reviews.filter((r) => !r.approved);
  const approved = reviews.filter((r) => r.approved);

  return (
    <div className="min-h-screen pt-24 px-6 max-w-4xl mx-auto py-16">
      <h1 className="text-2xl font-light tracking-wider uppercase text-white mb-12">Review Moderation</h1>

      {loading && <p className="text-[#555555]">Loading...</p>}

      <section className="mb-12">
        <h2 className="text-sm tracking-[0.3em] uppercase text-[#555555] mb-6">Pending ({pending.length})</h2>
        {pending.length === 0 && <p className="text-[#333333] text-sm">No pending reviews.</p>}
        <div className="space-y-4">
          {pending.map((r) => (
            <div key={r.id} className="bg-[#0d0d0d] border border-[#1a1a1a] p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-white text-sm">{r.name} <span className="text-[#444444]">({r.email})</span></p>
                  <p className="text-yellow-400 text-xs">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => approve(r.id)} className="px-4 py-1.5 bg-white text-black text-xs tracking-widest uppercase hover:bg-[#e0e0e0] transition-colors">
                    Approve
                  </button>
                  <button onClick={() => deleteReview(r.id)} className="px-4 py-1.5 border border-[#333333] text-red-400 text-xs tracking-widest uppercase hover:border-red-400 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-[#888888] text-sm font-light">{r.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm tracking-[0.3em] uppercase text-[#555555] mb-6">Approved ({approved.length})</h2>
        <div className="space-y-3">
          {approved.map((r) => (
            <div key={r.id} className="bg-[#0a0a0a] border border-[#111111] p-4 flex justify-between items-center">
              <div>
                <p className="text-[#888888] text-sm">{r.name} · {"★".repeat(r.rating)}</p>
                <p className="text-[#444444] text-xs mt-1 font-light line-clamp-1">{r.body}</p>
              </div>
              <button onClick={() => deleteReview(r.id)} className="text-red-400/50 text-xs hover:text-red-400 transition-colors">
                Delete
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
