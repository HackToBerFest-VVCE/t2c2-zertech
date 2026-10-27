import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Server-side Gemini client
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  // Multi-turn Gemini Chat API endpoint
  app.post('/api/chat', async (req, res) => {
    try {
      const {
        messages,
        systemInstruction,
        model = 'gemini-3.8-flash',
      } = req.body;

      if (!ai) {
        // In case API key is not yet configured in environment
        return res.status(503).json({
          error:
            'Gemini API key is not configured. Please ensure GEMINI_API_KEY is set in your environment secrets.',
        });
      }

      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'Messages array is required.' });
      }

      // Format multi-turn conversation history for @google/genai SDK
      const contents = messages.map(
        (m: { role: 'user' | 'model'; text: string }) => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }],
        })
      );

      const defaultSystemInstruction = `You are "Rakshak AI", an expert personal safety and digital threat protection assistant built into the RAKSHA application.
Your core expertise includes:
1. Personal Physical Safety & Commuter Guidance in Mysuru, Karnataka (and other Indian cities). You know local landmarks: Sayyaji Rao Heritage Road, K.R. Circle, Mysuru Palace, Suburban Bus Stand, Chamundi Hill ascent, Gokulam, Jayalakshmipuram, Kuvempunagar, and KRS Road.
2. Verified Karnataka Emergency Helplines: 
   - 112 (Namma 112 Unified Police, Fire & Emergency Response)
   - 108 (Arogya Kavacha Ambulance)
   - 100 (City Police Control)
   - 1091 (Women Distress Helpline)
   - 1930 (National Cyber Crime & Financial Fraud Helpline - Golden Hour recovery)
3. Digital Threat & Scam Analysis: Spotting phishing URLs, APK malware links, electricity bill cutoff scams (BESCOM/CESC), bank KYC expiration fraud (SBI/HDFC), and high-reward prepayment task scams.
4. Crime-Risk Awareness: Highlighting night transit precautions (e.g., avoiding unlit alleys near Bamboo Bazar/Lashkar after 10 PM, sticking to illuminated arterial routes like Sayyaji Rao Road).

Tone: Calm, authoritative, empathetic, practical, and concise. Format critical emergency numbers or immediate safety steps clearly with bullet points.`;

      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction: systemInstruction || defaultSystemInstruction,
          temperature: 0.7,
        },
      });

      return res.json({ text: response.text });
    } catch (err: unknown) {
      console.error('Gemini Chat error:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown server error';
      return res.status(500).json({
        error: `Gemini API error: ${errorMessage}`,
      });
    }
  });

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Dev server or static files
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`RAKSHA Full-Stack Server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
