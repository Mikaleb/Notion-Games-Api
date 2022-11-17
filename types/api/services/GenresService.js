'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.GenresService = void 0
const OpenAPI_1 = require('../core/OpenAPI')
const request_1 = require('../core/request')
class GenresService {
  /**
   * Get a list of video game genres.
   * @param ordering Which field to use when ordering the results.
   * @param page A page number within the paginated result set.
   * @param pageSize Number of results to return per page.
   * @returns any
   * @throws ApiError
   */
  static genresList(ordering, page, pageSize) {
    return (0, request_1.request)(OpenAPI_1.OpenAPI, {
      method: 'GET',
      url: '/genres',
      query: {
        ordering: ordering,
        page: page,
        page_size: pageSize,
      },
    })
  }
  /**
   * Get details of the genre.
   * @param id A unique integer value identifying this Genre.
   * @returns GenreSingle
   * @throws ApiError
   */
  static genresRead(id) {
    return (0, request_1.request)(OpenAPI_1.OpenAPI, {
      method: 'GET',
      url: '/genres/{id}',
      path: {
        id: id,
      },
    })
  }
}
exports.GenresService = GenresService
