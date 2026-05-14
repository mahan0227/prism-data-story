# Prism Data Story

Turn **metrics, CSV snippets, or analytical notes** into a **defensible narrative**: headline, storyline beats, chart blueprints, anomalies, exec takeaway, social snippets, and **ethics / limits** on what the data can claim.

## What it is

A BYOK Next.js app for **data storytelling with guardrails**. It helps you communicate insights without overfitting a story to noise—explicitly lists what you cannot claim from the slice provided.

## Why it’s useful

- Accelerates **board decks**, **investor updates**, and **public posts** from the same source numbers.
- Suggests **chart types** tied to axes—reduces misleading viz choices.
- Surfaces **anomalies** worth investigating before you publish.
- Gives **multi-channel snippets** (LinkedIn / Instagram / X) from one analysis pass.

## Where you can use it

- **Growth & product analytics** — weekly metrics reviews.
- **Data journalism** — first draft structure before fact-checking.
- **Customer success** — health-score narratives for QBRs.
- **Nonprofits** — impact reporting with honest caveats.

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · OpenAI Chat Completions (JSON mode)

## Run locally

```bash
npm install
npm run dev
```

## Production check

```bash
npm run build
npm run start
```

## API

`POST /api/story` · Header `Authorization: Bearer <key>`

Body: `data` (required), optional `audience`, `angle`, `model`.

## Suite brochure

[`docs/neuron-suite-brochure.html`](docs/neuron-suite-brochure.html) · [`docs/neuron-suite-ig-square.svg`](docs/neuron-suite-ig-square.svg)

## License

MIT
