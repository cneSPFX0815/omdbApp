import {Component} from "react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";

import OmdbSearchResults from "./OmdbSearchResults";


/**
 * Interface for component Container properties
 *
 * @interface OmdbContainerState
 */
interface OmdbContainerState
{
    /**
     * the currently added serach term. will be empty when not bigger than 3 chars
     *
     * @type {string}
     * @memberof OmdbContainerState
     */
    searchTerm: string;

}

/**
 * The component for OmdbContainer
 *
 * @class OmdbContainer
 * @extends {Component<{}, {}>}
 */
class OmdbContainer extends Component<{}, OmdbContainerState> {

    constructor(props: {})
    {
        super(props);
        this.state = {
            searchTerm: "",
        }
    }

  public render() {
    return (
        <div>
             <ReactSearchAutocomplete
                items={[]}
                onSearch={this._onSearch.bind(this)}
                onClear={this._onClearSearch.bind(this)}
                styling={{ zIndex: 2 }} // To display it on top of the search box below
                autoFocus
            />
            { this.state.searchTerm === "" &&
              <div>
                <span>Please enter at least 3 Chars to display results!</span>
              </div>
            }
            { this.state.searchTerm !== "" &&
              <OmdbSearchResults searchTerm={this.state.searchTerm} />
            }
            
        </div>
    );
  }

  /**
   * Event for Chan ing search term. this will execute search if search term is bigger than 3 chars
   *
   * @private
   * @param {string} searchTerm
   * @param {*} results
   * @memberof OmdbContainer
   */
  private _onSearch(searchTerm: string, results: any)
  {
    if(searchTerm.length > 2) 
    {
      this.setState({searchTerm: searchTerm});
    }
    else
    {
      this.setState({searchTerm: ""});
    }
  }

  /**
   * Event for clearing search term
   *
   * @private
   * @memberof OmdbContainer
   */
  private _onClearSearch()
  {
    this.setState({searchTerm: ""});
  }
}

export default OmdbContainer;