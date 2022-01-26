/**
 * The Omdb Api JSON Response interface
 *
 * @export
 * @interface OmdbJSONResponse
 */
export interface OmdbJSONResponse
{
    /**
     * Indicates if a reponse is valid
     *
     * @type {boolean}
     * @memberof OmdbJSONResponse
     */
    Response: string;
    /**
     * all results as array
     *
     * @type {any[]}
     * @memberof OmdbJSONResponse
     */
    Search: any[];
    /**
     * the numnber of results
     *
     * @type {number}
     * @memberof OmdbJSONResponse
     */
    totalResults: number;
}