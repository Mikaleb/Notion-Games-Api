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
const apiUrl = 'https://api.rawg.io/api/'
function getApiResults(search) {
  return axios({
    url: apiUrl + 'games',
    params: {
      search: search,
      key: process.env.API_KEY,
    },
  })
    .then((response) => {
      console.log('response api', response)
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
function getMultiSelectVals(result, tagName) {
  const langs = ['eng', 'fre']
  return result[tagName]
    .filter((res) => langs.includes(res.language) || !res.language)
    .map((res) => {
      return {
        name: res.name,
      }
    })
}
function getScreenshot(result) {
  var _a
  const screenshots = result.short_screenshots.map((res) => {
    if (res.image.includes('/media/screenshots')) {
      return res
    }
  })
  console.log('screenshots', screenshots)
  if (screenshots.length > 0)
    return (_a = screenshots[0]) === null || _a === void 0 ? void 0 : _a.image
  return result.background_image
}
function updateNotionPage(pageId, result) {
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
    .catch((error) => {
      console.log(error)
    })
    .then(() => {
      console.log('\n✅ Notion database is synced with Rawg.')
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
