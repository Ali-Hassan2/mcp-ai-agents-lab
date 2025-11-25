import { AGENT_SERVER } from "@/constants"

const getWeatherData = async (city: string) => {
  const response = await fetch(
    `${AGENT_SERVER}/api/get-weather?city=${encodeURIComponent(city)}`
  )
  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new Error(errorData?.message || "Agent_Sever_Error")
  }
  const data = await response.json()
  return data.data
}

export { getWeatherData }
