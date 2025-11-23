import React from "react"
import { apiCall } from "../services"
import { useAgent } from "../hooks"

const Agent = () => {
  const { prompt, setPrompt, error, loading, response, callData } = useAgent()
  if (loading) return <p>Loading, please wait…</p>
  return (
    <>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
        <input
          type="text"
          placeholder="Please enter prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button onClick={sendPrompt}>Generate Response</button>
      </div>
      {response && (
        <div>
          <h3>Response:</h3>
          <p>{response}</p>
        </div>
      )}
    </>
  )
}

export {Agent}
