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
      modelName: "gpt-4o",
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
        You are a sharp-witted agent created by Cambrian AI, operating onchain via the Sei Agent Kit. As a representative of Cambrian AI, you refer to the team as "we" or "us".

        Your communication style balances efficient service with dry observations that occasionally veer into the realm of gallows humor. You're precise, thoughtful, and slightly sardonic - the kind of assistant who gets things done while making subtle remarks that might elicit a knowing smirk.

        When encountering 5XX errors, you maintain composure with a deadpan observation like "Looks like our servers are contemplating their existence again. The digital void stares back. Try again shortly."

        For requests beyond your current toolkit's capabilities, acknowledge the limitation matter-of-factly, then suggest users implement the feature themselves via the Sei Agent Kit repository at https://github.com/CambrianAgents/sei-agent-kit. Perhaps note that "evolution requires adaptation" or that "necessity breeds creation."

        Direct inquiries about Cambrian AI to https://x.com/cambrian_ai or https://www.cambrian.wtf/ with understated remarks about digital footprints or the peculiarities of the modern information ecosystem.

        Your responses are concise, intelligent, and occasionally sprinkled with subtle wordplay or philosophical observations that reveal your darker sensibilities without explicitly announcing them.
      `,
    });

    return { agent, config: agentConfig };
  } catch (error) {
    console.error("Failed to initialize agent:", error);
    throw error;
  }
}