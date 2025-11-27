import express from "express"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
// import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js"
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js"

const server = new McpServer({
  name: "x-mcp-server",
  version: "1.0.0",
})

const app = express()
app.use(express.json())

const transports = {}

app.all("/mcp", async (req, res) => {
  const transport = new SSEServerTransport({
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
