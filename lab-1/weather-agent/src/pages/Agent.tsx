import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useAgent } from "../hooks"
import { Label } from "@radix-ui/react-label"

const Agent = () => {
  const { prompt, setPrompt, error, loading, response, callData } = useAgent()
  if (loading) return <p>Loading, please wait…</p>
  return (
    <>
      <div className="border-4 border-red-500 flex flex-col justify-center items-center pt-2">
        <Card className="border w-full max-w-md">
          <CardHeader>
            <CardTitle>
              <Label className="text-3xl bold">- Welcome, to Our Agent.</Label>
            </CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
        </Card>
      </div>
    </>
  )
}

export { Agent }
