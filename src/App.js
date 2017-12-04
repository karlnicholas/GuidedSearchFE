import React, { Component } from 'react';
import ReactDOM from 'react';
import logo from './logo.svg';
import './App.css';
import $ from 'jquery';

window.jQuery = $;
window.$ = $;
global.jQuery = $;
const bootstrap = require('bootstrap');
//console.log(bootstrap);

//const HOST_URL = 'http://localhost:9098/';
const HOST_URL = 'http://rs-opca.b9ad.pro-us-east-1.openshiftapps.com/';
//const API_BASE_URL = 'http://rs-opca.b9ad.pro-us-east-1.openshiftapps.com/rest/gs';
const API_BASE_URL = HOST_URL + 'rest/gs';

class App extends React.Component {

  constructor(props) {
    super(props);
    console.log('app constructor');
    this.state = {
    	myurl: API_BASE_URL + "?highlights=false", 
        api_param_highlights:'false',
        api_param_path:'',
        api_param_term:'',
        term_all_of:'',
        term_none_of:'',
        term_any_of:'',
        term_exact:'',
        fragments:'',
    	entries:  [], 
    	breadcrumb: []  
	};
  }
  
  componentDidMount() {
    var _this = this;
    let ajax_fetch_url = API_BASE_URL + "?highlights=" + this.state.api_param_highlights + 
            "&term=" + this.state.api_param_term + "&path=" + this.state.api_param_path;
//    this.state.myurl
    $.ajax(ajax_fetch_url).then(function (entries) {
      _this.setState(
		{entries: setEntries(entries), breadcrumb: setBreadcrumb(entries)}
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
                <AppNavBar />
                <AppBreadcrumb breadcrumb={this.state.breadcrumb} handleBreadcrumbClick={this.handleBreadcrumbClick.bind(this)} />
                <AppStatuteDisplay entries={this.state.entries}/>
            </span>
	      )
	 } else if ( l > 0 ) {
	    return (
            <span>
                <AppNavBar handleFragmentsClick={this.handleFragmentsClick.bind(this)} handleSearchSubmitClick={this.handleSearchSubmitClick.bind(this)} handleClearClick={this.handleClearClick.bind(this)} />
                <AppBreadcrumb breadcrumb={this.state.breadcrumb} handleBreadcrumbClick={this.handleBreadcrumbClick.bind(this)} />
                <AppTitleTable entries={this.state.entries} handleDrillInClick={this.handleDrillInClick.bind(this)} />
            </span>
	    )
	 } else {
	    return (
	       <div>Loading ...</div>
	    )
	 }
   }
   
   handleDrillInClick(fullFacet) {
      if ( fullFacet == null )
      {
          this.setState({api_param_path: ""});
      }
      else
      {
          this.setState({api_param_path: fullFacet});
      }
      this.handleAjax();
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
      this.handleAjax();
    }
   
   handleClearClick() {
//    this.setState({
//        api_param_term: "",
//        term_all_of:"",
//        term_none_of:"",
//        term_any_of:"",
//        term_exact:""
//    });
    this.handleAjax();
   }
   
   handleSearchSubmitClick(event) {
       event.preventDefault();
//    this.setState({
//        api_param_term: $('#search_form_ntm').val(),
//        term_all_of: "",
//        term_none_of: "",
//        term_any_of: "",
//        term_exact: ""
//    });
    this.handleAjax();
   }

   handleAdvancedSearchSubmitClick(event) {
       event.preventDefault();
//        this.setState({
//            term_all_of: $('#inAll').val(),
//            term_none_of: $('#inNot').val(),
//            term_any_of: $('#inAny').val(),
//            term_exact: $('#inExact').val()
//        });

       let full_term = '';
       if(this.state.term_all_of.length)
       {
           full_term+= '%2B'+this.state.term_all_of;
       }
       if(this.state.term_none_of.length)
       {
           full_term+= '-'+this.state.term_none_of;
       }
       if(this.state.term_any_of.length)
       {
           full_term+= '+'+this.state.term_any_of;
       }
       if(this.state.term_exact.length)
       {
           full_term+= '+"'+this.state.term_exact+'"';
       }
        this.setState({
            api_param_term: full_term
        });
        this.handleAjax();
   }
   
   handleFragmentsClick() {
//       this.setState({
//           fragments:'true'
//       });
       this.handleAjax();
   }
   
   handleAjax() {
        let url = API_BASE_URL + "?highlights=" + this.state.api_param_highlights + "&path=" + this.state.api_param_path + 
                "&term=" + this.state.api_param_term + "&fragments=" + this.state.fragments;
        var _this = this;
        $.ajax(url).then(function (entries) {
            _this.setState({entries: setEntries(entries), breadcrumb: setBreadcrumb(entries)});
        });
    }
}

export default App;
    
class AppBreadcrumb extends React.Component {
  render() {
    return (
        <span>
          <Breadcrumb breadcrumb={this.props.breadcrumb} onClick={this.props.handleBreadcrumbClick}/>
        </span>
      )
   }
}

class AppNavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'Please write an essay about your favorite DOM element.',
      search_form_ntm: "",
      inExact:"",
      inAll:"",
      inAny:"",
      inNot:""
    };

//handleClearClick
//handleSearchSubmitClick
//handleSearchSubmitClick
//handleAdvancedSearchSubmitClick
//handleFragmentsClick

    this.handleSubmit = this.handleSubmit.bind(this);
    this.searchInputOnChange = this.searchInputOnChange.bind(this);
    this.inAllInputOnChange = this.inAllInputOnChange.bind(this);
    this.inAnyInputOnChange = this.inAnyInputOnChange.bind(this);
    this.inNotInputOnChange = this.inNotInputOnChange.bind(this);
    this.inExactInputOnChange = this.inExactInputOnChange.bind(this);
  }
  handleSubmit(event) {
    alert('An essay was submitted: ' + this.state.value);
    event.preventDefault();
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
  
  render() {
    return (
        <nav id="navigation" className="navbar navbar-default" role="navigation">
  <div className="navbar-header">
    <a href="search" className="navbar-brand">Guided Search</a>
    <form className="navbar-form navbar-left form-horizontal" role="">
      <input type="text" className="form-control" value={this.state.search_form_ntm} onChange={this.searchInputOnChange} id="search_form_ntm" name="ntm" placeholder="Search" />
      <div className="btn-group dropdown">
        <button type="button" onClick={this.props.handleSearchSubmitClick} className="btn btn-default">Submit</button>
        <button className="btn btn-default dropdown-toggle" data-toggle="dropdown"><span className="caret"></span></button>
        <div className="dropdown-menu container" style={{ width: 350, padding: 15 }}    >
            <div className="row">
            <label htmlFor="inAll" className="control-label col-sm-4">All&nbsp;Of:&nbsp;&nbsp;</label>
            <div className="col-sm-4">
                <input type="text" value={this.state.inAll} onChange={this.inAllInputOnChange} className="form-control" name="inAll" id="inAll" />
            </div>
            </div>
            <div className="row">
            <label htmlFor="inNot" className="control-label col-sm-4">None&nbsp;Of:&nbsp;&nbsp;</label>
            <div className="col-sm-4">
                <input type="text" value={this.state.inNot} onChange={this.inNotInputOnChange} className="form-control" name="inNot" id="inNot" />
            </div>
            </div>
            <div className="row">
            <label htmlFor="inAny" className="control-label col-sm-4">Any&nbsp;Of:&nbsp;&nbsp;</label>
            <div className="col-sm-4">
                <input type="text" value={this.state.inAny} onChange={this.inAnyInputOnChange} className="form-control" name="inAny" id="inAny" />
            </div>
            </div>
            <div className="row">
            <label htmlFor="inExact" className="control-label col-sm-4">Exact&nbsp;Phrase:&nbsp;&nbsp;</label>
            <div className="col-sm-4">
                <input type="text" value={this.state.inExact} onChange={this.inExactInputOnChange} className="form-control" name="inExact" id="inExact" />
            </div>
            </div>
            <div className="row">
            <label htmlFor="submit" className="control-label col-sm-4"></label>
            <div className="col-sm-4">
                <button type="button" onClick={this.props.handleSearchSubmitClick} className="form-control" id="submit">Submit</button>
            </div>
            </div>
        </div>
      </div>
      <button type="button" onClick={this.props.handleClearClick} name="cl" className="btn">Clear</button>
      <button type="button" onClick={this.props.handleFragmentsClick} name="to" className="btn" disabled="disabled">Fragments</button>
      <input type="hidden" name="fs" value="false" />
    </form>
  </div>
  <div className="navbar-right">
    <ul className="nav navbar-nav">
      <li className="dropdown"><a href="#" className="dropdown-toggle navbar-brand" data-toggle="dropdown">Applications <span className="caret"></span></a>
        <ul className="dropdown-menu" role="menu">
          <li><a href="http://op-op.b9ad.pro-us-east-1.openshiftapps.com">Court Opinions</a></li>
          <li><a href="http://gs-op.b9ad.pro-us-east-1.openshiftapps.com">Guided Search</a></li>
        </ul>
      </li>
    </ul>
  </div>
</nav>
      )
   }   
}

class AppTitleTable extends React.Component {
  render() {
    return (
        <div className="panel-group">
        <div className="panel">
          <TitleTable entries={this.props.entries} onClick={this.props.handleDrillInClick}/>
        </div>
        </div>
      )
   }   
}
class AppStatuteDisplay extends React.Component {
  render() {
    return (
        <div className="panel-group">
        <div className="panel">
          <StatuteDisplayTable entries={this.props.entries} />
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
        for (var i = 0; i < l; i++) {
          var statute = entries[i];
          statutes.push(<TitleRow statute={statute} key={i} onClick={(fullFacet)=>this.props.onClick(fullFacet)} />);
        }
        return (<span>{statutes}</span>)
    }
}
class TitleRow extends React.Component{
	render() {
	    var statute = this.props.statute;
//            console.log('Statute: ');
//            console.log(statute);

	    return (
	      <div className="row">
		    <p>
		      <span className="col-xs-1">&nbsp;</span>
		      <a onClick={() => this.props.onClick(statute.fullFacet)} href="#">
                      
                          <span className="col-xs-3">{statute.displayTitle}&nbsp;</span>
                      
                        {
                            statute.statutesBaseClass 
                            ? 
                            <span>
                            <span className="col-xs-5">{statute.statutesBaseClass.title}</span>
                            <span className="col-xs-3">§§&nbsp;{statute.statutesBaseClass.statuteRange.sNumber.sectionNumber}-{statute.statutesBaseClass.statuteRange.eNumber.sectionNumber} </span>
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
		)
    }
}
class StatuteDisplayTable extends React.Component{
    render() {
        var entries = this.props.entries;
        var l = entries.length;
        var statutes = [];
        for (var i = 0; i < l; i++) {
          var statute = entries[i];
          statutes.push(<StatuteDisplayRow statute={statute} key={i}/>);
        }
        return (<span>{statutes}</span>)
    }
}
class StatuteDisplayRow extends React.Component{
	render() {
	    var statute = this.props.statute;
	    return (
	      <div className="row">
		    <pre>
		      <span className="col-xs-1">&nbsp;</span>
		      <span className="col-xs-11">{statute.text}</span>
		    </pre>
	      </div>
		)
    }
}
class Breadcrumb extends React.Component{
    render() {
        var breadcrumb = this.props.breadcrumb;
        var l = breadcrumb.length;
        var trails = [];
        for (var i = 0; i < l; i++) {
          trails.push(<Trail statutesBaseClass={breadcrumb[i]} key={i} onClick={(fullFacet)=>this.props.onClick(fullFacet)} />);
        }
      return (<ol className="breadcrumb">{trails}</ol>)
    }
}
class Trail extends React.Component{
    render() {
      var title = this.props.statutesBaseClass.displayTitle;
      var fullFacet = this.props.statutesBaseClass.fullFacet;
      if ( title == null ) title = 'Home'; 
      return (
		<li><a onClick={()=>this.props.onClick(fullFacet)} href="#">{title}</a></li>
	  )
    }
}

function setEntries(myentries) {
    if ( myentries.entries ) myentries = myentries.entries;
    if ( myentries.length == 0 ) return myentries;
    while ( myentries[0].pathPart ) {
      myentries = myentries[0].entries;
    }
    return myentries;
}

function setBreadcrumb(myentries) {
	var breadcrumb = [myentries];
    if ( myentries.entries ) myentries = myentries.entries;
    if ( myentries.length == 0 ) return myentries;
    var i = 1;
    while ( myentries[0].pathPart ) {
      breadcrumb[i] = myentries[0];
      myentries = myentries[0].entries;
      i++;
    }
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
