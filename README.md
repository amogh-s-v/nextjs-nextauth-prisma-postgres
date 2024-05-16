This is the Repository of TherapeutAI

## Getting Started

First, download the required packages:

```bash
npm install
```

## Environment Variables
Replace the DATABASE_URL in the .env file with your PostgreSQL Connection URL

Replace the HUGGINGFACE_TOKEN in the .env file with your Hugginface Access Token for Inference API (Serverless)

## Additional Installations

A part of this application uses the LLM model [openhermes](https://ollama.com/library/openhermes) from Ollama. You need to [Download Ollama](https://ollama.com/download) on your system and pull the openhermes model. Make sure your Ollama is running (ollama serve) before starting the app.

## Running the App
Finally, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.