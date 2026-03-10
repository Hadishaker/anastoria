import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function getResend() {
  return new Resend(process.env.RESEND_API_KEY!);
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const supabase = getSupabase();

    // Check for duplicate
    const { data: existing } = await supabase
      .from("newsletter_subscribers")
      .select("id")
      .eq("email", email)
      .single();

    if (existing) {
      return NextResponse.json({ error: "You're already subscribed." }, { status: 409 });
    }

    // Insert subscriber
    const { error: insertError } = await supabase
      .from("newsletter_subscribers")
      .insert({ email });

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      return NextResponse.json({ error: "Failed to subscribe." }, { status: 500 });
    }

    // Send welcome email via Resend
    const { error: emailError } = await getResend().emails.send({
      from: "Anastoria <hello@anastoria.com>",
      to: [email],
      subject: "Welcome to Anastoria",
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
        <body style="margin:0;padding:0;background:#080808;font-family:Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#080808;padding:40px 20px;">
            <tr>
              <td align="center">
                <table width="560" cellpadding="0" cellspacing="0" style="background:#111111;border:1px solid #222222;max-width:560px;width:100%;">
                  <tr>
                    <td style="padding:48px 40px;text-align:center;">
                      <p style="color:#555;font-size:11px;letter-spacing:4px;text-transform:uppercase;margin:0 0 16px;">Welcome to</p>
                      <h1 style="color:#ffffff;font-size:32px;font-weight:300;letter-spacing:8px;text-transform:uppercase;margin:0 0 32px;">Anastoria</h1>
                      <p style="color:#666;font-size:14px;line-height:1.8;margin:0 0 32px;">
                        You're now on the list. You'll be the first to know about new drops,
                        restocks, and everything happening behind the scenes.
                      </p>
                      <a href="https://anastoria.com/shop" style="display:inline-block;background:#ffffff;color:#000000;text-decoration:none;padding:14px 32px;font-size:11px;letter-spacing:4px;text-transform:uppercase;font-weight:500;">
                        Shop Now
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:20px 40px;border-top:1px solid #1a1a1a;text-align:center;">
                      <p style="color:#333;font-size:11px;margin:0;">© ${new Date().getFullYear()} Anastoria · anastoria.com</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    if (emailError) {
      console.error("Resend error:", emailError);
      // Don't fail — subscriber was saved, email is a nice-to-have
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Newsletter route error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
