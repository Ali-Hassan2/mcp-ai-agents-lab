import express from "express"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
// import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js"
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js"
import { z } from "zod"
import { X_POST } from "./x-tool.js"

const server = new McpServer({
  name: "x-mcp-server",
  version: "1.0.0",
})

const app = express()
app.use(express.json())

server.registerTool(
  "add3Numbers",
  {
    title: "add3NumbersTool",
    descripiton:
      "This Tool holds a function which calculates the sum for 3 numebrs",
    inputSchema: {
      num1: z.number(),
      num2: z.number(),
      num3: z.number(),
    },
  },
  async (args) => {
    const { num1, num2, num3 } = args
    return {
      content: [
        {
          type: "text",
          text: `The sum calculation of ${num1}, ${num2}, ${num3} = ${
            num1 + num2 + num3
          }`,
        },
      ],
    }
  }
)

console.log("-------", X_POST)

server.registerTool(
  "x-post-creation",
  {
    title: "POST ON X",
    description: "can create a post on X",
    inputSchema: {
      status: z.string(),
    },
  },
  async (args) => {
    const { status } = args
    return X_POST(status)
  }
)

server.registerTool(
  "echoingName",
  {
    title: "Printing Greet on Name Tool",
    description: "This tool takes the name and prints it",
    inputSchema: {
      message: z.string(),
    },
  },
  async (args) => {
    const { message } = args
    return { content: [{ type: "text", text: `Aslam-Alaikum ${message}` }] }
  }
)

const transports = {}

app.all("/mcp", async (req, res) => {
  const transport = new StreamableHTTPServerTransport({
    sessionIdGeneration: undefined,
    enableJsonResponse: true,
  })

  res.on("close", () => {
    transport.close()
  })

  await server.connect(transport)
  await transport.handleRequest(req, res, req.body)
})

const port = parseInt("3000")
app
  .listen(port, () => {
    console.log("MCP_SERVER IS RUNNING AT PORT: 3000")
  })
  .on("error", (error) => {
    console.log(`There is an Server Error: ${error}`)
    process.exit(1)
  })

app.get("/sse", async (req, res) => {})
