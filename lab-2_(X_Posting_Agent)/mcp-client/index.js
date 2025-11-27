import dotenv from "dotenv"
import readline from "readline/promises"
import { GoogleGenAI } from "@google/genai"
import { Client } from "@modelcontextprotocol/sdk/client/index.js"
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js"
import { property, toLowerCase } from "zod"
dotenv.config()
const ai = new GoogleGenAI({
  apiKey: process.env.GEMENI_API_KEY,
})

console.log("The apiKey for llm is:", process.env.GEMENI_API_KEY)
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
    console.log("Available Tools are:", tools)
    chatLoop()
  })

async function chatLoop(toolCall) {
  while (true) {
    if (toolCall) {
      console.log("Calling Tool", toolCall.name)

      const toolOutCome = await mcpClient.callTool({
        name: toolCall.name,
        arguments: toolCall.args,
      })
      console.log("The Tool Result is:", toolOutCome)
      console.log("toolOutCome.content[0]-------", toolOutCome.content[0].text)
      chatHistory.push({
        role: "user",
        parts: [
          {
            text: toolOutCome.content[0].text,
            type: "text",
          },
        ],
      })
    } else {
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
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: chatHistory,
      config: {
        tools: [
          {
            functionDeclarations: tools,
          },
        ],
      },
    })
    const functionCall = response.candidates[0].content.parts[0].functionCall
    if (functionCall) {
      return chatLoop(functionCall)
    }
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
  }
}
