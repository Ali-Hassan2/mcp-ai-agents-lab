import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useAgent } from "../hooks"
import { Label } from "@radix-ui/react-label"
import { Separator } from "@radix-ui/react-separator"
import { Button } from "@/components/ui/button"
import { Loader2, Sparkles } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { useEffect } from "react"

const Agent = () => {
  const { prompt, setPrompt, error, loading, response, callData, open } =
    useAgent()

  useEffect(() => {
    console.log("the response data is:", response)
  })

  console.log("The resposne is:", response)
  return (
    <div className="flex flex-col justify-center items-center pt-2">
      <Card className="border w-full max-w-md mt-2">
        <CardHeader>
          <CardTitle>
            <Label className="text-3xl font-bold">
              - Welcome, to Our Agent.
            </Label>
          </CardTitle>
        </CardHeader>
      </Card>
      <Separator className="my-4" />
      <Card className="border w-full max-w-5xl">
        <CardHeader>
          <CardTitle>
            <Label>Alito's Agent</Label>
          </CardTitle>
          <CardDescription>
            This is an open purpose agent which uses the MCP Server to provide
            the latest information.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-2">
          <Textarea
            placeholder="Prompt here..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full outline-none  bg-black/5 pl-2 rounded-md"
          />
          <Button
            onClick={callData}
            disabled={prompt.length === 0 || loading}
            className={`p-8 rounded-[2px] ${
              prompt.length === 0 || loading
                ? "opacity-50 cursor-not-allowed"
                : "bg-purple-500"
            }`}
          >
            {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
          </Button>

          {error && <p className="text-red-500">{error}</p>}
        </CardContent>
      </Card>
      <Separator className="my-4" />
      {open ? (
        <Card className="w-full max-w-3xl">
          <CardHeader>
            <CardTitle>Response Board</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border p-3 rounded-md flex items-center gap-2">
              {loading ? (
                <>
                  <Loader2 className="animate-spin" />
                  <span>loading</span>
                </>
              ) : (
                <span>{response}</span>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <p className="text-sm opacity-70">
          Please send a prompt to get the response.
        </p>
      )}
    </div>
  )
}

export { Agent }
