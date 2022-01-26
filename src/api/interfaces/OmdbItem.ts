import { OmdbItemType } from "../enums";

/**
 * Interface for a Omdb item
 *
 * @export
 * @interface OmdbItem
 */
export interface OmdbItem
{
    /**
     * movie/series title
     *
     * @type {string}
     * @memberof OmdbItem
     */
    Title: string;
    /**
     * movie/series year of start
     *
     * @type {string}
     * @memberof OmdbItem
    */
    Year: string;
    /**
     * The year as number to sort
     *
     * @type {number}
     * @memberof OmdbItem
     */
    YearSort: number;
    /**
     * the poster image url
     *
     * @type {string}
     * @memberof OmdbItem
     */
    Poster: string;
    /**
     * the type of item (Movie, Series or Episode)
     *
     * @type {OmdbItemType}
     * @memberof OmdbItem
     */
    Type: OmdbItemType;
    /**
     * The imdb Id
     *
     * @type {string}
     * @memberof OmdbItem
     */
    imdbID: string;

    /**
     * the description of the film
     *
     * @type {string}
     * @memberof OmdbItem
     */
    Description: string;
}