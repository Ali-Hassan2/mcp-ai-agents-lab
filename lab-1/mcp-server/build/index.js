import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
// Minimal MCP server
const server = new McpServer({
    name: "Weather Server",
    version: "1.0.0",
});
// Register tool with a permissive schema
server.registerTool("getWeatherDataByCityName", {
    inputSchema: z.object({ city: z.string() }), // simple input
    outputSchema: z.object({}).strict(false), // no validation, must be a Zod object
    description: "Get weather data for a city",
}, async (args) => {
    console.log("[MCP SERVER] Request received for city:", args.city);
    const data = {
        temp: "40C",
        humidity: "80%",
        rainChance: "60%",
    };
    // MCP expects `content` array
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