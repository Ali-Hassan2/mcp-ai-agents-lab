import { apiCall } from "../services"

const useAgent = () => {
  const [prompt, setPrompt] = useState<string>("")
  const [response, setResponse] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>("")

  const callData = async () => {
    try {
      setLoading(true)
      setError("")
      setResponse("")
      if (!prompt.trim()) {
        setError("Please provide a prompt")
      }
      const data = await apiCall(prompt)
      setResponse(data)
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
  }
}

export { useAgent }
