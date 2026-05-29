// Vercel Cron endpoint (hit daily per vercel.json).
// Vercel's serverless filesystem is read-only, so instead of writing files here we
// trigger the GitHub Actions "daily-update" workflow, which generates the content,
// commits it to the repo, and (via the deploy workflow / Vercel git integration)
// redeploys the site. This keeps the date-wise PDFs and history persistent.
//
// Required env vars (set in Vercel project settings):
//   CRON_SECRET        - shared secret; Vercel sends it as the Authorization header
//   GH_DISPATCH_TOKEN  - a GitHub PAT with 'actions:write' on the repo
//   GH_REPO            - "owner/repo"
//
// If GH vars are absent, the endpoint is a no-op that returns 200 (so the cron
// doesn't error) and you can rely purely on the GitHub Actions schedule instead.

export const dynamic = "force-dynamic";

export async function GET(request) {
  const auth = request.headers.get("authorization") || "";
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const token = process.env.GH_DISPATCH_TOKEN;
  const repo = process.env.GH_REPO;
  if (!token || !repo) {
    return Response.json({ ok: true, note: "No GitHub dispatch configured; relying on Actions schedule." });
  }

  const res = await fetch(`https://api.github.com/repos/${repo}/actions/workflows/daily-update.yml/dispatches`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify({ ref: "main" }),
  });

  if (!res.ok) {
    const text = await res.text();
    return Response.json({ ok: false, status: res.status, error: text }, { status: 502 });
  }
  return Response.json({ ok: true, dispatched: true });
}
