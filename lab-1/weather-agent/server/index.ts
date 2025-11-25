import { Client } from "@modelcontextprotocol/sdk/client/index.js"
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js"
import dotenv from "dotenv"
dotenv.config()

const MCP_SERVER_PATH =
  process.env.MCP_SERVER_PATH ||
  "C:\\Users\\HASSAN ALI\\Documents\\mcp\\lab-1\\mcp-server\\build\\index.js"

export class MCPWeatherClient {
  private client: Client
  private transport: StdioClientTransport | null = null

  constructor() {
    this.client = new Client({
      name: "weather-agent-client",
      version: "1.0.0",
    })
  }

  async connect() {
    this.transport = new StdioClientTransport({
      command: process.execPath,
      args: [MCP_SERVER_PATH],
    })

    await this.client.connect(this.transport)
    console.log("Connected to MCP server")
  }

  async getWeather(city: string) {
    const result = await this.client.callTool({
      name: "getWeatherDataByCityName",
      arguments: { city },
    })

    return (result.content as Array<{ type: string; text: string }>)

      .map((c) => c.text)
      .join("\n")
  }

  async close() {
    await this.client.close()
  }
}

export const mcpWeatherClient = new MCPWeatherClient()
