import React from "react";

import {
} from 'Components'

var getInView = (items, pageheight) => {
	// Calculate which item is closest to "eyeline" position
	var inView = {}
	for(let i = 0; i < items.length; i++) {
		var top = items[i].ref.getBoundingClientRect().top
		var height = items[i].ref.getBoundingClientRect().height
		var bottom = items[i].ref.getBoundingClientRect().bottom
		if((top > 0 && top < pageheight) || (top < 0 && (top + height) > pageheight/2))
			inView[i] = 1
	}
	return inView
}

export class Tracker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        	sortedItems:[],
        	scroll:0,
        	inView:{},
        	height:window.innerHeight,
        }
        // this.getSubNodes = this.getSubNodes.bind(this)
        this.getItems = this.getItems.bind(this)
        this.handleScroll = this.handleScroll.bind(this)
        this.findItem = this.findItem.bind(this)
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }
    componentDidMount() {
    	document.addEventListener('trackerScroll', this.handleScroll)
      	window.addEventListener('resize', this.updateWindowDimensions);
      
	
	}

	componentWillUnmount() {
	    document.removeEventListener('trackerScroll', this.handleScroll)
	    window.removeEventListener('resize', this.updateWindowDimensions);

	}


	updateWindowDimensions() {
		this.setState({ height: window.innerHeight });
	}

	handleScroll(e) {
		var inView = getInView(this.state.sortedItems, this.state.height)
		this.setState({inView:inView})
	}

    static getDerivedStateFromProps(nextProps, prevState) {
		if(Object.keys(nextProps.items).length != prevState.sortedItems.length || prevState.sortedItems.length == 0) {
	        var sortedItems = Object.keys(nextProps.items)
	        .map(x => {return nextProps.items[x]})
	        .filter(x => x.ref != null)
	        .sort((a, b) => {
	            if(a && !b)
	                return 1
	            else if(b && !a)
	                return -1
	            else if(!a && !b)
	                return 0
	            else
	                return a.ref.offsetTop - b.ref.offsetTop
	        })
	        return {sortedItems:sortedItems, inView:getInView(sortedItems, prevState.height)}
	    }
	    return null
    }

    findItem(x) {
    	if(x.ref.offsetParent != null)
			this.props.scrollTo(x)
    }

	getItems() {
        return this.state.sortedItems.map((x, ix) => {
        	var classes = `trackerItem ${ix in this.state.inView?"selected":""} ${x.ref.offsetParent == null?"collapsed":""} ${x.depth > 1?"nested-"+(x.depth-1):""}`
    		return <div className={classes} key={ix} onClick={(e) => {this.findItem(x)}}>
    			{x.node.title}
    		</div>
    	})
	}

    render(){
    	return <div className="tracker" style={{opacity:`${this.state.sortedItems.length>0?1:0}`}}>
    		<h4 style={{textAlign:"center"}}> Sections </h4>
    		<div className="trackerItems">
    			{this.getItems()}
    		</div>
	    </div>
    }
}
