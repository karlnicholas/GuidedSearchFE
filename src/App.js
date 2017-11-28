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

const HOST_URL = 'http://localhost:9098/';
//const API_BASE_URL = 'http://rs-opca.b9ad.pro-us-east-1.openshiftapps.com/rest/gs';
const API_BASE_URL = HOST_URL + 'rest/gs';

class App extends React.Component {

  constructor(props) {
    super(props);
    console.log('app constructor');
    this.state = {
    	myurl: API_BASE_URL + "?highlights=false", 
    	entries:  [], 
    	breadcrumb: []  
	};
  }
  
  componentDidMount() {
    var _this = this;
    $.ajax(this.state.myurl).then(function (entries) {
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
                <AppNavBar />
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
      var url = API_BASE_URL + "?highlights=false&path=" + fullFacet;
      var _this = this;
//      console.log("Full Facet:");
//      console.log(url);
      $.ajax(url).then(function (entries) {
        _this.setState({entries: setEntries(entries), breadcrumb: setBreadcrumb(entries)});
      });
    }
   handleBreadcrumbClick(fullFacet) {
      if ( fullFacet == null ) 
      	var url = API_BASE_URL + "?highlights=false";
      else 
      	var url = API_BASE_URL + "?highlights=false&path=" + fullFacet;
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
  render() {
    return (
        <nav id="navigation" class="navbar navbar-default" role="navigation">
  <div class="navbar-header">
    <a href="search" class="navbar-brand">Guided Search</a>
    <form class="navbar-form navbar-left form-horizontal" role="form" method="post">
      <input type="text" class="form-control" name="ntm" value="" placeholder="Search" />
      <div class="btn-group dropdown">
        <button type="submit" class="btn btn-default">Submit</button>
        <button class="btn btn-default dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></button>
        <div class="dropdown-menu container" style={{ width: 350, padding: 15 }}    >
            <div class="row">
            <label for="inAll" class="control-label col-sm-4">All&nbsp;Of:&nbsp;&nbsp;</label>
            <div class="col-sm-4"><input type="text" class="form-control" name="inAll" value="" id="inAll" /></div>
            </div>
            <div class="row">
            <label for="inNot" class="control-label col-sm-4">None&nbsp;Of:&nbsp;&nbsp;</label>
            <div class="col-sm-4"><input type="text" class="form-control" name="inNot" value="" id="inNot" /></div>
            </div>
            <div class="row">
            <label for="inAny" class="control-label col-sm-4">Any&nbsp;Of:&nbsp;&nbsp;</label>
            <div class="col-sm-4"><input type="text" class="form-control" name="inAny" value="" id="inAny" /></div>
            </div>
            <div class="row">
            <label for="inExact" class="control-label col-sm-4">Exact&nbsp;Phrase:&nbsp;&nbsp;</label>
            <div class="col-sm-4"><input type="text" class="form-control" name="inExact" value="" id="inExact" /></div>
            </div>
            <div class="row">
            <label for="submit" class="control-label col-sm-4"></label>
            <div class="col-sm-4"><button type="submit" class="form-control" id="submit">Submit</button></div>
            </div>
        </div>
      </div>
      <button type="submit" name="cl" class="btn">Clear</button>
      
        
        
        
          <button type="submit" name="to" class="btn" disabled="disabled">Fragments</button>
        
      
      <input type="hidden" name="fs" value="false" />
    </form>
  </div>
  <div class="navbar-right">
    <ul class="nav navbar-nav">
      <li class="dropdown"><a href="#" class="dropdown-toggle navbar-brand" data-toggle="dropdown">Applications <span class="caret"></span></a>
        <ul class="dropdown-menu" role="menu">
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
            console.log(statute);

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


