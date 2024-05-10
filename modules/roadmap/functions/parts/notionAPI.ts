import { Client, isFullBlock } from "@notionhq/client"
import {
  DatabaseObjectResponse,
  QueryDatabaseResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints"

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

export default notion
export { isFullBlock }

// * TYPES
type NotionDatabase = Exclude<DatabaseObjectResponse, "properties">
type PropertyConfigMap = NotionDatabase["properties"]
type PropertyConfig = PropertyConfigMap[keyof PropertyConfigMap]
type PropertyConfigType = PropertyConfig["type"]
type NotionPropertyConfig<T extends PropertyConfigType> = Extract<PropertyConfig, { type: T }>

type NotionPage = PageObjectResponse
type PropertyMap = NotionPage["properties"]
type Property = PropertyMap[keyof PropertyMap]
type PropertyType = Property["type"]
type NotionProperty<T extends PropertyType> = Extract<Property, { type: T }>

export type NotionStatusGroup = "To-do" | "In progress" | "Complete"
export type {
  NotionPage,
  NotionDatabase,
  NotionProperty,
  NotionPropertyConfig,
  QueryDatabaseResponse as NotionDBQueryResponse,
}
