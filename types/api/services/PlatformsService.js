'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.PlatformsService = void 0
const OpenAPI_1 = require('../core/OpenAPI')
const request_1 = require('../core/request')
class PlatformsService {
  /**
   * Get a list of video game platforms.
   * @param ordering Which field to use when ordering the results.
   * @param page A page number within the paginated result set.
   * @param pageSize Number of results to return per page.
   * @returns any
   * @throws ApiError
   */
  static platformsList(ordering, page, pageSize) {
    return (0, request_1.request)(OpenAPI_1.OpenAPI, {
      method: 'GET',
      url: '/platforms',
      query: {
        ordering: ordering,
        page: page,
        page_size: pageSize,
      },
    })
  }
  /**
   * Get a list of parent platforms.
   * For instance, for PS2 and PS4 the “parent platform” is PlayStation.
   * @param ordering Which field to use when ordering the results.
   * @param page A page number within the paginated result set.
   * @param pageSize Number of results to return per page.
   * @returns any
   * @throws ApiError
   */
  static platformsListsParentsList(ordering, page, pageSize) {
    return (0, request_1.request)(OpenAPI_1.OpenAPI, {
      method: 'GET',
      url: '/platforms/lists/parents',
      query: {
        ordering: ordering,
        page: page,
        page_size: pageSize,
      },
    })
  }
  /**
   * Get details of the platform.
   * @param id A unique integer value identifying this Platform.
   * @returns PlatformSingle
   * @throws ApiError
   */
  static platformsRead(id) {
    return (0, request_1.request)(OpenAPI_1.OpenAPI, {
      method: 'GET',
      url: '/platforms/{id}',
      path: {
        id: id,
      },
    })
  }
}
exports.PlatformsService = PlatformsService
