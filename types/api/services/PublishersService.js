'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.PublishersService = void 0
const OpenAPI_1 = require('../core/OpenAPI')
const request_1 = require('../core/request')
class PublishersService {
  /**
   * Get a list of video game publishers.
   * @param page A page number within the paginated result set.
   * @param pageSize Number of results to return per page.
   * @returns any
   * @throws ApiError
   */
  static publishersList(page, pageSize) {
    return (0, request_1.request)(OpenAPI_1.OpenAPI, {
      method: 'GET',
      url: '/publishers',
      query: {
        page: page,
        page_size: pageSize,
      },
    })
  }
  /**
   * Get details of the publisher.
   * @param id A unique integer value identifying this Publisher.
   * @returns PublisherSingle
   * @throws ApiError
   */
  static publishersRead(id) {
    return (0, request_1.request)(OpenAPI_1.OpenAPI, {
      method: 'GET',
      url: '/publishers/{id}',
      path: {
        id: id,
      },
    })
  }
}
exports.PublishersService = PublishersService
