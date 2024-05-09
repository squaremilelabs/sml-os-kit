import { Client, isFullBlock } from "@notionhq/client"

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

export default notion
export { isFullBlock }
