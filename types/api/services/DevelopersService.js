'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.DevelopersService = void 0
const OpenAPI_1 = require('../core/OpenAPI')
const request_1 = require('../core/request')
class DevelopersService {
  /**
   * Get a list of game developers.
   * @param page A page number within the paginated result set.
   * @param pageSize Number of results to return per page.
   * @returns any
   * @throws ApiError
   */
  static developersList(page, pageSize) {
    return (0, request_1.request)(OpenAPI_1.OpenAPI, {
      method: 'GET',
      url: '/developers',
      query: {
        page: page,
        page_size: pageSize,
      },
    })
  }
  /**
   * Get details of the developer.
   * @param id A unique integer value identifying this Developer.
   * @returns DeveloperSingle
   * @throws ApiError
   */
  static developersRead(id) {
    return (0, request_1.request)(OpenAPI_1.OpenAPI, {
      method: 'GET',
      url: '/developers/{id}',
      path: {
        id: id,
      },
    })
  }
}
exports.DevelopersService = DevelopersService
