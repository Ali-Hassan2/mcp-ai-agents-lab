import dotenv from "dotenv"
import readline from "readline/promises"
import { GoogleGenAI } from "@google/genai"
import { Client } from "@modelcontextprotocol/sdk/client/index.js"
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js"
import { property, toLowerCase } from "zod"
import { ServerURL } from "./constants"
dotenv.config()

const ai = new GoogleGenAI({
  apiKey: process.env.GEMENI_API_KEY,
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
    new StreamableHTTPClientTransport(new URL(ServerURL))
  )
  .then(async () => {
    console.log("CONNECTION ESTABLISHED BETWEEN MCP_SERVER AND CLIENT.")

    tools = (await mcpClient.listTools()).tools.map((tool) => {
      console.log("Avaiable tools: ", tools)
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
  })

async function chatLoop() {
  let pendingFunctionCall = null
  while (true) {
    if (pendingFunctionCall) {
      const toolOutCome = await mcpClient.callTool({
        name: pendingFunctionCall.name,
        arguments: pendingFunctionCall.args,
      })
      console.log("The Tool Result is:", toolOutCome.content[0].text)
      chatHistory.push({
        role: "model",
        parts: [{ text: toolOutCome.content[0].text, type: "text" }],
      })
      pendingFunctionCall = null
    } else {
      const question = await rl.question("Ask: ")
      chatHistory.push({
        role: "user",
        parts: [{ text: question, type: "text" }],
      })
    }
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: chatHistory,
      config: { tools: [{ functionDeclarations: tools }] },
    })

    const functionCall = response.candidates[0].content.parts[0].functionCall
    if (functionCall) {
      pendingFunctionCall = functionCall
    } else {
      const responseText = response.candidates[0].content.parts[0].text
      chatHistory.push({
        role: "model",
        parts: [{ text: responseText, type: "text" }],
      })
      console.log(`LLM: ${responseText}`)
    }
  }
}
