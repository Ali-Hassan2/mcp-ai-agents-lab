import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import dotenv from "dotenv";
dotenv.config();
// Use double backslashes OR forward slashes in Windows paths
// const mcp_server_path =
// "C:/Users/HASSAN ALI/Documents/mcp/lab-1/mcp-server/build/index.js"
// OR
const mcp_server_path = "C:\\Users\\HASSAN ALI\\Documents\\mcp\\lab-1\\mcp-server\\build\\index.js";
console.log("The server path is:", mcp_server_path);
class MCPClient {
    client;
    transport = null;
    constructor() {
        this.client = new Client({
            name: "weather-agent-client",
            version: "1.0.0",
        });
    }
    async connect(serverPath) {
        this.transport = new StdioClientTransport({
            command: process.execPath, // Node executable
            args: [serverPath],
        });
        await this.client.connect(this.transport);
        const tools = await this.client.listTools();
        console.log("MCP server connected. Available tools:", tools.tools.map((t) => t.name));
    }
    async callTool(toolName, args) {
        const result = await this.client.callTool({
            name: toolName,
            arguments: args,
        });
        console.log("The result----------- is: ", result.content);
        return result.content
            .map((c) => c.text)
            .join("\n");
    }
    async close() {
        await this.client.close();
    }
}
async function main() {
    const client = new MCPClient();
    // directly use the hardcoded path
    await client.connect(mcp_server_path);
    const response = await client.callTool("getWeatherDataByCityName", {
        city: "gujrat",
    });
    console.log("Weather response is:", response);
    await client.close();
}
main().catch((err) => console.error("Error:", err));
//# sourceMappingURL=index.js.map