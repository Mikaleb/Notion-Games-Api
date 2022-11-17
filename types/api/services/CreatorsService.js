'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.CreatorsService = void 0
const OpenAPI_1 = require('../core/OpenAPI')
const request_1 = require('../core/request')
class CreatorsService {
  /**
   * Get a list of game creators.
   * @param page A page number within the paginated result set.
   * @param pageSize Number of results to return per page.
   * @returns any
   * @throws ApiError
   */
  static creatorsList(page, pageSize) {
    return (0, request_1.request)(OpenAPI_1.OpenAPI, {
      method: 'GET',
      url: '/creators',
      query: {
        page: page,
        page_size: pageSize,
      },
    })
  }
  /**
   * Get details of the creator.
   * @param id A unique integer value identifying this Person.
   * @param id
   * @returns PersonSingle
   * @throws ApiError
   */
  static creatorsRead(id) {
    return (0, request_1.request)(OpenAPI_1.OpenAPI, {
      method: 'GET',
      url: '/creators/{id}',
      path: {
        id: id,
      },
    })
  }
}
exports.CreatorsService = CreatorsService
