'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.StoresService = void 0
const OpenAPI_1 = require('../core/OpenAPI')
const request_1 = require('../core/request')
class StoresService {
  /**
   * Get a list of video game storefronts.
   * @param ordering Which field to use when ordering the results.
   * @param page A page number within the paginated result set.
   * @param pageSize Number of results to return per page.
   * @returns any
   * @throws ApiError
   */
  static storesList(ordering, page, pageSize) {
    return (0, request_1.request)(OpenAPI_1.OpenAPI, {
      method: 'GET',
      url: '/stores',
      query: {
        ordering: ordering,
        page: page,
        page_size: pageSize,
      },
    })
  }
  /**
   * Get details of the store.
   * @param id A unique integer value identifying this Store.
   * @returns StoreSingle
   * @throws ApiError
   */
  static storesRead(id) {
    return (0, request_1.request)(OpenAPI_1.OpenAPI, {
      method: 'GET',
      url: '/stores/{id}',
      path: {
        id: id,
      },
    })
  }
}
exports.StoresService = StoresService
