import {Component} from "react";
import { Badge, Button, Card } from "react-bootstrap";
import ReactPaginate from "react-paginate";

import { AppConstants } from "../api/AppConstants";
import { OmdbItemType } from "../api/enums";
import { OmdbItem, OmdbSearchResultInfo } from "../api/interfaces";
import { OmdbApi } from "../api/OmdbApi";

/**
 * Interface for component search result properties
 *
 * @interface OmdbSearchResultsProps
 */
interface OmdbSearchResultsProps
{
    /**
     * The search term to display results for
     *
     * @type {string}
     * @memberof OmdbSearchResultsProps
     */
    searchTerm: string;
}

/**
 * Interface for component search result state
 *
 * @interface OmdbSearchResultsState
 */
interface OmdbSearchResultsState
{
    /**
     * The current result set
     *
     * @type {OmdbItem[]}
     * @memberof OmdbSearchResultsState
     */
    results: OmdbItem[];
    /**
     * Amount of results to calculate and display paging
     *
     * @type {number}
     * @memberof OmdbSearchResultsState
     */
    totalResults: number;
    /**
     * indicates if results will be loading.
     *
     * @type {boolean}
     * @memberof OmdbSearchResultsState
     */
    loadingResults: boolean
}

/**
 * The component for OmdbSearchResults
 *
 * @class OmdbSearchResults
 * @extends {Component<{}, {}>}
 */
class OmdbSearchResults extends Component<OmdbSearchResultsProps, OmdbSearchResultsState> {

    constructor(props: OmdbSearchResultsProps)
    {
        super(props);
        this.state = {
            results: [],
            totalResults: 0,
            loadingResults: true,
        }
    }

  public render() {
    return (
      <>
        { !this.state.loadingResults &&
          <div className="resultInfoContainer">
            {`Found ${this.state.totalResults} Items`}
          </div>
        }
       
        <div className="resultContainer">
            { this.state.results.length === 0 && !this.state.loadingResults &&
              <div>
                <span>Nothing found!</span>
              </div>
            }
            { this.state.results.length > 0 &&
                this.state.results.map(resultItem => {
                    return(
                        <Card key={resultItem.imdbID} className="resultItem">
                            <div className="image" >
                              <Card.Img variant="top" src={resultItem.Poster} />
                            </div>
                            <Card.Body>
                                <Card.Title className="title">
                                  {resultItem.Title}&nbsp;
                                  { resultItem.Type === OmdbItemType.Movie &&
                                    <Badge bg="primary">Movie</Badge>
                                  }
                                  { resultItem.Type === OmdbItemType.Series &&
                                    <Badge bg="success">Series</Badge>
                                  }
                                  { resultItem.Type === OmdbItemType.Episode &&
                                    <Badge bg="warning">Episode</Badge>
                                  }
                                </Card.Title>
                                <Card.Text  className="description">{resultItem.Description}</Card.Text>
                                <Button variant="primary" className="more" onClick={this._onNavigateImdb.bind(this, resultItem.imdbID)}>more Infos on imdb</Button>
                            </Card.Body>
                        </Card>
                    )
                  })
            }
        </div>
        { this.state.totalResults > 10 &&
          <div className="pagingContainer">
            <ReactPaginate
                    breakLabel="..."
                    onPageChange={this._onPageChange.bind(this)}
                    pageRangeDisplayed={5}
                    pageCount={Math.ceil(this.state.totalResults / 10)}
                    previousLabel="Previous"
                    nextLabel="Next"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                    marginPagesDisplayed={2}
                    containerClassName="pagination"
                    activeClassName="active"
                  />
          </div>
        }
        
      </>
    );
  }

  /**
   * Called immediately after a component is mounted. Setting state here will trigger re-rendering.
   *
   * @memberof OmdbSearchResults
   */
  public async componentDidMount()
  {
    await this._executeSearch(this.props.searchTerm, 1);
  }

  /**
   * Called immediately after updating occurs. Not called for the initial render.

    The snapshot is only present if getSnapshotBeforeUpdate is present and returns non-null.
   *
   * @param {*} prevProps the previous properties
   * @param {*} prevState the previous properties state
   * @memberof OmdbSearchResults
   */
  public async componentDidUpdate(prevProps: any, prevState: any)
  {
    if(this.props.searchTerm !== prevProps.searchTerm)
    {
      await this._executeSearch(this.props.searchTerm, 1);
    }
  }

  /**
   * Event when clicking more info button. this will redirect to imdb website
   *
   * @private
   * @param {string} imdbId the uniwue imdb id
   * @memberof OmdbSearchResults
   */
  private _onNavigateImdb(imdbId: string)
  {
    window.open(`${AppConstants.ImdbUrl}/${imdbId}`, "_blank");
  }

  /**
   * Event when page is cliked. this will fetch api gaain and will increase/decrease paging
   *
   * @private
   * @param {*} page
   * @memberof OmdbSearchResults
   */
  private async _onPageChange(page: any)
  {
    await this._executeSearch(this.props.searchTerm, page.selected + 1);
  }

  /**
   * Method for exceuting search and display results
   *
   * @private
   * @param {string} searchTerm the current search term
   * @param {number} page the current page
   * @memberof OmdbSearchResults
   */
  private async _executeSearch(searchTerm: string, page: number)
  {
    this.setState({loadingResults: true});
    let searchResultInfo: OmdbSearchResultInfo = await OmdbApi.search(searchTerm, page);
    this.setState({results: searchResultInfo.Items, totalResults: searchResultInfo.TotalResults, loadingResults: false});
  }
}

export default OmdbSearchResults;