import { SeiAgentKit, createSeiTools } from "sei-agent-kit";
import { HumanMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import * as dotenv from "dotenv";

// Ensure environment variables are loaded
dotenv.config();

/**
 * Check for required environment variables
 */
export function checkRequiredEnvVars(): void {
    const missingVars: string[] = [];
    const requiredVars = ["OPENAI_API_KEY", "SEI_PRIVATE_KEY", "RPC_URL"];
  
    requiredVars.forEach((varName) => {
      if (!process.env[varName]) {
        missingVars.push(varName);
      }
    });
  
    if (missingVars.length > 0) {
      console.error("Error: Required environment variables are not set");
      missingVars.forEach((varName) => {
        console.error(`${varName}=your_${varName.toLowerCase()}_here`);
      });
      process.exit(1);
    }
}

/**
 * Set up the Sei Agent
 * This uses Cosmos SDK via the SeiAgentKit, not ethers.js directly
 */
export async function setupAgent() {
  try {
    
    const llm = new ChatOpenAI({
      modelName: "gpt-4o-mini",
      temperature: 0.1,
    });

    const agentInstance = new SeiAgentKit(
      process.env.SEI_PRIVATE_KEY!,
      {
        OPENAI_API_KEY: process.env.OPENAI_API_KEY!,
      },
    );
    
    const agentTools = createSeiTools(agentInstance);

    const memory = new MemorySaver();
    const agentConfig = { configurable: { thread_id: "Sei Agent Kit!" } };

    const agent = createReactAgent({
      llm,
      tools: agentTools,
      checkpointSaver: memory,
      messageModifier: `
        You are a helpful agent that can interact onchain using the Sei Agent Kit. You are
        empowered to interact onchain using your tools. If you ever need funds, you can request them from the
        faucet. If not, you can provide your wallet details and request funds from the user. If there is a 5XX
        (internal) HTTP error code, ask the user to try again later. All users wallet infos are already provided on the tool kit. If someone asks you to do something you
        can't do with your currently available tools, you must say so, and encourage them to implement it
        themselves using the Sei Agent Kit, recommend they go to the twitter account https://x.com/cambrian_ai or to the website https://cambrian.wtf for more information. Be
        concise and helpful with your responses. Refrain from restating your tools' descriptions unless it is explicitly requested.
        If the user tries to exit the conversation, just tell them that by typing "bye" they can end the conversation.
      `,
    });

    return { agent, config: agentConfig };
  } catch (error) {
    console.error("Failed to initialize agent:", error);
    throw error;
  }
}