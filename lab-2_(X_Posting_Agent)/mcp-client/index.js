import dotenv from "dotenv"
import readline from "readline/promises"
import { GoogleGenAI } from "@google/genai"
import { Client } from "@modelcontextprotocol/sdk/client/index.js"
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js"
dotenv.config()
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_KEY,
})

const mcpClient = new Client({
  name: "mcp-client-x",
  version: "1.0.0",
})

const chatHistory = []
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

mcpClient
  .connect(
    new StreamableHTTPClientTransport(new URL("http://localhost:3000/mcp"))
  )
  .then(async () => {})
