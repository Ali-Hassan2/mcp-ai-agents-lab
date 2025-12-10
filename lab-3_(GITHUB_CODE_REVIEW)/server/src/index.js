import express from "express"
import { McpServer } from "@modelcontextprotocol/sdk/server/index.js"
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js"
import { z } from "zod"
import dotenv from "dotenv"
import { FALLBACK_PORT } from "./constants"
import { createNewStreamableHTTPTransport } from "./config"

dotenv.config()

const app = express()
app.use(express.json())

const port = process.env.PORT || FALLBACK_PORT

const server = new McpServer({
  name: "Version-Control-Code-Reviewer",
  version: "1.0.0",
})

const transports = {}

const transportHandler = createNewStreamableHTTPTransport(server)

app.all("/mcp", transportHandler)

app
  .listen(port, () => {
    console.log(`MCP SERVER IS RUNNING AT PORT: ${port}`)
  })
  .on("error", () => {
    console.log(`There is an error while starting the MCP SERVER: ${error}`)
    process.exit(1)
  })
