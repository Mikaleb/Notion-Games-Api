'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.TagsService = void 0
const OpenAPI_1 = require('../core/OpenAPI')
const request_1 = require('../core/request')
class TagsService {
  /**
   * Get a list of tags.
   * @param page A page number within the paginated result set.
   * @param pageSize Number of results to return per page.
   * @returns any
   * @throws ApiError
   */
  static tagsList(page, pageSize) {
    return (0, request_1.request)(OpenAPI_1.OpenAPI, {
      method: 'GET',
      url: '/tags',
      query: {
        page: page,
        page_size: pageSize,
      },
    })
  }
  /**
   * Get details of the tag.
   * @param id A unique integer value identifying this Tag.
   * @returns TagSingle
   * @throws ApiError
   */
  static tagsRead(id) {
    return (0, request_1.request)(OpenAPI_1.OpenAPI, {
      method: 'GET',
      url: '/tags/{id}',
      path: {
        id: id,
      },
    })
  }
}
exports.TagsService = TagsService
