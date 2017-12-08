import React from 'react';
//import ReactDOM from 'react';
//import logo from './logo.svg';
import './App.css';
import $ from 'jquery';

window.jQuery = $;
window.$ = $;
global.jQuery = $;
const bootstrap = require('bootstrap');

const HOST_URL = 'http://rs-opca.b9ad.pro-us-east-1.openshiftapps.com/';

const API_BASE_URL = HOST_URL + 'rest/gs';

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
    let ajax_fetch_url = API_BASE_URL + "?highlights=" + this.state.api_param_highlights + 
            "&term=" + this.state.api_param_term + "&path=" + this.state.api_param_path;

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
    console.log("entries length");
    console.log(l);
//    console.log(this.state.entries);
    if ( l > 0 && entries[0].sectionText) {
	    return (
            <span>
                <AppNavBar term={this.state.term} handleFragmentsClick={this.handleFragmentsClick.bind(this)} handleSearchSubmitClick={this.handleSearchSubmitClick.bind(this)}
                          handleAdvancedSearchSubmitClick={this.handleAdvancedSearchSubmitClick.bind(this)}  handleClearClick={this.handleClearClick.bind(this)} />
                <AppBreadcrumb breadcrumb={this.state.breadcrumb} handleBreadcrumbClick={this.handleBreadcrumbClick.bind(this)} term={this.state.term} totalCount={this.state.totalCount} />
                <AppStatuteDisplay entries={this.state.entries} term={this.state.term} />
                <div id="footer">Copyright ©, 2014</div>
            </span>
	      )
	 } else if ( l > 0 ) {
	    return (
            <span>
                <AppNavBar term={this.state.term} handleFragmentsClick={this.handleFragmentsClick.bind(this)} handleSearchSubmitClick={this.handleSearchSubmitClick.bind(this)}
                          handleAdvancedSearchSubmitClick={this.handleAdvancedSearchSubmitClick.bind(this)}  handleClearClick={this.handleClearClick.bind(this)} />
                <AppBreadcrumb breadcrumb={this.state.breadcrumb} handleBreadcrumbClick={this.handleBreadcrumbClick.bind(this)} term={this.state.term} totalCount={this.state.totalCount} />
                <AppTitleTable fragments={this.state.fragments} entries={this.state.entries} term={this.state.term} handleDrillInClick={this.handleDrillInClick.bind(this)} />
                <div id="footer">Copyright ©, 2014</div>
            </span>
	    )
	 } else {
	    return (
	       <div>Loading ...</div>
	    )
	 }
   }
   
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
        let url = API_BASE_URL + "?highlights=" + this.state.api_param_highlights + "&path=" + fullFacet + 
                "&term=" + $('#search_form_ntm').val();// + "&fragments=" + this.state.fragments;
        var _this = this;
        $.ajax(url).then(function (entries) {
            _this.setState(
		{fragments: setFragments(entries), totalCount: setTotalCount(entries), term: setSearchTerm(entries), entries: setEntries(entries), breadcrumb: setBreadcrumb(entries)}
            );
        });
   }
   
   handleBreadcrumbClick(fullFacet) {
      if ( fullFacet == null )
      {
          this.setState({api_param_path: ""});
      }
      else
      {
          this.setState({api_param_path: fullFacet});
      }
      console.log("Handling handleBreadcrumbClick: fullFacet - " + fullFacet);
        let url = API_BASE_URL + "?highlights=" + this.state.api_param_highlights + "&path=" + fullFacet + 
                "&term=" + $('#search_form_ntm').val();// + "&fragments=" + this.state.fragments;
        var _this = this;
        $.ajax(url).then(function (entries) {
            _this.setState(
		{fragments: setFragments(entries), totalCount: setTotalCount(entries), term: setSearchTerm(entries), entries: setEntries(entries), breadcrumb: setBreadcrumb(entries)}
            );
        });

    }
   
   handleClearClick() {
        console.log("Handling clearClick");
        $('#search_form_ntm').val("");
        $('#inAll').val("");
        $('#inNot').val("");
        $('#inAny').val("");
        $('#inExact').val("");
        this.handleAjax();
   }
   
   handleSearchSubmitClick(event) {
//       console.log(event);
       
//        event.preventDefault();
//        let search_term = $('#search_form_ntm').val();
        console.log("Search Term: "+this.state.api_param_term);
        this.handleAjax();
   }

   handleAdvancedSearchSubmitClick(event) {
//       event.preventDefault();
//        this.setState({
//            term_all_of: $('#inAll').val(),
//            term_none_of: $('#inNot').val(),
//            term_any_of: $('#inAny').val(),
//            term_exact: $('#inExact').val()
//        });

//       let full_term = '';
//       let full_term_query = '';
//       if($('#inAll').val().length)
//       {
//           full_term+= '%2B'+$('#inAll').val();
//           full_term_query+='+'+$('#inAll').val()+" ";
//       }
//       if($('#inNot').val().length)
//       {
//           full_term+= '-'+$('#inNot').val();
//           full_term_query+='-'+$('#inNot').val()+" ";
//       }
//       if($('#inAny').val().length)
//       {
//           full_term+= '+'+$('#inAny').val();
//           full_term_query+=' '+$('#inAny').val()+" ";
//       }
//       if($('#inExact').val().length)
//       {
//           full_term+= '+"'+$('#inExact').val()+'"';
//           full_term_query+='"'+$('#inExact').val()+'"';
//       }
//       console.log("full_term_query - "+full_term_query);
       
        let full_term_query = $('#search_form_ntm').val();
        this.setState({
            api_param_term: full_term_query
        });
        this.handleAjax();
   }
   
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
        let url = API_BASE_URL + "?highlights=" + highlights + "&path=" + this.state.api_param_path + 
                "&term=" + query_string_term;// + "&fragments=" + this.state.fragments;
        var _this = this;
        $.ajax(url).then(function (entries) {
//            _this.setState({entries: setEntries(entries), breadcrumb: setBreadcrumb(entries)});
            _this.setState(
		{fragments: setFragments(entries), totalCount: setTotalCount(entries), term: setSearchTerm(entries), entries: setEntries(entries), breadcrumb: setBreadcrumb(entries)}
            );
        });
    }
}

export default App;
    
class AppBreadcrumb extends React.Component {
  render() {
    return (
          <Breadcrumb entries={this.props.entries} breadcrumb={this.props.breadcrumb} totalCount={this.props.totalCount} term={this.props.term} onClick={this.props.handleBreadcrumbClick}/>
      )
   }
}

class AppNavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search_form_ntm: "",
      inExact:"",
      inAll:"",
      inAny:"",
      inNot:"",
      highlights:"false"
    };

//handleClearClick
//handleSearchSubmitClick
//handleSearchSubmitClick
//handleAdvancedSearchSubmitClick
//handleFragmentsClick

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
  
   handleFormOnKeyPress(event)
   {
       
         if(event.key === 'Enter'){
            console.log('enter press here! ');
            console.log(event.target.id);
            if(event.target.id==='inAny' || event.target.id==='inNot' || event.target.id==='inAll' || event.target.id==='inExact')
            {
                this.handleAdvancedSearch(event);
            }
            else
            {
                
            }
          }
          else
          {
              console.log('no enter press here! ')
          }
   }
   
  handleSubmit(event) {
    event.preventDefault();
    this.setState({
        inExact:"",
        inAll:"",
        inAny:"",
        inNot:""
    });
    this.props.handleSearchSubmitClick();
  }

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
//           full_term+= '-'+$('#inNot').val()+" ";
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
       this.props.handleAdvancedSearchSubmitClick();
  }
  
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
    $("#highlights_button").removeClass("btn-info");
    
    this.props.handleClearClick();
  }
  
  handleFragmentSearch(event) {
      
//    event.preventDefault();
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
    }
    this.props.handleFragmentsClick();

  }

  searchInputOnChange(event) {
      console.log("Val changed to: "+event.target.value);
      console.log(event.target);
    this.setState({search_form_ntm: event.target.value});
  }
  inAllInputOnChange(event) {
      console.log("Val changed to: "+event.target.value);
      console.log(event.target);
    this.setState({inAll: event.target.value});
  }
  inAnyInputOnChange(event) {
      console.log("Val changed to: "+event.target.value);
      console.log(event.target);
    this.setState({inAny: event.target.value});
  }
  inNotInputOnChange(event) {
      console.log("Val changed to: "+event.target.value);
      console.log(event.target);
    this.setState({inNot: event.target.value});
  }
  inExactInputOnChange(event) {
      console.log("Val changed to: "+event.target.value);
      console.log(event.target);
    this.setState({inExact: event.target.value});
  }
  
//  highlightsOnChange(event) {
//      console.log("Val changed to: "+event.target.value);
//      console.log(event.target);
//    this.setState({inNot: event.target.value});
//  }
  render() {
      
//      var input_search_term = this.props.term;
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
      <li className="dropdown"><a href="#" className="dropdown-toggle navbar-brand" data-toggle="dropdown">Applications <span className="caret"></span></a>
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

class AppTitleTable extends React.Component {
  render() {
//      <div className="container-fluid"></div>
    return (
        
        <div className="panel-group" id="accordion">
          <TitleTable fragments={this.props.fragments} entries={this.props.entries} onClick={this.props.handleDrillInClick}/>
        
        </div>
      )
   }
}
class AppStatuteDisplay extends React.Component {
  render() {
//      <div className="panel panel-default">
//      </div>
    return (
        <div className="container-fluid">
            <div className="panel-group" id="accordion">
                <StatuteDisplayTable entries={this.props.entries} term={this.props.term} />
            </div>
        </div>
      )
   }   
}
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
//        panel-default
        return (<div className="panel ">{statutes}</div>)
    }
}
class TitleRow extends React.Component{
	render() {
	    var statute = this.props.statute;
//            console.log('Statute: ');
//            console.log(statute);
//<pre dangerouslySetInnerHTML={{ __html: this.props.statute.text }} />
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
		      <a onClick={() => this.props.onClick(statute.fullFacet)} href="#">
                      
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
//        panel-default
        return (<div className="panel ">{statutes}</div>)
    }
}

class StatuteDisplayRow extends React.Component{
	render() {
//	    var statute = this.props.statute;
//            		      <span className="col-xs-1">&nbsp;</span>
//		      <span className="col-xs-11">Again{statute.text}</span>
//
//
	    return (
	      <div className="panel-body">
		<pre dangerouslySetInnerHTML={{ __html: this.props.statute.text }} />
	      </div>
		)
    }
}
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
		<li><a onClick={()=>this.props.onClick(fullFacet)} href="#">{title}</a></li>
	  )
    }
}


class StatuteRangeDisplay extends React.Component{
//    <span className="col-xs-3">§§&nbsp;{statute.statutesBaseClass.statuteRange.sNumber.sectionNumber}-{statute.statutesBaseClass.statuteRange.eNumber.sectionNumber} </span>
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

function setEntries(myentries) {
    if ( myentries.entries ) myentries = myentries.entries;
    if ( myentries.length === 0 ) return myentries;
    while ( myentries[0].pathPart ) {
      myentries = myentries[0].entries;
    }
    return myentries;
}

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

function setFragments(input_json) {
    
//    return true; //testing only
    if ( input_json.fragments)
    {
        return input_json.fragments;
    }
    else
    {
        return false;
    }
}

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
//    console.log("breadcrumb: "+breadcrumb);
//    console.log(breadcrumb);
    return breadcrumb;
}


/**
 * %2BTimtim+-apple+civil+"Misc"
 * Any of --> %2B
 * None of --> -
 * Any of --> +
 * Exact Phrase --> +""
 * 
 * term_all_of
 * term_none_of
 * term_any_of
 * term_exact
 * 
 * fragments
 */
