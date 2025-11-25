import { LLM_URL, LLM_API } from "../constants"

const apiCall = async (prompt: string) => {
  console.log("The api Key for model is;", LLM_API)
  const response = await fetch(LLM_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${LLM_API}`,
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2000,
    }),
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new Error(errorData?.message || "Undefined Error")
  }

  const data = await response.json()
  const content = data?.choices?.[0]?.message?.content
  if (!content) {
    throw new Error("No content found from resposne.")
  }
  return content
}

export { apiCall }
