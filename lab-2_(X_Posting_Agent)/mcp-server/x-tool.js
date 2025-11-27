import { config } from "dotenv"
import { TwitterApi } from "twitter-api-v2"
config()

const apiKey = process.env.X_API_KEY
const apiSecret = process.env.X_API_KEY_SECRET
const tokenApi = process.env.X_ACCESS_TOKEN
const tokenSecret = process.env.X_ACCESS_SECRET

if (!apiKey || !apiSecret || !tokenApi || !tokenSecret) {
  console.log("There is a missing enviornmental variable")
}

console.log(apiKey)
console.log(apiSecret)
console.log(tokenApi)
console.log(tokenSecret)

const twitterClient = new TwitterApi({
  appKey: apiKey,
  appSecret: apiSecret,
  accessToken: tokenApi,
  accessSecret: tokenSecret,
})

export const X_POST = async (status) => {
  const newPOST = await twitterClient.v2.tweet(status)
  return {
    content: [
      {
        type: "text",
        text: `Tweeted: ${status}`,
      },
    ],
  }
}
