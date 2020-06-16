import React from "react";

import {
    Section,
    Question,
    TextInput,
    Node,
} from "Components";

var timeout = null;

export class CheckboxInput extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            checked: {},
            showOnSelection: true,
            responseID:null,
            selfUpdate:false
        }

        this.onChange = this.onChange.bind(this)
        this.getChoices = this.getChoices.bind(this)
        this.getSubNodes = this.getSubNodes.bind(this)
        this.getField = this.getField.bind(this)
    }


    static getDerivedStateFromProps(nextProps, prevState) {
        if(prevState.selfUpdate)
            return {selfUpdate:false}

        if(nextProps.response != null && nextProps.node != null && (Object.keys(prevState.checked).length == 0 || nextProps.response._id != prevState.responseID)) {
            var answer = nextProps.response.getAnswerFn(nextProps.node.referenceID, nextProps.instance)
            if(answer && answer.choices.length > 0) {
                var checked = {}
                for(let i = 0; i < answer.choices.length; i++) {
                    checked[answer.choices[i].choiceID] = 1
                }
                return {
                    checked:checked,
                    responseID: nextProps.response._id
                }
            } else {
                if(nextProps.response != null)
                    return {checked:{}, responseID:nextProps.response._id}
                else
                    return {selectedChoice:{}, responseID:null}
            }
        }
        if(nextProps.response != null)
            return {responseID:nextProps.response._id}
        return null
    }

    onChange(e) {
        var newState = {...this.state}
        var target = e.target
        console.log("BEFORE CHANGE", JSON.stringify(newState))
        if(target.checked) {
            newState.checked[e.target.id] = 1
            var answer = {instance:this.props.instance}
            answer.choices = Object.keys(newState.checked).map(x => {return {choiceID:x}})
            this.props.addAnswer(this.props.response, this.props.node, answer, {maxSelections:0})
            newState.selfUpdate = true
            this.setState(newState)
        }
        else if(e.target.id in newState.checked) {
            delete newState.checked[e.target.id]
            newState.selfUpdate = true
            this.setState(newState)
            this.props.deleteAnswer(this.props.response, this.props.node, this.props.instance, e.target.id)
        }
        console.log("AFTER CHANGE", JSON.stringify(newState))
        return null
        /*if (e.target.getAttribute("index") === undefined || e.target.getAttribute("index") == null) {
            console.log(e.target)
            alert("Something wrong")
            return
        }
        let index = e.target.getAttribute("index")
        let newSelection = this.props.node.choices[index];

        if(e.target.getAttribute("type") == "text") {
            let answerType = "stringValue"
            let answerVal = e.target.value
            let field = this.props.node.choices[index].field
            if (field.valueType === "decimal"){
                answerType = "numberValue"
            } 

            if(timeout)
                clearTimeout(timeout)
            timeout = setTimeout(() => {
                var choice = {
                    choiceID:newSelection.referenceID,
                    field: {}
                }
                choice.field[answerType] = answerVal
                this.props.addAnswer(this.props.response, this.props.node.referenceID, null, null, [choice], 1)
            }, 1000);
        } else {
            this.props.addAnswer(this.props.response, this.props.node.referenceID, undefined, undefined, [
                {
                    choiceID: newSelection.referenceID
                }
            ], 1)
        }

        e.stopPropagation();*/
    }

    getSubNodes(choiceID) {
        if (!this.props.node.dependencies || this.props.node.dependencies.length == 0)
            return null

        // Don't show when not selected?
        if(this.state.showOnSelection && !(choiceID in this.state.checked))
            return null

        var filtered = this.props.node.dependencies
            .filter(dep => choiceID.startsWith(dep.choiceID))
            .map(dep => this.props.getChildrenFn(dep.nodeID))

        if(filtered.length == 0)
            return null

        return (<div className="nested">
            {filtered.map((child, ix) => {
                return <Node
                    key={child.referenceID}
                    id={child.referenceID}
                    node={child}
                    addAnswer={this.props.addAnswer}
                    deleteAnswer={this.props.deleteAnswer}
                    getChildrenFn={this.props.getChildrenFn}
                    response={this.props.response}
                    depth={this.props.depth}
                    instance={this.props.instance}
                    />
                })}
        </div>)
    }

    getField(choice) {
        if(choice.field) {
            return <TextInput 
                node={this.props.node} 
                choiceID={choice.referenceID} 
                field={choice.field} 
                options={{maxSelections:0}}
                addAnswer={this.props.addAnswer} 
                deleteAnswer={this.props.deleteAnswer}
                response={this.props.response}
                instance={this.props.instance}
                disabled={!(choice.referenceID in this.state.checked)}/>
        } else {
            return null
        }
    }

    getChoices() {
        return this.props.node.choices.map((x, ix) => {
            return (
            <div className="checkboxOption" key={x.referenceID}>
                <div className="optionContent">
                    <input 
                        type="checkbox" 
                        id={x.referenceID} 
                        name={this.props.node.referenceID} 
                        value={x.referenceID} 
                        checked={x.referenceID in this.state.checked} 
                        onChange={this.onChange}></input>
                    <div className="optionLabel"> {x.title} </div>
                    {this.getField(x)}
                    {this.props.showID && <div className="identifier"><span>{x.referenceID}</span></div>}
                </div>
                {this.getSubNodes(x.referenceID)}
            </div>)
        })
    }

    render() {
        return (
            <div className="radioInput">
            {this.getChoices()}
            </div>
        )
    }
}