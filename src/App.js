import React from 'react';
import './App.css';
import $ from 'jquery';

window.jQuery = $;
window.$ = $;
global.jQuery = $;
const bootstrap = require('bootstrap');

 const HOST_URL = 'http://gs-opca.b9ad.pro-us-east-1.openshiftapps.com';
 const API_BASE_URL = HOST_URL + '/rest/gs';
//const API_BASE_URL = '/rest/gs';

/**
 * React App base class
 */
class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
        api_param_highlights:'false', /* frag, fragments, highlights - default false */
        api_param_path:'',
        api_param_term:'',
        term_all_of:'',
        term_none_of:'',
        term_any_of:'',
        term_exact:'',
        fragments:'',
        term:'',
    	entries:  [], 
    	breadcrumb: []  
	};
  }
  
  componentDidMount() {
    var _this = this;
    let temp_query_string_term = encodeURIComponent(this.state.api_param_term);
    let ajax_fetch_url = API_BASE_URL + "?fragments=" + this.state.api_param_highlights + 
            "&term=" + temp_query_string_term + "&path=" + this.state.api_param_path;

    $.ajax(ajax_fetch_url).then(function (entries) {
    console.log("Setting Term: "); console.log(setSearchTerm(entries));
    
      _this.setState(
		{fragments: setFragments(entries), totalCount: setTotalCount(entries), term: setSearchTerm(entries), entries: setEntries(entries), breadcrumb: setBreadcrumb(entries)}
      );
    });

  }
  
  render() {
    var entries = this.state.entries;
    var l = entries.length;
    if ( l > 0 ) {
	    return (
            <span>
                <AppNavBar term={this.state.term} handleFragmentsClick={this.handleFragmentsClick.bind(this)} handleSearchSubmitClick={this.handleSearchSubmitClick.bind(this)}
                          handleAdvancedSearchSubmitClick={this.handleAdvancedSearchSubmitClick.bind(this)}  handleClearClick={this.handleClearClick.bind(this)} />
                <AppBreadcrumb breadcrumb={this.state.breadcrumb} handleBreadcrumbClick={this.handleBreadcrumbClick.bind(this)} term={this.state.term} totalCount={this.state.totalCount} />
                { 
                    this.state.entries[0].sectionText 
                    ?
                    <AppStatuteDisplay entries={this.state.entries} term={this.state.term} />
                    :
                    <AppTitleTable fragments={this.state.fragments} entries={this.state.entries} term={this.state.term} handleDrillInClick={this.handleDrillInClick.bind(this)} />
                }
                <div id="footer">Copyright ©, 2017</div>
            </span>
	      )
	 }else {
	    return (
	       <div>Loading ...</div>
	    )
	 }
   }
   
   /**
    * Table link click handler
    */
   handleDrillInClick(fullFacet) {
       console.log("Handling drill click: fullFacet - " + fullFacet);
      if ( fullFacet == null )
      {
          this.setState({api_param_path: ""});
      }
      else
      {
          this.setState({api_param_path: fullFacet});
      }
      let temp_query_string_term = encodeURIComponent($('#search_form_ntm').val());
      
        let url = API_BASE_URL + "?fragments=" + this.state.api_param_highlights + "&path=" + fullFacet + 
                "&term=" + temp_query_string_term;
        var _this = this;
        $.ajax(url).then(function (entries) {
            _this.setState(
		{fragments: setFragments(entries), totalCount: setTotalCount(entries), term: setSearchTerm(entries), entries: setEntries(entries), breadcrumb: setBreadcrumb(entries)}
            );
        });
   }
   
   /**
    * Breadcrumb click handler
    */
   handleBreadcrumbClick(fullFacet) {
      if ( fullFacet == null )
      {
          this.setState({api_param_path: ""});
      }
      else
      {
          this.setState({api_param_path: fullFacet});
      }
      let temp_query_string_term = encodeURIComponent($('#search_form_ntm').val());
      console.log("Handling handleBreadcrumbClick: fullFacet - " + fullFacet);
        let url = API_BASE_URL + "?fragments=" + this.state.api_param_highlights + "&path=" + fullFacet + 
                "&term=" + temp_query_string_term;
        var _this = this;
        $.ajax(url).then(function (entries) {
            _this.setState(
		{fragments: setFragments(entries), totalCount: setTotalCount(entries), term: setSearchTerm(entries), entries: setEntries(entries), breadcrumb: setBreadcrumb(entries)}
            );
        });

    }
   
   /**
    * Clear click handler
    */
   handleClearClick() {
        console.log("Handling clearClick");
        $('#search_form_ntm').val("");
        $('#inAll').val("");
        $('#inNot').val("");
        $('#inAny').val("");
        $('#inExact').val("");
        $('.panel-collapse').collapse('hide');
        this.handleAjax();
   }
   
   /**
    * Search click handler
    */
   handleSearchSubmitClick(event) {
//        let search_term = $('#search_form_ntm').val();
        console.log("Search Term: "+this.state.api_param_term);
        this.handleAjax();
   }

   /**
    * Advanced Search click handler
    */
   handleAdvancedSearchSubmitClick(event) {
        let full_term_query = $('#search_form_ntm').val();
        this.setState({
            api_param_term: full_term_query
        });
        this.handleAjax();
   }
   
   /**
    * Fragments click handler
    */
   handleFragmentsClick() {
       //use value from hidden input field
       this.setState({
           api_param_highlights: $("#highlights").val()
       });
       this.handleAjax();
   }
   
   handleAjax() {
       
       let highlights = $("#highlights").val();
       let query_string_term = $('#search_form_ntm').val();
       query_string_term = query_string_term.split('+').join('%2B');
       query_string_term = query_string_term.split(' ').join('+');
       console.log("query_string_term: "+query_string_term);
       let temp_query_string_term = encodeURIComponent($('#search_form_ntm').val());
        let url = API_BASE_URL + "?fragments=" + highlights + "&path=" + this.state.api_param_path + 
                "&term=" + temp_query_string_term;
        var _this = this;
        $.ajax(url).then(function (entries) {
        console.log('Response Search Term = '+setSearchTerm(entries));
            _this.setState(
		{fragments: setFragments(entries), totalCount: setTotalCount(entries), term: setSearchTerm(entries), entries: setEntries(entries), breadcrumb: setBreadcrumb(entries)}
            );
        });
    }
}

export default App;

/**
 * Breadcrumb component class
 */
class AppBreadcrumb extends React.Component {
  render() {
    return (
          <Breadcrumb entries={this.props.entries} breadcrumb={this.props.breadcrumb} totalCount={this.props.totalCount} term={this.props.term} onClick={this.props.handleBreadcrumbClick}/>
      )
   }
}

/**
 * Navigation Bar component class
 */
class AppNavBar extends React.Component {
    
  constructor(props) {
    super(props);
    let parsed_terms = parseInputTerm(this.props.term);
    console.log("Parsed Terms: " + parsed_terms.allOf);
    
    this.state = {
      search_form_ntm: this.props.term,
      inExact: parsed_terms.exactOf,
      inAll: parsed_terms.allOf,
      inAny: parsed_terms.anyOf,
      inNot: parsed_terms.noneOf,
      highlights: "false"
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFormOnKeyPress = this.handleFormOnKeyPress.bind(this);
    this.handleAdvancedSearch = this.handleAdvancedSearch.bind(this);
    this.handleClearSearch = this.handleClearSearch.bind(this);
    this.handleFragmentSearch = this.handleFragmentSearch.bind(this);
    
    this.searchInputOnChange = this.searchInputOnChange.bind(this);
    this.inAllInputOnChange = this.inAllInputOnChange.bind(this);
    this.inAnyInputOnChange = this.inAnyInputOnChange.bind(this);
    this.inNotInputOnChange = this.inNotInputOnChange.bind(this);
    this.inExactInputOnChange = this.inExactInputOnChange.bind(this);
  }

  /**
   * Handle search form keypress
   */
   handleFormOnKeyPress(event)
   {
       
         if(event.key === 'Enter'){
            console.log('enter press here! ');
            console.log(event.target.id);
            if(event.target.id==='inAny' || event.target.id==='inNot' || event.target.id==='inAll' || event.target.id==='inExact')
            {
                this.handleAdvancedSearch(event);
            }
          }
          else
          {
              console.log('no enter press here! ')
          }
   }

   /**
    * Submit search form collapses.
    */
  handleSubmit(event) {
    event.preventDefault();
    $('.panel-collapse').collapse('hide');
    this.props.handleSearchSubmitClick();
  }

  /**
   * Fill out and handle advanced search form.
   */
  handleAdvancedSearch(event) {
    event.preventDefault();
    $('.dropdown.open .dropdown-toggle').dropdown('toggle');
       let full_term = '';
       if($('#inAll').val().length)
       {
           let input_term = $('#inAll').val();
           input_term = input_term.trim();
           input_term = input_term.split(' ').join(' +');
           full_term+= '+'+input_term+" ";
       }
       if($('#inNot').val().length)
       {
           let input_term = $('#inNot').val();
           input_term = input_term.trim();
           input_term = input_term.split(' ').join(' -');
           full_term+= '-'+input_term+" ";

       }
       if($('#inAny').val().length)
       {
           full_term+= ''+$('#inAny').val()+" ";
       }
       if($('#inExact').val().length)
       {
           full_term+= '"'+$('#inExact').val()+'"';
       }
       $('#search_form_ntm').val(full_term)
       this.setState({search_form_ntm: full_term});
       $('.panel-collapse').collapse('hide');
       this.props.handleAdvancedSearchSubmitClick();
  }

  /**
   * Clear search input and form.
   */
  handleClearSearch(event) {
    this.setState({
        search_form_ntm: "",
        inExact:"",
        inAll:"",
        inAny:"",
        inNot:"",
        highlights:"false"
    });
    $("#highlights").val("false");
    $('.panel-collapse').collapse('hide');
    $("#highlights_button").removeClass("btn-info");
    
    this.props.handleClearClick();
  }
  
  /**
   * Handle fragment button clicked
   */
  handleFragmentSearch(event) {
    let prev_highlights = $("#highlights").val();
    console.log("Updating Value - ");
    if(prev_highlights==='false')
    {
        console.log("Previous Highlights - False");
        $("#highlights").val("true");
        this.setState({ highlights:"true"});
        console.log("Highlights Set to True");
        $("#highlights_button").addClass("btn-info");
    }
    else
    {
        console.log("Previous Highlights - True");
        $("#highlights").val("false");
        this.setState({ highlights:"false"});
        console.log("Highlights Set to False");
        $("#highlights_button").removeClass("btn-info");
        $('.panel-collapse').collapse('hide');
    }
    this.props.handleFragmentsClick();

  }

  /**
   * Handle input changes on search form.
   */
  searchInputOnChange(event) {
    let parsed_terms = parseInputTerm(event.target.value);
    console.log('Search Term---'+parsed_terms.term);
    console.log('New Search Term:' + termFromFilters(parsed_terms));
    
    $('#inAll').val(parsed_terms.allOf);
    $('#inNot').val(parsed_terms.noneOf);
    $('#inAny').val(parsed_terms.anyOf);
    $('#inExact').val(parsed_terms.exactOf);

    this.setState({
        search_form_ntm: event.target.value,
        inExact: parsed_terms.exactOf,
        inAll: parsed_terms.allOf,
        inAny: parsed_terms.anyOf,
        inNot: parsed_terms.noneOf
    });
  }
  /**
   * Handle All Of input search terms
   */
  inAllInputOnChange(event) {
    let parsed_terms = parseInputTerm(this.state.search_form_ntm);
    console.log('Old Search Term:'+parsed_terms.term);
    parsed_terms.allOf = event.target.value;
    console.log('New Search Term:' + termFromFilters(parsed_terms));
    
    $("#search_form_ntm").val(termFromFilters(parsed_terms));
    this.setState({
        inAll: event.target.value,
        search_form_ntm: termFromFilters(parsed_terms)
    });
  }
  /**
   * Handle inputs on inAny search form.
   */
  inAnyInputOnChange(event) {
      console.log("Val changed to: "+event.target.value);
      console.log(event.target);
      
    let parsed_terms = parseInputTerm(this.state.search_form_ntm);
    console.log('Old Search Term:'+parsed_terms.term);
    parsed_terms.anyOf = event.target.value;
    console.log('New Search Term:' + termFromFilters(parsed_terms));
    $("#search_form_ntm").val(termFromFilters(parsed_terms));

    this.setState({
        inAny: event.target.value,
        search_form_ntm: termFromFilters(parsed_terms)
    });
  }
  /**
   * Handle None Of input search terms
   */
  inNotInputOnChange(event) {
      console.log("Val changed to: "+event.target.value);
      console.log(event.target);
      
    let parsed_terms = parseInputTerm(this.state.search_form_ntm);
    console.log('Old Search Term:'+parsed_terms.term);
    parsed_terms.noneOf = event.target.value;
    console.log('New Search Term:' + termFromFilters(parsed_terms));
    $("#search_form_ntm").val(termFromFilters(parsed_terms));

    this.setState({
        inNot: event.target.value,
        search_form_ntm: termFromFilters(parsed_terms)
    });
  }
  /**
   * Handle Exact Phrase input term
   */
  inExactInputOnChange(event) {
      console.log("Val changed to: "+event.target.value);
      console.log(event.target);
    let parsed_terms = parseInputTerm(this.state.search_form_ntm);
    console.log('Old Search Term:'+parsed_terms.term);
    parsed_terms.exactOf = event.target.value;
    console.log('New Search Term:' + termFromFilters(parsed_terms));
    $("#search_form_ntm").val(termFromFilters(parsed_terms));

    this.setState({
        inExact: event.target.value,
        search_form_ntm: termFromFilters(parsed_terms)
    });
  }
  
  render() {
      
    return (
        <nav id="navigation" className="navbar navbar-default navbar-fixed-top">
  <div className="navbar-header">
    <a href="search" className="navbar-brand">Guided Search</a>
    <form className="navbar-form navbar-left form-horizontal" method="post">
      <input  type="text" className="form-control" value={this.state.search_form_ntm} onChange={this.searchInputOnChange} id="search_form_ntm" name="ntm" placeholder="Search" />
      <div className="btn-group dropdown">
        <input type="submit" value="Submit" onClick={this.handleSubmit} className="btn btn-default" />
        <button className="btn btn-default dropdown-toggle" data-toggle="dropdown"><span className="caret"></span></button>
        <div className="dropdown-menu container" style={{ width: 350, padding: 15 }}    >
            <div className="row">
            <label htmlFor="inAll" className="control-label col-sm-4">All&nbsp;Of:&nbsp;&nbsp;</label>
            <div className="col-sm-4">
                <input onKeyPress={this.handleFormOnKeyPress}  type="text" value={this.state.inAll} onChange={this.inAllInputOnChange} className="form-control" name="inAll" id="inAll" />
            </div>
            </div>
            <div className="row">
            <label htmlFor="inNot" className="control-label col-sm-4">None&nbsp;Of:&nbsp;&nbsp;</label>
            <div className="col-sm-4">
                <input onKeyPress={this.handleFormOnKeyPress}  type="text" value={this.state.inNot} onChange={this.inNotInputOnChange} className="form-control" name="inNot" id="inNot" />
            </div>
            </div>
            <div className="row">
            <label htmlFor="inAny" className="control-label col-sm-4">Any&nbsp;Of:&nbsp;&nbsp;</label>
            <div className="col-sm-4">
                <input onKeyPress={this.handleFormOnKeyPress}  type="text" value={this.state.inAny} onChange={this.inAnyInputOnChange} className="form-control" name="inAny" id="inAny" />
            </div>
            </div>
            <div className="row">
            <label htmlFor="inExact" className="control-label col-sm-4">Exact&nbsp;Phrase:&nbsp;&nbsp;</label>
            <div className="col-sm-4">
                <input onKeyPress={this.handleFormOnKeyPress}  type="text" value={this.state.inExact} onChange={this.inExactInputOnChange} className="form-control" name="inExact" id="inExact" />
            </div>
            </div>
            <div className="row">
            <label htmlFor="submit" className="control-label col-sm-4"></label>
            <div className="col-sm-4">
                <input type="submit" value="Submit" onClick={this.handleAdvancedSearch} className="form-control" id="submit" />
            </div>
            </div>
        </div>
      </div>
      <button type="button" onClick={this.handleClearSearch} name="cl" className="btn">Clear</button>
      <FragmentsButton handleFragmentsClick={this.handleFragmentSearch} term={this.props.term} />
      <input type="hidden" id="highlights" name="fs" value={this.state.highlights} />
    </form>
  </div>
  <div className="navbar-right">
    <ul className="nav navbar-nav">
      <li className="dropdown"><a style={{cursor: 'pointer'}} className="dropdown-toggle navbar-brand" data-toggle="dropdown">Applications <span className="caret"></span></a>
        <ul className="dropdown-menu" role="menu">
          <li><a href="http://op-op.b9ad.pro-us-east-1.openshiftapps.com">Court Opinions</a></li>
          <li><a href="/">Guided Search</a></li>
        </ul>
      </li>
    </ul>
  </div>
</nav>
      )
   }   
}

/**
 * Fragments Button component class
 */
class FragmentsButton extends React.Component {
  render() {
      if(this.props.term)
      {
          return (
            <button type="button" 
                onClick={this.props.handleFragmentsClick} 
                name="to" 
                id="highlights_button"
                className="btn" 
            >
                Fragments 
            </button>
          )
      }
      else
      {
        return (
            <button type="button" 
                onClick={this.props.handleFragmentsClick} 
                name="to" 
                id="highlights_button"
                className="btn" 
                disabled="disabled"
            >
                Fragments 
            </button>
          )
      }
   }
}

/**
 * Breadcrumb component class
 */
class AppTitleTable extends React.Component {
  render() {
    return (
        <div className="panel-group" id="accordion">
          <TitleTable fragments={this.props.fragments} entries={this.props.entries} onClick={this.props.handleDrillInClick}/>
        </div>
      )
   }
}

/**
 * App Statute Display Component class
 */
class AppStatuteDisplay extends React.Component {
  render() {
    return (
        <div className="container-fluid">
            <div className="panel-group" id="accordion">
                <StatuteDisplayTable entries={this.props.entries} term={this.props.term} />
            </div>
        </div>
      )
   }   
}

/**
 * Title Table Display Component class
 */
class TitleTable extends React.Component{
    render() {
        var entries = this.props.entries;
        var l = entries.length;
        var statutes = [];
        let collapse_data_key = '';
        let collapse_data_href = '';
        for (var i = 0; i < l; i++) {
          var statute = entries[i];
          collapse_data_key = 'collapse'+i;
          collapse_data_href = '#collapse'+i;
          statutes.push(<TitleRow fragments={this.props.fragments} statute={statute} collapse_data_href={collapse_data_href} collapse_data_key={collapse_data_key} key={i} onClick={(fullFacet)=>this.props.onClick(fullFacet)} />);
        }

        return (<div className="panel ">{statutes}</div>)
    }
}

/**
 * Title Row Display Component class
 */
class TitleRow extends React.Component{
	render() {
	    var statute = this.props.statute;
            var statuteSectionText = '';
            
            if(statute.entries && statute.entries.length)
            {
                for(let i=0;i< statute.entries.length; i++)
                {
                    if(statute.entries[i].sectionText)
                    {
                        statuteSectionText+=statute.entries[i].text+'<br /><br /><br />';
                    }
                }
            }
	    return (
	      <div className="panel-heading">
                <div className="row panel-title">
		    <p>
                    {
                      this.props.fragments && statuteSectionText.length ? 
                      <span className="col-xs-1">
                        <a data-toggle="collapse" data-parent="#accordion" href={this.props.collapse_data_href}>
                            <span className="glyphicon glyphicon-asterisk"></span>
                        </a>
                        &nbsp;
                      </span>
                      :
                      <span className="col-xs-1"></span>
                    }
		      <a onClick={() => this.props.onClick(statute.fullFacet)} style={{cursor: 'pointer'}} >
                          <span className="col-xs-3">{statute.displayTitle}&nbsp; 
                            <span className="badge pull-right">{statute.count ? statute.count : ""}</span>
                          </span>
                      
                        {
                            statute.statutesBaseClass 
                            ? 
                            <span>
                            <span className="col-xs-5">{statute.statutesBaseClass.title}</span>
                                <StatuteRangeDisplay statutesBaseClass={statute.statutesBaseClass} />
                            </span>
                            :
                            <span>
                            <span className="col-xs-5">No Title</span>
                            <span className="col-xs-3">No Title</span>
                            </span>
                        }
		      </a>
		    </p>
	        </div>
	        <div className="panel-collapse collapse" id={this.props.collapse_data_key}>
	          <div className="panel-body">
                 <pre dangerouslySetInnerHTML={{ __html: statuteSectionText }} />
              </div>
            </div>
          </div>
		)
    }
}

/**
 * Statute Table Display Component class
 */
class StatuteDisplayTable extends React.Component{
    render() {
        var entries = this.props.entries;
        var search_term = this.props.term;
        var l = entries.length;
        var statutes = [];
        for (var i = 0; i < l; i++) {
          var statute = entries[i];
        if(statute.text && statute.text.length && search_term && search_term.length)
        {
//            statute.text = statute.text.split(search_term).join('<mark><strong><u>' + search_term + '</u></strong></mark>');
        }
          statutes.push(<StatuteDisplayRow statute={statute} key={i}/>);
        }
        return (<div className="panel ">{statutes}</div>)
    }
}

/**
 * Statute Display Component class
 */
class StatuteDisplayRow extends React.Component{
	render() {
	    return (
         <div className="panel-body">
           <pre dangerouslySetInnerHTML={{ __html: this.props.statute.text }} />
	     </div>
		)
    }
}

/**
 * Individual Breadcrumb rendering component class
 */
class Breadcrumb extends React.Component{
    render() {
        var breadcrumb = this.props.breadcrumb;
        var term = this.props.term;
        
        var l = breadcrumb.length;
        var trails = [];

        for (var i = 0; i < l; i++) {

        let extra_part = '';
        if(i===(l-1))
        {
            let last_section = breadcrumb[breadcrumb.length - 1];
            if(last_section.pathPart && last_section.statutesBaseClass)
            {
                extra_part = ' - ' + last_section.statutesBaseClass.title;
            }
        }

          trails.push(<Trail extraPart={extra_part} statutesBaseClass={breadcrumb[i]} key={i} onClick={(fullFacet)=>this.props.onClick(fullFacet)} />);
        }
        if(term && term.length)
        {
            return (
                <ol className="breadcrumb">
                {trails}
                <li><span className="badge pull-right">{this.props.totalCount}</span></li>
                </ol>
                )
        }
        else
        {
            return (<ol className="breadcrumb">{trails}</ol>)
        }
      
    }
}

/**
 * Breadcrumb trail rendering component class
 */
class Trail extends React.Component{
    render() {
      var title = this.props.statutesBaseClass.displayTitle;
      var fullFacet = this.props.statutesBaseClass.fullFacet;
      if ( title == null )
      {
          title = 'Home'; 
      }
      else
      {
          title+=this.props.extraPart;
      }
      return (
		<li><a onClick={()=>this.props.onClick(fullFacet)} style={{cursor: 'pointer'}}>{title}</a></li>
	  )
    }
}

/**
 * StatuteRange component class
 */
class StatuteRangeDisplay extends React.Component{
    render() {
      let statuteRange = this.props.statutesBaseClass.statuteRange;
      
      return (
              <span> 
		{
                    statuteRange && statuteRange.sNumber && statuteRange.eNumber 
                    ?
                    <span className="col-xs-3">§§&nbsp;{statuteRange.sNumber.sectionNumber}-{statuteRange.eNumber.sectionNumber} </span>
                    :
                    statuteRange.sNumber 
                        ?
                        <span className="col-xs-3">§§&nbsp;{statuteRange.sNumber.sectionNumber}- </span>
                        :
                        statuteRange.eNumber 
                            ?
                            <span className="col-xs-3">§§&nbsp;-{statuteRange.eNumber.sectionNumber} </span>
                            :
                            <span className="col-xs-3">§§&nbsp;</span>
                }
              </span>
	  )
    }
}

/**
 * Format json for rendering table
 * @param myentries
 * @returns
 */
function setEntries(myentries) {
    if ( myentries.entries ) myentries = myentries.entries;
    if ( myentries.length === 0 ) return myentries;
    while ( myentries[0].pathPart ) {
      myentries = myentries[0].entries;
    }
    return myentries;
}

/**
 * Return search term from response
 * @param input_json
 * @returns
 * 
 */
function setSearchTerm(input_json) {
    
    if ( input_json.term && input_json.term.length )
    {
        return input_json.term;
    }
    else
    {
        return "";
    }
}

/**
 * Return total results count
 * @param input_json
 * @returns
 */
function setTotalCount(input_json) {
    
    if ( input_json.totalCount)
    {
        return input_json.totalCount;
    }
    else
    {
        return "";
    }
}

/**
 * Format json for Fragments
 * @param input_json
 * @returns
 */
function setFragments(input_json) {
    
    if ( input_json.fragments)
    {
        return input_json.fragments;
    }
    else
    {
        return false;
    }
}

/**
 * Format json for breadcrumb
 * @param myentries
 * @returns
 */
function setBreadcrumb(myentries) {
	var breadcrumb = [myentries];
    if ( myentries.entries ) myentries = myentries.entries;
    if ( myentries.length === 0 ) return myentries;
    var i = 1;
    while ( myentries[0].pathPart ) {
      breadcrumb[i] = myentries[0];
      myentries = myentries[0].entries;
      i++;
    }
    return breadcrumb;
}

/**
 * Function to create search form field contents. 
 * @param term
 * @returns
 */
function parseInputTerm(term)
{
    var term_split = term.split('"');
    var exactOf = "";
    var anyOf = "";
    var allOf = "";
    var noneOf = "";
    var termWithoutExact = term;
    if(term_split.length>2)
    {
        exactOf = term_split[1];
        term_split.splice(1,1);
        termWithoutExact = term_split.join('');
    }
    
    var term_split_2 = termWithoutExact.split(" ");
    for(let i=0;i<term_split_2.length;i++)
    {
        if(term_split_2[i].length && '+'===term_split_2[i].charAt(0) && term_split_2[i].substring(1).trim().length > 0)
        {
            anyOf+= ' ' + term_split_2[i].substring(1).trim();
        } else if(term_split_2[i].length && '-'===term_split_2[i].charAt(0) && term_split_2[i].substring(1).trim().length > 0)
        {
            noneOf+= ' ' + term_split_2[i].substring(1).trim();
        }else if(term_split_2[i].length)
        {
            allOf+= ' ' + term_split_2[i].trim();
        }
    }
    
    return {
        'exactOf':exactOf.trim(),
        'anyOf':anyOf.trim(),
        'allOf':allOf.trim(),
        'noneOf':noneOf.trim(),
        'term':term
        };
}

/**
 * Function to format search terms for apache lucene search engine
 * 
 * @param parsedTerms
 * @returns
 */
function termFromFilters(parsedTerms)
{
    console.log("Exact: "+parsedTerms.exactOf);
    console.log("Any: "+parsedTerms.anyOf);
    console.log("All: "+parsedTerms.allOf);
    console.log("None: "+parsedTerms.noneOf);
    
    var term = '';
    if(parsedTerms.anyOf.trim().length)
    {
        term+='+' + parsedTerms.anyOf.trim().split(' ').join(' +');
    }
    if(parsedTerms.noneOf.trim().length)
    {
        term+=' -' + parsedTerms.noneOf.trim().split(' ').join(' -');
        
    }
    if(parsedTerms.allOf.length)
    {
        term+=' ' + parsedTerms.allOf;
    }
    if(parsedTerms.exactOf.length)
    {
        term+=' "' + parsedTerms.exactOf + '"';
    }
    console.log("Final Term: "+term);
    return term;
}