import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") ?? "Brainwave Maths <onboarding@resend.dev>";
const CREATOR_EMAIL = "ofoeraphael2010@gmail.com";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return json({ error: "Method not allowed" }, 405);
    }

    const { name, email, message } = await req.json();
    if (!name || !email || !message) {
      return json({ error: "Missing 'name', 'email', or 'message'." }, 400);
    }

    if (!RESEND_API_KEY) {
      return json({
        error: "Email sending is not configured yet. The RESEND_API_KEY secret must be set on the project before emails can be sent.",
      }, 503);
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: CREATOR_EMAIL,
        reply_to: email,
        subject: `Contact form: ${name}`,
        html: renderEmail(name, email, message),
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      return json({ error: `Email send failed: ${detail}` }, 502);
    }

    return json({ sent: true }, 200);
  } catch (err) {
    return json({ error: (err as Error).message }, 500);
  }
});

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function renderEmail(name: string, email: string, message: string): string {
  return `<!doctype html>
<html>
  <body style="font-family: 'Segoe UI', Arial, sans-serif; background:#1a0b2e; margin:0; padding:24px;">
    <div style="max-width:560px; margin:0 auto; background:#2d1b4e; border:1px solid #4a3380; border-radius:16px; padding:32px;">
      <div style="text-align:center; margin-bottom:24px;">
        <h1 style="color:#f5c842; font-size:22px; margin:0;">Brainwave Science &amp; Maths</h1>
        <p style="color:#c9b8e8; font-size:13px; margin:4px 0 0;">New contact form message</p>
      </div>
      <p style="color:#ffffff; font-size:15px;"><strong>From:</strong> ${escapeHtml(name)}</p>
      <p style="color:#ffffff; font-size:15px;"><strong>Email:</strong> ${escapeHtml(email)}</p>
      <hr style="border:none; border-top:1px solid #4a3380; margin:16px 0;" />
      <p style="color:#c9b8e8; font-size:15px; line-height:1.6; white-space:pre-line;">${escapeHtml(message)}</p>
      <hr style="border:none; border-top:1px solid #4a3380; margin:24px 0;" />
      <p style="color:#9a85c4; font-size:12px;">Reply directly to this email to respond to ${escapeHtml(name)}.</p>
    </div>
  </body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
