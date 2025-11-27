// test-x-post.js
import dotenv from "dotenv"
import { TwitterApi } from "twitter-api-v2"

dotenv.config()

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_KEY_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
})

async function testPost() {
  try {
    const tweetText = "Test post from local script."
    const response = await client.v2.tweet(tweetText)
    console.log("Tweet posted successfully:", response)
  } catch (error) {
    console.error("Error posting tweet:", error)
  }
}

testPost()
