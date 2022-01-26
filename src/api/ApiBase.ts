/**
 * Base class for api calls
 *
 * @export
 * @class ApiBase
 */
export class ApiBase
{
    /**
     * Call an api and return JSON data
     *
     * @static
     * @template T Type of JSON to return
     * @param {string} url the api url
     * @returns {Promise<T>}
     * @memberof ApiBase
     */
    public static async callApi<T>(url: string): Promise<T>
    {
        let resultData: T;
        try
        {
            let response: Response = await fetch(url);
            resultData = await response.json() as T;
            return resultData;
        }
        catch(error)
        {
            return {} as T;
        }
       
    }
}