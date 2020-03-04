import React from "react";

import {
    Section,
    Question,
    Item,
    MultiSection,
} from 'Components'

export class Node extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        	showID:false,
        }
        // this.getSubNodes = this.getSubNodes.bind(this)
        this.toggleIDs = this.toggleIDs.bind(this)
    }

    componentDidMount() {
        document.addEventListener('toggleIDs', this.toggleIDs);
    }

    componentWillUnmount() {
        document.removeEventListener('toggleIDs', this.toggleIDs);
    }
 
    toggleIDs(e) {
    	if(e.detail != this.state.showID)
    		this.setState({showID:!this.state.showID})
    }

    render(){
        if(this.props.node.nodeType == "Question") {
            return (
                <Question
                    key={this.props.id}
                    node={this.props.node}
                    addAnswer={this.props.addAnswer}
                    getChildrenFn={this.props.getChildrenFn}
                    response={this.props.response}
                    showID={this.state.showID}
                    helpers={this.props.helpers}
                    depth={this.props.depth}
                />
            )
        } else if(this.props.node.nodeType == "Section") {
        	if(this.props.sectionID == null && this.props.node.maxInstances && this.props.node.maxInstances > 0)
        	{
        		return (
        			<MultiSection
        				key={this.props.id}
        				node={this.props.node}
	                    getChildrenFn={this.props.getChildrenFn}
	                    response={this.props.response}
	                    showID={this.state.showID}
                    	helpers={this.props.helpers}
                        depth={this.props.depth+1}
	                />
        		)

        	} else {
	            return (
	                <Section
	                    key={this.props.id}
	                    node={this.props.node}
	                    getChildrenFn={this.props.getChildrenFn}
	                    response={this.props.response}
	                    showID={this.state.showID}
	                    sectionID={this.props.sectionID}
                    	helpers={this.props.helpers}
                        depth={this.props.depth+1}
	                />
	            )
	        }
        } else if(this.props.node.nodeType == "Item") {
            return (
                <Item
                    key={this.props.id}
                    node={this.props.node}
                    showID={this.state.showID}
                    depth={this.props.depth}
                />)
        }
    }
}
