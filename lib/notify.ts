// Server-only. Optional owner alert via Resend's REST API (no SDK).
// Does nothing unless RESEND_API_KEY and OWNER_EMAIL are set. Never throws.
// Until the domain is verified in Resend, RESEND_FROM can stay unset: the default
// sender onboarding@resend.dev can only send to the Resend account's own email.

export async function notifyOwner(subject: string, text: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.OWNER_EMAIL;
  if (!apiKey || !to) return;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || "ReSub <onboarding@resend.dev>",
        to: [to],
        subject,
        text,
      }),
    });
    if (!res.ok) console.error("owner alert failed", res.status, await res.text());
  } catch (err) {
    console.error("owner alert failed", err);
  }
}
