import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") ?? "Brainwave Maths <onboarding@resend.dev>";
const ADMIN_EMAIL = "ofoeraphael2010@gmail.com";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return json({ error: "Method not allowed" }, 405);
    }

    const { email, username, firstName, lastName, role, programme, yearId } = await req.json();
    if (!email) {
      return json({ error: "Missing 'email'." }, 400);
    }

    if (!RESEND_API_KEY) {
      return json({ notified: false, reason: "RESEND_API_KEY not configured" }, 200);
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: `New signup: ${firstName || username || email}`,
        html: renderEmail(email, username, firstName, lastName, role, programme, yearId),
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      return json({ notified: false, error: detail }, 502);
    }

    return json({ notified: true }, 200);
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

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderEmail(
  email: string,
  username: string,
  firstName: string,
  lastName: string,
  role: string,
  programme: string,
  yearId: string,
): string {
  const rows: [string, string][] = [
    ["Name", [firstName, lastName].filter(Boolean).join(" ") || "-"],
    ["Username", username || "-"],
    ["Email", email],
    ["Role", role || "-"],
    ["Programme", programme || "-"],
    ["Year", yearId || "-"],
  ];
  const rowsHtml = rows
    .map(
      ([k, v]) =>
        `<p style="color:#ffffff;font-size:15px;margin:6px 0;"><strong style="color:#f5c842;">${escapeHtml(k)}:</strong> ${escapeHtml(v)}</p>`,
    )
    .join("");

  return `<!doctype html>
<html>
  <body style="font-family: 'Segoe UI', Arial, sans-serif; background:#1a0b2e; margin:0; padding:24px;">
    <div style="max-width:560px; margin:0 auto; background:#2d1b4e; border:1px solid #4a3380; border-radius:16px; padding:32px;">
      <div style="text-align:center; margin-bottom:24px;">
        <h1 style="color:#f5c842; font-size:22px; margin:0;">Brainwave Science &amp; Maths</h1>
        <p style="color:#c9b8e8; font-size:13px; margin:4px 0 0;">A new account was just created</p>
      </div>
      ${rowsHtml}
      <hr style="border:none; border-top:1px solid #4a3380; margin:24px 0;" />
      <p style="color:#9a85c4; font-size:12px;">This is an automated one-time notification sent when a student signs up.</p>
    </div>
  </body>
</html>`;
}
