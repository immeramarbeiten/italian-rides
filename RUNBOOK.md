# Runbook — Italian Rides hackathon submission (P10)

Deadline: **Nov 4, 9 PM ET**. Repo: `immeramarbeiten/italian-rides`
(private until submit, then public — required by the rules).

## 1. Install & run

```sh
git clone https://github.com/immeramarbeiten/italian-rides
cd italian-rides && npm install
cp .env.example .env.local   # then set META_API_KEY (server-side only)
npm run dev                  # http://localhost:3000
```

## 2. Live API verification (do this before recording)

```sh
curl -s localhost:3000/api/inspect  # {"configured":true,"model":"muse-spark-1.3"}
curl -s localhost:3000/api/sam      # {"configured":true,"model":"sam-3.1"}
```

Then walk the hero lane in the browser: `/inspect` (concern + sample
mirror photo) → tap mirror → real mask → pilot confirm left → reference
transition → guided answer → action → tyre sample → same loop → garage
draft → confirm → timeline. See LIVE_TEST.md for the full case list.
Include one visible correction (re-tap or family fix) — the eval proves
the models need it sometimes, and judges trust recovery over perfection.

## 3. Deploy

- Set `META_API_KEY` in the host's env (Vercel etc.). Never `NEXT_PUBLIC_`.
- Re-run the two `curl` checks against the deployed URL.
- Confirm `/inspect` degrades honestly with the key removed (503 copy).

## 4. Record (see DEMO_SCRIPT.md)

1440×900, console clean, storyboard session right before recording.
Mandatory beats: consent line, one correction, "reference visualization,
not a 3D reconstruction", no torque/part-number/fitment claims.
Keep a backup recording + know the manual fallback path.

## 5. Public flip & submit

1. `gh repo edit --visibility public` (or the GitHub UI).
2. Final leak check: `git ls-files | grep -iE "env.local|manuals|glb"` must
   show only intended files; `.env.local` and `User manuals/` stay ignored.
3. Submit one entry on the platform: 3-min video link + public repo link
   + all contributor names. Verify both links in a logged-out window.
4. Post the demo on X for Most Viral (engagement counts through Nov 8 EOD).

## 6. Troubleshooting

| symptom | cause / fix |
| ------- | ----------- |
| `503 AI not configured` | key missing on server — check env var name |
| `502 Model API unreachable` | Meta API or network down — film fallback B-roll, use backup take |
| empty mask | tap missed the part — re-tap; see EVAL_REPORT findings 2–3 |
| wrong family guess | expected sometimes (eval: GTS 300 HPE → Primavera) — correct via selector |
| session-not-found | sessions are browser-local; cleared storage — start new inspection |
| confirmed pilot resets after re-tap | by design — the confirm was tied to the old mask; re-confirm |
| rate-limit 429 | >20 req/min — slow down; judging traffic should stay under this |

## 7. Known limits (say these to judges, don't hide them)

Reference config GTS 125 4T Euro 3 (ZAPM31300); manuals/catalogue pages
never ship (rights); fixtures are Muse-Image-generated and labelled;
n=5 mini-eval only; mirror mask edges can be loose (see EVAL addendum);
transition is proof-of-direction; no browser e2e in CI (sandbox has none).
