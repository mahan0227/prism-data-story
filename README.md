# Prism Data Story

Turn **metrics, CSV snippets, or analytical notes** into a defensible narrative: headline, storyline beats, chart blueprints, anomalies, and ethics / limits on what the data can claim. **BYO OpenAI API key.**

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · OpenAI Chat Completions (JSON mode)

## Run locally

```bash
npm install
npm run dev
```

## API

`POST /api/story` · Header `Authorization: Bearer <key>`

Body: `data`, optional `audience`, optional `angle`, optional `model`.

## License

MIT
