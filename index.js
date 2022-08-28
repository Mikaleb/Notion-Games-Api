'use strict'
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
Object.defineProperty(exports, '__esModule', { value: true })
const { Client } = require('@notionhq/client')
const dotenv = require('dotenv')
const axios = require('axios')
dotenv.config()
const notion = new Client({ auth: process.env.NOTION_KEY })
const notionPageId = process.env.NOTION_PAGE_ID
const apiUrl = 'https://api.themoviedb.org/3/search/multi'
function getApiResults(movieTitle) {
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
    .then((response) => {
      const { data } = response
      return data
    })
    .catch((error) => {
      console.log(
        '🚀 ~ file: index.ts ~ line 28 ~ getApiResults ~ error',
        error
      )
      return error
    })
}
function getNotionProperty(id) {
  return notion.pages.properties.retrieve({
    page_id: id,
    property_id: 'title',
  })
}
function updateNotionPage(pageId, result) {
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
    .catch((error) => {
      console.log(error)
    })
    .then(() => {
      console.log('\n✅ Notion database is synced with Bing.')
    })
}
function run() {
  return __awaiter(this, void 0, void 0, function* () {
    yield notion.databases
      .query({
        database_id: notionPageId,
      })
      .then((res) => {
        res.results.forEach((result) =>
          __awaiter(this, void 0, void 0, function* () {
            getNotionProperty(result.id).then((properties) => {
              properties.results.forEach((property) => {
                const title = property.title.text.content
                getApiResults(title).then((t) => {
                  if (t.results.length > 0) {
                    updateNotionPage(result.id, t.results[0])
                  }
                })
              })
            })
          })
        )
      })
  })
}
run()
