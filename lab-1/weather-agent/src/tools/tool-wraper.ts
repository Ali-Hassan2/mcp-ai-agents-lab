export const weatherTool = {
  name: "getWeatherDataByCityName",
  description: "Fetches current weather of a city from MCP agent server",
  parameters: {
    type: "object",
    properties: {
      city: {
        type: "string",
        description: "City name to fetch weather for",
      },
    },
    required: ["city"],
  },
}
