import { NextResponse } from 'next/server';
import { setupAgent, checkRequiredEnvVars } from '@/lib/agent';
import { HumanMessage } from "@langchain/core/messages";
import * as dotenv from "dotenv";

dotenv.config();

// Store the agent instance globally to reuse it
let agentInstance: any = null;
let agentConfig: any = null;
let isAgentInitialized = false;

// Initialize the agent if not already done
async function getAgent() {
  if (!agentInstance) {
    try {
      checkRequiredEnvVars();
      
      const { agent, config } = await setupAgent();
      agentInstance = agent;
      agentConfig = config;
      isAgentInitialized = true;
    } catch (error) {
      console.error('Failed to initialize agent:', error);
      throw error;
    }
  }
  return { agent: agentInstance, config: agentConfig, isInitialized: isAgentInitialized };
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    // Get the latest user message
    const latestMessage = messages[messages.length - 1].content;
    
    // Initialize agent if needed
    try {
      const { agent, config, isInitialized } = await getAgent();
      if (!isInitialized) {
        throw new Error('Agent initialization failed');
      }
      
      // Create a ReadableStream to stream the response
      const stream = new ReadableStream({
        async start(controller) {
          try {
            // Call the agent with the user message
            const responseStream = await agent.stream(
              { messages: [new HumanMessage(latestMessage)] },
              config
            );
            
            // Process each chunk from the agent response
            for await (const responseChunk of responseStream) {
              let content = '';
              
              if ("agent" in responseChunk) {
                content = responseChunk.agent.messages[0].content;
              } 
              // else if ("tools" in responseChunk) {
              //   content = responseChunk.tools.messages[0].content;
              // }
              if (content) {
                const encoder = new TextEncoder();
                const chunk = encoder.encode(JSON.stringify({
                  type: 'text',
                  text: content
                }) + '\n');
                controller.enqueue(chunk);
              }
            }
            controller.close();
          } catch (error) {
            console.error('Error in stream:', error);
            controller.error(error);
          }
        }
      });
      
      return new NextResponse(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } catch (error) {
      console.error('Agent error:', error);
      
      // Return a fallback response if agent fails
      return NextResponse.json(
        { 
          error: 'Agent initialization failed',
          message: 'The Sei Agent could not be initialized due to missing dependencies or environment variables. Please check the server logs for more details.' 
        },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('Error processing chat request:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}
