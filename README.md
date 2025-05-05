<p align="center">
  <img src="public/logo-lime.png" alt="Cambrian AI Assistant" width="200"/>
</p>

# Cambrian SEI AI Agent

A chat interface for interacting with an AI assistant that can communicate with the Sei blockchain.

## Getting Started

### Prerequisites

- Node.js 16+
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/chatbot-interface.git
   cd chatbot-interface
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file
   ```bash
   cp .env.example .env
   ```
   Modify the .env file adding your Sei wallet 0x private key, your OpenAI api key and the relevant Sei RPC (you can use the default value)


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

## Additional Information
For more details on the available features, visit our [website](https://www.cambrian.wtf/) or the [official Sei Agent Kit repository](https://github.com/CambrianAgents/sei-agent-kit).

## Contact
Follow us on [X](https://x.com/cambrian_ai)
