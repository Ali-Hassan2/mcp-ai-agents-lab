import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js"

const createNewStreamableHTTPTransport = (server) => {
  return async (req, res) => {
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    })

    res.on("close", () => {
      transport.close()
    })
    await server.connect()
    await transport.handleRequest(req, res, req.body)
  }
}

export { createNewStreamableHTTPTransport }
