<p align="center">
  <img src="public/full-logo-lime.png" alt="Cambrian AI Assistant" width="800"/>
</p>

# Cambrian SEI AI Agent

A chat interface for interacting with an AI assistant that can communicate with the Sei blockchain.

## Getting Started

### 🚀 Quick Start (Recommended for Non-Developers)

**One-click setup!** Just run this single command and everything will be set up automatically:

1. Clone the repo
 ```bash
   git clone https://github.com/CambrianAgents/agent-launcher
   cd agent-launcher
   ```

2. Run the script and follow the few steps requested
```bash
./install-and-run.sh
```

This script will:
- ✅ Check and install Node.js (if needed)
- 📦 Install all dependencies
- 🔧 Guide you through environment setup
- 🚀 Start the development server

### 🛠️ Manual Installation (For Developers)

#### Prerequisites

- Node.js 16+
- npm

#### Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/CambrianAgents/agent-launcher
   cd agent-launcher
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   ./setup-env.sh
   ```
   This interactive script will guide you through setting up your:
   - OpenAI API key
   - Sei wallet private key
   - RPC URL (defaults to https://evm-rpc.sei-apis.com)

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

The chat interface provides a simple way to interact with the Cambrian AI Assistant. Simply type your question or request in the input field and press enter or click the send button. The AI will process your message and respond in real-time.

Example queries:
- "How can I interact with the Sei blockchain?"
- "How much sei do I own?"
- "Swap 5 sei for USDC."
- "Stake 3 sei."

## Scripts Overview

| Script | Purpose | When to Use |
|--------|---------|-------------|
| `./install-and-run.sh` | Complete setup and launch | First time setup, non-developers |
| `./setup-env.sh` | Environment variable setup only | Updating API keys, manual setup |

## Troubleshooting

### Common Issues

**"Node.js not found" error:**
- The install script will automatically install Node.js for you
- If manual installation is needed, visit [nodejs.org](https://nodejs.org)

**"Permission denied" error:**
- Make sure the scripts are executable: `chmod +x *.sh`

**Environment variables not working:**
- Re-run the environment setup: `./setup-env.sh`
- Check that your `.env` file exists and contains the required variables

**Port 3000 already in use:**
- Stop other applications using port 3000, or
- The app will automatically try the next available port

## Additional Information
For more details on the available features, visit our [website](https://www.cambrian.wtf/) or the [official Sei Agent Kit repository](https://github.com/CambrianAgents/sei-agent-kit).

## Contact
Follow us on [X](https://x.com/cambrian_ai)

# Sei Agent Deployment

## Quick Deployment

### Deploy on Vercel (Recommended)

The easiest way to deploy this agent is using [Vercel](https://vercel.com):

1. Push your code to a GitHub repository
2. Go to [Vercel](https://vercel.com) and sign up or log in
3. Click "Add New Project" and import your GitHub repository
4. Configure the following environment variables:
   - `OPENAI_API_KEY`
   - `SEI_PRIVATE_KEY`
   - `RPC_URL`
5. Click "Deploy"

### Alternative: Deploy on Netlify

1. Push your code to a GitHub repository
2. Go to [Netlify](https://netlify.com) and sign up or log in
3. Click "Add new site" → "Import an existing project"
4. Connect to your GitHub repository
5. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Add the environment variables in the site settings
7. Deploy the site

## Environment Setup

Before deploying, make sure you have the following environment variables set:

```
OPENAI_API_KEY=your_openai_api_key
SEI_PRIVATE_KEY=your_sei_private_key
RPC_URL=your_rpc_url
```

## Local Development

To run the agent locally:

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your agent in action.
