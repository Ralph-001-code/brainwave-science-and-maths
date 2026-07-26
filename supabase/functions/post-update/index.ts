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
const ADMIN_EMAIL = "ofoeraphael2010@gmail.com";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace("Bearer ", "").trim();
    if (!token) {
      return json({ error: "Not authorized. Please sign in as the site owner." }, 401);
    }

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { persistSession: false } });
    const { data: userInfo, error: userErr } = await admin.auth.getUser(token);
    if (userErr || !userInfo?.user) {
      return json({ error: "Could not verify your account." }, 401);
    }
    if (userInfo.user.email !== ADMIN_EMAIL) {
      return json({ error: "Only the site owner can manage updates." }, 403);
    }

    // GET: list all updates (for the admin's manage panel)
    if (req.method === "GET") {
      const { data, error } = await admin
        .from("site_updates")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) return json({ error: error.message }, 500);
      return json({ updates: data }, 200);
    }

    // DELETE: remove an update by id
    if (req.method === "DELETE") {
      const { id } = await req.json();
      if (!id) return json({ error: "Missing 'id'." }, 400);
      const { error } = await admin.from("site_updates").delete().eq("id", id);
      if (error) return json({ error: error.message }, 500);
      return json({ deleted: true }, 200);
    }

    // PUT: edit an existing update's title/body
    if (req.method === "PUT") {
      const { id, title, body } = await req.json();
      if (!id || !title || !body) return json({ error: "Missing 'id', 'title' or 'body'." }, 400);
      const { error } = await admin.from("site_updates").update({ title, body }).eq("id", id);
      if (error) return json({ error: error.message }, 500);
      return json({ updated: true }, 200);
    }

    if (req.method !== "POST") {
      return json({ error: "Method not allowed" }, 405);
    }

    // POST: create a new update + auto-email subscribers
    const { title, body, email } = await req.json();
    if (!title || !body) {
      return json({ error: "Missing 'title' or 'body'." }, 400);
    }
    const sendEmail = email !== false;

    const { error: insertErr } = await admin.from("site_updates").insert({ title, body });
    if (insertErr) {
      return json({ error: `Could not save update: ${insertErr.message}` }, 500);
    }

    if (!sendEmail) {
      return json({ posted: true, emailed: false, sent: 0 }, 200);
    }

    if (!RESEND_API_KEY) {
      return json({
        posted: true,
        emailed: false,
        warning: "Update posted to the dashboard, but emails were not sent because RESEND_API_KEY is not configured.",
      }, 200);
    }

    const { data: rows, error: dbErr } = await admin.rpc("get_subscribed_emails");
    if (dbErr) {
      return json({ posted: true, emailed: false, error: `Update posted, but couldn't load subscribers: ${dbErr.message}` }, 500);
    }

    const emails: string[] = (rows ?? []).map((r: any) => r.email).filter(Boolean);
    if (emails.length === 0) {
      return json({ posted: true, emailed: true, sent: 0, message: "Update posted. No students are subscribed to email updates yet." }, 200);
    }

    let sent = 0;
    for (const to of emails) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to,
          subject: title,
          html: renderEmail(title, body),
        }),
      });
      if (res.ok) sent++;
    }

    return json({ posted: true, emailed: true, sent, attempted: emails.length }, 200);
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
        <p style="color:#c9b8e8; font-size:13px; margin:4px 0 0;">New update for you</p>
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
