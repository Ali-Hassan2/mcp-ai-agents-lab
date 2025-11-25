import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
var SupportedCity;
(function (SupportedCity) {
    SupportedCity["Gujrat"] = "gujrat";
    SupportedCity["Lahore"] = "lahore";
})(SupportedCity || (SupportedCity = {}));
const getWeatherData = async (city) => {
    const normalizedCity = city.toLowerCase();
    switch (normalizedCity) {
        case SupportedCity.Gujrat:
            return { temp: "40C", humidity: "90%", Chances_Of_Rain: "70%" };
        case SupportedCity.Lahore:
            return { temp: "50C", humidity: "40%", Chances_Of_Rain: "40%" };
        default:
            return {
                temp: "",
                humidity: "",
                Chances_Of_Rain: "",
                error: "An Unexpected Error Occurred",
            };
    }
};
const server = new McpServer({
    name: "Weather Data Fetcher",
    version: "1.0.0",
});
server.registerTool("getWeatherDataByCityName", {
    inputSchema: z.object({
        city: z.string(),
    }),
    outputSchema: z.object({
        content: z.array(z.object({
            type: z.literal("text"),
            text: z.string(),
        })),
    }),
    description: "Fetches weather data by city name",
}, async (args) => {
    console.log(`[MCP SERVER] Received request for city: ${args.city}`);
    const data = await getWeatherData(args.city);
    const content = [
        { type: "text", text: `Temperature: ${data.temp || "N/A"}` },
        { type: "text", text: `Humidity: ${data.humidity || "N/A"}` },
        {
            type: "text",
            text: `Chance of Rain: ${data.Chances_Of_Rain || "N/A"}`,
        },
    ];
    return { content };
});
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.log("MCP-SERVER is running...");
}
main().catch((error) => {
    console.error("Fatal error in main execution:", error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map