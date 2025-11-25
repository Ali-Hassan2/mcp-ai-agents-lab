import { weatherTool } from "@/tools"
import { LLM_URL, LLM_API } from "../constants"
import { getWeatherData } from "@/config"

interface DeepSeekFunctionCall {
  name: string
  arguments: { [key: string]: any }
}

const apiCall = async (prompt: string) => {
  console.log("Sending prompt to LLM:", prompt)

  const response = await fetch(LLM_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${LLM_API}`,
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }],
      functions: [weatherTool],
      function_call: { name: "getWeatherDataByCityName" },
      max_tokens: 2000,
    }),
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new Error(errorData?.message || "Undefined Error")
  }
  const data = await response.json()
  const message = data?.choices?.[0]?.message

  if (!message) return "No response from LLM."
  if (message.function_call) {
    const funcCall: DeepSeekFunctionCall = message.function_call
    console.log("LLM decided to call function:", funcCall.name)
    if (funcCall.name === "getWeatherDataByCityName") {
      const city = funcCall.arguments.city
      console.log(`Calling MCP for weather of: ${city}`)
      const weather = await getWeatherData(city)
      return `Weather for ${city}: ${weather}`
    }
  }
  console.log("LLM did NOT call any function/tool.")
  return message.content ?? "No content returned."
}

export { apiCall }
