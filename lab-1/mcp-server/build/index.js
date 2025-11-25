import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
var SupportedCity;
(function (SupportedCity) {
    SupportedCity["Gujrat"] = "gujrat";
    SupportedCity["Lahore"] = "lahore";
})(SupportedCity || (SupportedCity = {}));
const getWeatherData = async (city) => {
    const normalizedCity = city.toLowerCase();
    switch (normalizedCity) {
        case SupportedCity.Gujrat:
            return { temp: "40C", humidity: "90%", rainChance: "70%" };
        case SupportedCity.Lahore:
            return { temp: "50C", humidity: "40%", rainChance: "40%" };
        default:
            return { temp: "", humidity: "", rainChance: "", error: "Unknown city" };
    }
};
const server = new McpServer({
    name: "Weather Data Fetcher",
    version: "1.0.0",
});
server.registerTool("getWeatherDataByCityName", {
    description: "Fetches weather data by city name",
}, async (args) => {
    console.log("[MCP SERVER] Request received for city:", args.city);
    const data = await getWeatherData(args.city);
    // Just return a simple object — no schema needed
    return {
        content: [
            { type: "text", text: `Temperature: ${data.temp}` },
            { type: "text", text: `Humidity: ${data.humidity}` },
            { type: "text", text: `Chance of Rain: ${data.rainChance}` },
            ...(data.error ? [{ type: "text", text: `Error: ${data.error}` }] : []),
        ],
    };
});
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.log("MCP-SERVER is running...");
}
main().catch(console.error);
//# sourceMappingURL=index.js.map