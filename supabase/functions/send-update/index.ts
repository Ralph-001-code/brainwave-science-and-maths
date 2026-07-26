import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") ?? "Brainwave Maths <onboarding@resend.dev>";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return json({ error: "Method not allowed" }, 405);
    }

    const { subject, body } = await req.json();
    if (!subject || !body) {
      return json({ error: "Missing 'subject' or 'body'." }, 400);
    }

    if (!RESEND_API_KEY) {
      return json({
        error: "Email sending is not configured yet. The RESEND_API_KEY secret must be set on the project before emails can be sent.",
      }, 503);
    }

    // Use service role to read all subscribed students' emails.
    // RLS would block the anon key from reading other users' emails.
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { persistSession: false } });

    // Join profiles (email_updates = true) to auth.users to get emails.
    // auth.users is not exposed via the REST API, so we read via SQL.
    const { data: rows, error: dbErr } = await admin.rpc("get_subscribed_emails");
    if (dbErr) {
      return json({ error: `Database error: ${dbErr.message}` }, 500);
    }

    const emails: string[] = (rows ?? []).map((r: any) => r.email).filter(Boolean);
    if (emails.length === 0) {
      return json({ sent: 0, message: "No students are subscribed to email updates yet." }, 200);
    }

    // Send via Resend. We send one email per recipient (BCC would also work,
    // but per-recipient keeps each student's email private).
    let sent = 0;
    const failures: string[] = [];
    for (const email of emails) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: email,
          subject,
          html: renderEmail(subject, body),
        }),
      });
      if (res.ok) sent++;
      else failures.push(email);
    }

    return json({
      sent,
      attempted: emails.length,
      failed: failures.length,
    }, 200);
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

function renderEmail(subject: string, body: string): string {
  return `<!doctype html>
<html>
  <body style="font-family: 'Segoe UI', Arial, sans-serif; background:#1a0b2e; margin:0; padding:24px;">
    <div style="max-width:560px; margin:0 auto; background:#2d1b4e; border:1px solid #4a3380; border-radius:16px; padding:32px;">
      <div style="text-align:center; margin-bottom:24px;">
        <h1 style="color:#f5c842; font-size:22px; margin:0;">Brainwave Science &amp; Maths</h1>
        <p style="color:#c9b8e8; font-size:13px; margin:4px 0 0;">Learn, Practice &amp; Master</p>
      </div>
      <h2 style="color:#ffffff; font-size:20px;">${escapeHtml(subject)}</h2>
      <p style="color:#c9b8e8; font-size:15px; line-height:1.6; white-space:pre-line;">${escapeHtml(body)}</p>
      <hr style="border:none; border-top:1px solid #4a3380; margin:24px 0;" />
      <p style="color:#9a85c4; font-size:12px;">You're receiving this because you opted in to email updates on Brainwave Science &amp; Maths. Sign in to your account to change your preferences.</p>
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
