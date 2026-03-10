import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("product_id");

  if (!productId) {
    return NextResponse.json({ error: "product_id required" }, { status: 400 });
  }

  const { data, error } = await getSupabase()
    .from("reviews")
    .select("id, name, rating, body, created_at")
    .eq("product_id", productId)
    .eq("approved", true)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Failed to load reviews." }, { status: 500 });
  }

  return NextResponse.json({ reviews: data });
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, rating, body, product_id } = await req.json();

    if (!name || !email || !rating || !body || !product_id) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5." }, { status: 400 });
    }

    const { error: insertError } = await getSupabase().from("reviews").insert({
      name: String(name).slice(0, 100),
      email: String(email).slice(0, 255),
      rating: Number(rating),
      body: String(body).slice(0, 2000),
      product_id: String(product_id).slice(0, 100),
      approved: false,
    });

    if (insertError) {
      console.error("Review insert error:", insertError);
      return NextResponse.json({ error: "Failed to submit review." }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("Reviews POST error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
