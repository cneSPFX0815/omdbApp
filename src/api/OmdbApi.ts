import { ApiBase } from "./ApiBase";
import { AppConstants } from "./AppConstants";
import { OmdbItemType } from "./enums";
import { OmdbItem, OmdbSearchResultInfo } from "./interfaces";
import { OmdbItemDetails } from "./interfaces/OmdbItemDetails";
import { OmdbJSONResponse } from "./interfaces/OmdbJSONResponse";

/**
 * The api for getting film/series data
 *
 * @export
 * @class OmdbApi
 */
export class OmdbApi
{
    /**
     * Search for a movie, series or film
     *
     * @static
     * @param {string} searchTerm the serach term to serach for
     * @returns {Promise<OmdbItem[]>}
     * @memberof OmdbApi
     */
    public static async search(searchTerm: string, page: number): Promise<OmdbSearchResultInfo>
    {
        return OmdbApi.convertOmdbItemData(await ApiBase.callApi<OmdbJSONResponse>(`${AppConstants.ApiUrl}s=${encodeURIComponent(searchTerm)}&page=${page}`));
    }

    /**
     * Converts omdb JSON data to omdb Item BO
     *
     * @private
     * @static
     * @param {OmdbJSONResponse} omdbDataJSON The JSON data from API response
     * @returns {OmdbItem[]}
     * @memberof OmdbApi
     */
    private static async convertOmdbItemData(omdbDataJSON: OmdbJSONResponse): Promise<OmdbSearchResultInfo>
    {
        let omdbItems: OmdbItem[] = new Array<OmdbItem>();

        let omdbItemsPromiseArray: Promise<void>[] = new Array<Promise<void>>();

        if(omdbDataJSON.Response === "True")
        {
            omdbDataJSON.Search.forEach(omdbItem => {
                omdbItemsPromiseArray.push(
                    new Promise<void>(async (resolve, reject) => {
                        let details: OmdbItemDetails = await OmdbApi.getDetails(omdbItem[AppConstants.Columns.imdbID]);
                        omdbItems.push({
                            Poster: omdbItem[AppConstants.Columns.Poster] === AppConstants.NullValue ? OmdbApi.getDefaultImage(omdbItem[AppConstants.Columns.Type]) : omdbItem[AppConstants.Columns.Poster],
                            Title: omdbItem[AppConstants.Columns.Title] === AppConstants.NullValue ? AppConstants.Placeholder.Title : omdbItem[AppConstants.Columns.Title],
                            Type: OmdbApi.getItemType(omdbItem[AppConstants.Columns.Type]),
                            Year: omdbItem[AppConstants.Columns.Year],
                            imdbID: omdbItem[AppConstants.Columns.imdbID],
                            YearSort:  OmdbApi.getItemYear(omdbItem[AppConstants.Columns.Year]),
                            Description: details.Plot === AppConstants.NullValue ? AppConstants.Placeholder.Description : details.Plot,
                        });
                        resolve();
                    })
                )
            });

            await Promise.all(omdbItemsPromiseArray);
        }
    
        return {
            Items: omdbItems,
            TotalResults: omdbDataJSON.Response === "True" ? omdbDataJSON.totalResults : 0
        };
    }

    /**
     * Gets details for an omdb item
     *
     * @private
     * @static
     * @param {string} id imdb id (unique)
     * @param {boolean} [full=false] get full or short plot
     * @returns {Promise<OmdbItemDetails>}
     * @memberof OmdbApi
     */
    private static getDetails(id: string, full: boolean = false) : Promise<OmdbItemDetails>
    {
        return ApiBase.callApi<OmdbItemDetails>(`${AppConstants.ApiUrl}i=${encodeURIComponent(id)}&plot=${full ? "full": "short"}`);
    }

    /**
     * Gets the default image (if poster is empty) from type string
     *
     * @private
     * @static
     * @param {string} typeString type as string
     * @returns {string}
     * @memberof OmdbApi
     */
    private static getDefaultImage(typeString: string): string
    {
        switch(typeString)
        {
            case "series":
                return "https://cdn.pixabay.com/photo/2020/01/23/17/54/popcorn-4788367__340.png";
            case "movie":
                return "https://cdn.pixabay.com/photo/2016/03/31/18/36/cinema-1294496__340.png";
            case "episode":
                return "https://cdn.pixabay.com/photo/2016/01/02/16/39/darth-vader-1118454__480.png";
            default:
                return "https://cdn.pixabay.com/photo/2016/03/31/18/36/cinema-1294496__340.png";
        }
    }

    /**
     * Gets the year as number to sort. Year can be a timespan (e.g. 2003-2012. This will use 2th number for sorting)
     *
     * @private
     * @static
     * @param {string} yearString
     * @returns {number}
     * @memberof OmdbApi
     */
    private static getItemYear(yearString: string): number
    {
        if(yearString.indexOf("–") > -1)
        {
            let yearSort: string = yearString.substring(yearString.indexOf("–") + 1);
            if(yearSort === "")
            {
                return parseInt(yearString);
            }
            return parseInt(yearSort);
        }
        return parseInt(yearString);
    }

    /**
     * Gets the omdb item type enum from type string
     *
     * @private
     * @static
     * @param {string} typeString the type as string
     * @returns {OmdbItemType}
     * @memberof OmdbApi
     */
    private static getItemType(typeString: string): OmdbItemType
    {
        switch(typeString)
        {
            case "series":
                return OmdbItemType.Series;
            case "movie":
                return OmdbItemType.Movie;
            case "episode":
                return OmdbItemType.Episode;
            default:
                return OmdbItemType.Movie;
        }
    }
}