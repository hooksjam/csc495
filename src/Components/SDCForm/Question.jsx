import React from "react";

import {
    TextInput,
    RadioInput,
    CheckboxInput,
    Collapsible,
    Node,
} from 'Components'

export class Question extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            expanded: true
        }
        this.toggleExpand = this.toggleExpand.bind(this)
        this.getInput = this.getInput.bind(this)
        this.toggleEvent = this.toggleEvent.bind(this)
        this.getSubNodes = this.getSubNodes.bind(this)
    }

    componentDidMount() {
        document.addEventListener('toggleQuestions', this.toggleEvent);
    }

    componentWillUnmount() {
        document.removeEventListener('toggleQuestions', this.toggleEvent);
    }

    toggleEvent(e) {
        if(e.detail != this.state.expanded)
            this.toggleExpand()
    }

    toggleExpand() {
        this.setState({
            expanded: !this.state.expanded
        });
    }


    getSubNodes() {   
        if (!this.props.node.dependencies || this.props.node.dependencies.length == 0)
            return null

        var filtered = this.props.node.dependencies.filter(dep => dep.choiceID == null).map(dep => this.props.getChildrenFn(dep.nodeID))

        if(this.props.node.title == "Overall size:")
            console.log("TF mate", filtered.length, this.props.node)
        if(filtered.length == 0)
            return null

        return filtered.map((node, ix) => {
            return <Node
                    key={`${this.props.id}_${ix}_${node.referenceID}`}
                    id={`${this.props.id}_${ix}_${node.referenceID}`}
                    node={node}
                    nested={true}
                    addAnswer={this.props.addAnswer}
                    deleteAnswer={this.props.deleteAnswer}
                    getChildrenFn={this.props.getChildrenFn}
                    response={this.props.response}
                    helpers={this.props.helpers}
                    depth={this.props.depth}
                    instance={this.props.instance}

                    
                    />
            })
    }

    getInput() {
        if (this.props.node.hasOwnProperty("choices")) {
            if(this.props.node.choices.length == 0)
                return null
            if (this.props.node.maxSelections === 1) {
                return <RadioInput 
                    node={this.props.node} 
                    showID={this.props.showID} 
                    addAnswer={this.props.addAnswer} 
                    deleteAnswer={this.props.deleteAnswer}
                    response={this.props.response} 
                    getChildrenFn={this.props.getChildrenFn}
                    instance={this.props.instance}
                />
            } else {
                return <CheckboxInput 
                    node={this.props.node} 
                    showID={this.props.showID} 
                    addAnswer={this.props.addAnswer} 
                    deleteAnswer={this.props.deleteAnswer}
                    response={this.props.response} 
                    getChildrenFn={this.props.getChildrenFn}
                    instance={this.props.instance}
                />
            }
        } else {
            return <TextInput 
                node={this.props.node} 
                field={this.props.node.field} 
                addAnswer={this.props.addAnswer} 
                deleteAnswer={this.props.deleteAnswer}
                response={this.props.response}
                instance={this.props.instance}
                />

        }

    }

    render(){
        return (<div className="question" ref={(x) => {this.props.helpers && this.props.helpers.registerNode(this.props.node, x, this.props.depth)}}>
            <div className="questionTitle" onClick={this.toggleExpand}>
                <div className={`arrow fas fa-caret-${this.state.expanded?"down":"right"}`}/>
                <span> {this.props.node.title} </span>
                {this.props.showID && <div className="identifier"><span>{this.props.node.referenceID}</span></div>}
            </div>
            <Collapsible show={this.state.expanded}>
                {this.getInput()}
                {this.getSubNodes()}
            </Collapsible>
        </div>)
    }
}

