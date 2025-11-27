import dotenv from "dotenv"
import readline from "readline/promises"
import { GoogleGenAI } from "@google/genai"
import { Client } from "@modelcontextprotocol/sdk/client/index.js"
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js"
import { property, toLowerCase } from "zod"
dotenv.config()
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_KEY,
})

const mcpClient = new Client({
  name: "mcp-client-x",
  version: "1.0.0",
})
let tools = []
const chatHistory = []
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

mcpClient
  .connect(
    new StreamableHTTPClientTransport(new URL("http://localhost:3000/mcp"))
  )
  .then(async () => {
    console.log("CONNECTION ESTABLISHED BETWEEN MCP_SERVER AND CLIENT.")

    tools = (await mcpClient.listTools()).tools.map((tool) => {
      return {
        name: tool.name,
        description: tool.description,
        parameters: {
          type: tool.inputSchema.type,
          properties: tool.inputSchema.properties,
          required: tool.inputSchema.required,
        },
      }
    })
    // tools.append(toolsFromServer)
    chatLoop()
    console.log("Available Tools are:", tools)
  })

async function chatLoop() {
  const question = await rl.question("Ask: ")

  chatHistory.push({
    role: "user",
    parts: [
      {
        text: question,
        type: "text",
      },
    ],
  })
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    content: chatHistory,
    config: {
      tools: [
        {
          functionDeclarations: tools,
        },
      ],
    },
  })

  const responseText = response.candidates[0].content.parts[0].text
  chatHistory.push({
    role: "model",
    parts: [
      {
        text: responseText,
        type: "text",
      },
    ],
  })
  console.log(`LLM: ${responseText}`)
  chatLoop()
}
