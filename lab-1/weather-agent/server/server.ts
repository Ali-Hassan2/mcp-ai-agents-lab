import express from "express"
import { z } from "zod"
import { mcpWeatherClient } from "./index.ts"

const app = express()
const router = express.Router()

const citySchema = z.string()

router.get("/get-weather", async (req, res) => {
  const city = req.query.city
  const parsedCity = citySchema.safeParse(city)
  if (!parsedCity.success) {
    return res.status(400).send({
      success: false,
      message: "Validation failed",
      errors: parsedCity.error.issues.map((i) => i.message),
    })
  }
  try {
    const response = await mcpWeatherClient.getWeather(parsedCity.data)
    return res.send({
      success: true,
      message: "Weather data fetched successfully",
      data: response,
    })
  } catch (error: any) {
    return res.status(500).send({
      success: false,
      message: "Server error",
      error: error?.message || "Unknown error",
    })
  }
})

app.use("/api", router)

app.listen(5000, async () => {
  console.log("Server is running at port 5000")
  await mcpWeatherClient.connect()
  console.log("MCP CLIENT CONNECTED")
})
