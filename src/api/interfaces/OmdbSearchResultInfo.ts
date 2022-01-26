import { OmdbItem } from ".";

/**
 * INterface for search result response
 *
 * @export
 * @interface OmdbSearchResultInfo
 */
export interface OmdbSearchResultInfo
{
    /**
     * current page search result items as array
     *
     * @type {OmdbItem[]}
     * @memberof OmdbSearchResultInfo
     */
    Items: OmdbItem[];
    /**
     * Total result count
     *
     * @type {number}
     * @memberof OmdbSearchResultInfo
     */
    TotalResults: number;
}