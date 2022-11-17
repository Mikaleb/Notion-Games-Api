import {
  QueryDatabaseResponse,
  GetPagePropertyParameters,
  PropertyItemPropertyItemListResponse,
} from '@notionhq/client/build/src/api-endpoints'
import { Game } from './types/api/models/Game'
import { AxiosError, AxiosResponse } from 'axios'
const { Client } = require('@notionhq/client')

const dotenv = require('dotenv')
const axios = require('axios')

dotenv.config()
const notion = new Client({ auth: process.env.NOTION_KEY })
const notionPageId = process.env.NOTION_PAGE_ID

const apiUrl = 'https://api.rawg.io/api/'

function getApiResults(search: string) {
  return axios({
    url: apiUrl + 'games',
    params: {
      search: search,
      key: process.env.API_KEY,
    },
  })
    .then((response: AxiosResponse) => {
      const { data } = response
      return data
    })
    .catch((error: AxiosError) => {
      console.log(
        '🚀 ~ file: index.ts ~ line 28 ~ getApiResults ~ error',
        error
      )
      return error
    })
}

function getNotionProperty(id: string) {
  return notion.pages.properties.retrieve({
    page_id: id,
    property_id: 'title',
  } as GetPagePropertyParameters)
}
function getMultiSelectVals(result: any, tagName: string) {
  const langs = ['eng', 'fre']
  return result[tagName]
    .filter((res: any) => langs.includes(res.language) || !res.language)
    .map((res: any) => {
      return {
        name: res.name,
      }
    })
}

function getScreenshot(result: any) {
  const screenshots = result.short_screenshots.map(
    (res: { image: string | string[] }) => {
      if (res.image.includes('/media/screenshots')) {
        return res
      }
    }
  )
  console.log('screenshots', screenshots)
  if (screenshots.length > 0) return screenshots[0]?.image
  return result.background_image
}

function updateNotionPage(pageId: string, result: Game) {
  notion.pages
    .update({
      page_id: pageId,
      properties: {
        Screenshot: {
          files: [
            {
              type: 'external',
              name: pageId,
              external: {
                url: getScreenshot(result),
              },
            },
          ],
        },
        'Game found': {
          rich_text: [
            {
              type: 'text',
              text: {
                content: result.name,
              },
            },
          ],
        },
        Released: {
          date: {
            start: result.released,
          },
        },
        Genres: {
          multi_select: getMultiSelectVals(result, 'genres'),
        },
        Tags: {
          multi_select: getMultiSelectVals(result, 'tags'),
        },
      },
      cover: {
        external: {
          url: result.background_image,
        },
        type: 'external',
      },
    })
    .catch((error: AxiosError) => {
      console.log(error)
    })
    .then(() => {
      console.log('\n✅ Notion database is synced with Rawg.')
    })
}

async function run() {
  await notion.databases
    .query({
      database_id: notionPageId,
    })
    .then((res: QueryDatabaseResponse) => {
      res.results.forEach(async (result: any) => {
        getNotionProperty(result.id).then(
          (properties: PropertyItemPropertyItemListResponse) => {
            properties.results.forEach((property: any) => {
              const title = property.title.text.content
              getApiResults(title).then((t: any) => {
                if (t.results.length > 0) {
                  updateNotionPage(result.id, t.results[0])
                }
              })
            })
          }
        )
      })
    })
}

// Run the script
run()
