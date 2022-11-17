'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.CreatorRolesService = void 0
const OpenAPI_1 = require('../core/OpenAPI')
const request_1 = require('../core/request')
class CreatorRolesService {
  /**
   * Get a list of creator positions (jobs).
   * @param page A page number within the paginated result set.
   * @param pageSize Number of results to return per page.
   * @returns any
   * @throws ApiError
   */
  static creatorRolesList(page, pageSize) {
    return (0, request_1.request)(OpenAPI_1.OpenAPI, {
      method: 'GET',
      url: '/creator-roles',
      query: {
        page: page,
        page_size: pageSize,
      },
    })
  }
}
exports.CreatorRolesService = CreatorRolesService
