# TRADEWISE

TRADEWISE is a production-ready Next.js 14 dashboard for astro-financial trading intelligence focused on Indian markets.

The backend uses:

- OpenRouter for model inference
- Exa for live web search context

## Setup

1. Clone the repository.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env.local` and add your server-side API keys and selected model:

   ```env
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   OPENROUTER_MODEL=your_openrouter_model_id_here
   EXA_API_KEY=your_exa_api_key_here
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

## Deployment

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Add `OPENROUTER_API_KEY`, `OPENROUTER_MODEL`, and `EXA_API_KEY` in the Vercel project environment variables.
4. Deploy with the default Vercel settings.
