import { getWeatherData } from "@/config"
import { apiCall } from "../services"
import { useState } from "react"
import { useToggle } from "react-use"

const useAgent = () => {
  const [prompt, setPrompt] = useState<string>("")
  const [response, setResponse] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useToggle(false)
  const [open, setIsOpen] = useToggle(false)

  const callData = async () => {
    try {
      setIsOpen(true)
      setLoading(true)
      setError("")
      setResponse("")
      if (!prompt.trim()) {
        setError("Please provide a prompt")
        return
      }
      const llmOutput = await apiCall(prompt)
      const toolCallMatch = llmOutput.match(
        /Call tool getWeatherDataByCityName with argument city\s*=\s*(.+)/i
      )
      let finalData = llmOutput
      if (toolCallMatch) {
        const city = toolCallMatch[1].trim()
        const weather = await getWeatherData(city)
        finalData = `Weather for ${city}: ${weather}`
      }
      setResponse(finalData)
    } catch (err: unknown) {
      let msg = "Unknown Error"
      if (err instanceof Error) msg = err.message
      else if (typeof err === "string") msg = err
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return {
    prompt,
    setPrompt,
    response,
    error,
    loading,
    callData,
    open,
  }
}

export { useAgent }
