import {
  QueryDatabaseResponse,
  GetPagePropertyParameters,
  PropertyItemPropertyItemListResponse,
  PropertyItemObjectResponse,
} from '@notionhq/client/build/src/api-endpoints'

const { Client } = require('@notionhq/client')
const dotenv = require('dotenv')
const axios = require('axios')

dotenv.config()
const notion = new Client({ auth: process.env.NOTION_KEY })
const notionPageId = process.env.NOTION_PAGE_ID

const apiUrl = 'https://api.themoviedb.org/3/search/multi'

function getApiResults(movieTitle: string) {
  return axios({
    url: apiUrl,
    params: {
      query: movieTitle,
      page: 1,
      include_adult: false,
      language: 'fr',
      api_key: process.env.TMDB_API_KEY,
    },
  })
    .then((response: { data: any }) => {
      const { data } = response
      return data
    })
    .catch((error: any) => {
      console.log(
        '🚀 ~ file: index.ts ~ line 28 ~ getApiResults ~ error',
        error
      )
      return error
    })
}

function getNotionProperty(id: any) {
  return notion.pages.properties.retrieve({
    page_id: id,
    property_id: 'title',
  } as GetPagePropertyParameters)
}

function updateNotionPage(pageId: any, result: any) {
  const tmdbImageCoverUrl =
    'https://image.tmdb.org/t/p/original' + result.backdrop_path
  const tmdbPosterUrl =
    'https://image.tmdb.org/t/p/original' + result.poster_path

  console.log(
    '🚀 ~ file: index.ts ~ line 53 ~ updateNotionPage ~ tmdbPosterUrl',
    tmdbPosterUrl
  )
  notion.pages
    .update({
      page_id: pageId,
      properties: {
        Poster: {
          files: [
            {
              type: 'external',
              name: pageId,
              external: {
                url: tmdbPosterUrl,
              },
            },
          ],
        },
        Synopsis: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: result.overview,
              },
            },
          ],
        },
      },
      cover: {
        external: {
          url: tmdbImageCoverUrl,
        },
        type: 'external',
      },
    })
    .catch((error: any) => {
      console.log(error)
    })
    .then(() => {
      console.log('\n✅ Notion database is synced with Bing.')
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

run()
