import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
// Minimal MCP server
const server = new McpServer({
    name: "Weather Server",
    version: "1.0.0",
});
// Register a tool with CORRECT outputSchema
server.registerTool("getWeatherDataByCityName", {
    inputSchema: z.object({ city: z.string() }),
    description: "Get weather data for a city",
}, async (args, extra) => {
    console.log("[MCP SERVER] Request received for city:", args.city);
    const data = {
        temp: "40C",
        humidity: "80%",
        rainChance: "60%",
    };
    return {
        content: [
            { type: "text", text: `Temperature: ${data.temp}` },
            { type: "text", text: `Humidity: ${data.humidity}` },
            { type: "text", text: `Chance of Rain: ${data.rainChance}` },
        ],
    };
});
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.log("MCP SERVER running...");
}
main().catch(console.error);
//# sourceMappingURL=index.js.map