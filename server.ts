import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type, Schema } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.post('/api/analyze', async (req, res) => {
    try {
      const { decision, format } = req.body;

      if (!decision) {
        return res.status(400).json({ error: 'Decision prompt is required.' });
      }

      let formatPrompt = '';
      let formatSchema: Schema | undefined = undefined;

      if (format === 'pros-cons') {
        formatPrompt = 'Analyze the decision using a Pros and Cons format. Identify the main options implied by the decision. Provide a list of pros and cons for each option.';
        formatSchema = {
          type: Type.OBJECT,
          properties: {
             options: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
             },
             analysis: {
                type: Type.ARRAY,
                items: {
                   type: Type.OBJECT,
                   properties: {
                      optionName: { type: Type.STRING },
                      pros: { type: Type.ARRAY, items: { type: Type.STRING } },
                      cons: { type: Type.ARRAY, items: { type: Type.STRING } }
                   },
                   required: ['optionName', 'pros', 'cons']
                }
             }
          },
          required: ['options', 'analysis']
        };
      } else if (format === 'comparison') {
         formatPrompt = 'Analyze the decision using a Comparison Table format. Identify the main options implied by the decision. Compare them across relevant criteria.';
         formatSchema = {
            type: Type.OBJECT,
            properties: {
               options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
               },
               analysis: {
                  type: Type.OBJECT,
                  properties: {
                     items: {
                        type: Type.ARRAY,
                        items: {
                           type: Type.OBJECT,
                           properties: {
                              criterion: { type: Type.STRING },
                              details: {
                                 type: Type.ARRAY,
                                 items: {
                                    type: Type.OBJECT,
                                    properties: {
                                       optionName: { type: Type.STRING },
                                       detail: { type: Type.STRING }
                                    },
                                    required: ['optionName', 'detail']
                                 }
                              }
                           },
                           required: ['criterion', 'details']
                        }
                     }
                  },
                  required: ['items']
               }
            },
            required: ['options', 'analysis']
         };
      } else if (format === 'swot') {
         formatPrompt = 'Analyze the decision using a SWOT (Strengths, Weaknesses, Opportunities, Threats) format for each option.';
         formatSchema = {
            type: Type.OBJECT,
            properties: {
               options: { type: Type.ARRAY, items: { type: Type.STRING } },
               analysis: {
                  type: Type.ARRAY,
                  items: {
                     type: Type.OBJECT,
                     properties: {
                        optionName: { type: Type.STRING },
                        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                        opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
                        threats: { type: Type.ARRAY, items: { type: Type.STRING } }
                     },
                     required: ['optionName', 'strengths', 'weaknesses', 'opportunities', 'threats']
                  }
               }
            },
            required: ['options', 'analysis']
         };
      } else {
         return res.status(400).json({ error: 'Invalid format specified.' });
      }

      const prompt = `You are an expert decision-making tool. The user is trying to make the following decision:\n"${decision}"\n\n${formatPrompt}`;

      let response;
      let attempt = 0;
      let maxAttempts = 3;
      while (attempt < maxAttempts) {
        try {
          response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              responseSchema: formatSchema,
              temperature: 0.2,
            },
          });
          break; // success
        } catch (err: any) {
          attempt++;
          if (attempt >= maxAttempts) throw err;
          // Only retry on 503 or 429
          if (err?.status === 503 || err?.status === 429 || err?.message?.includes('503') || err?.message?.includes('429')) {
             console.log(`API Error (Attempt ${attempt}/${maxAttempts}). Retrying in 2 seconds...`);
             await new Promise(resolve => setTimeout(resolve, 2000));
          } else {
             throw err; // throw for other errors
          }
        }
      }

      if (!response) {
         throw new Error("No response returned from Gemini");
      }
      
      const text = response.text;
      if (!text) {
         throw new Error("No response returned from Gemini");
      }

      const result = JSON.parse(text);
      res.json(result);
    } catch (error: any) {
      console.error(error);
      
      let errorMsg = 'Failed to analyze decision.';
      if (error?.status === 503 || error?.message?.includes('503')) {
        errorMsg = 'Gemini AI is currently very busy. Please try again in a few moments.';
      } else if (error?.status === 429 || error?.message?.includes('429')) {
        errorMsg = 'Too many requests. Please try again later.';
      } else if (error?.message) {
        errorMsg = error.message;
      }
      
      res.status(500).json({ error: errorMsg });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
