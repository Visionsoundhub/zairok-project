// POST /api/subscribe { name, email }
// Γράφει το email στο Resend (λογαριασμός Zairok). Αν δεν έχει μπει ακόμα κλειδί
// στο Cloudflare, το στέλνει στο παλιό MailerLite για να μη χαθεί κανένας.
// GET /api/subscribe → έλεγχος για το Κέντρο (δεν γράφει τίποτα).

const ML_URL = 'https://assets.mailerlite.com/jsonp/2113368/forms/179335714605893061/subscribe';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Μη έγκυρο αίτημα.' }, 400);
  }
  const email = String(body.email || '').trim().toLowerCase();
  const name = String(body.name || '').trim().slice(0, 80);
  if (!EMAIL_RE.test(email)) return json({ error: 'Το email δεν είναι σωστό.' }, 400);

  // Χωρίς κλειδί: προσωρινά στο MailerLite
  if (!env.RESEND_API_KEY) {
    const form = new URLSearchParams({ 'fields[email]': email, 'fields[name]': name, 'ml-submit': '1', anticsrf: 'true' });
    const r = await fetch(ML_URL, { method: 'POST', body: form });
    const d = await r.json().catch(() => ({}));
    return d.success ? json({ success: true, via: 'mailerlite' }) : json({ error: 'Αποτυχία εγγραφής.' }, 502);
  }

  const url = env.RESEND_AUDIENCE_ID
    ? `https://api.resend.com/audiences/${env.RESEND_AUDIENCE_ID}/contacts`
    : 'https://api.resend.com/contacts';
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, first_name: name || undefined, unsubscribed: false }),
  });
  if (!res.ok) {
    const t = await res.text();
    if (res.status === 409 || /already exists/i.test(t)) return json({ success: true, already: true });
    return json({ error: 'Αποτυχία εγγραφής.' }, 502);
  }
  return json({ success: true });
}

export async function onRequestGet({ env }) {
  return json({ ok: true, key: Boolean(env.RESEND_API_KEY), audience: Boolean(env.RESEND_AUDIENCE_ID) });
}
