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
        }

        this.onChange = this.onChange.bind(this)
        this.getChoices = this.getChoices.bind(this)
        this.getSubNodes = this.getSubNodes.bind(this)
        this.getField = this.getField.bind(this)
    }


    static getDerivedStateFromProps(nextProps, prevState) {
        if(nextProps.response) {
            let answer = nextProps.response.answers.filter(answer => answer.nodeID === nextProps.node.referenceID)[0]
            if (answer !== undefined && answer.choices && answer.choices.length > 0){
                let choice = answer.choices[0]
                return {
                    selectedChoice: choice.choiceID,
                }
            }
        }
        return null
    }

    onChange(e) {
        console.log("TARGET", e.target, e.target.checked)
        var newState = {...this.state}
        var target = e.target
        if(target.checked)
            newState.checked[e.target.id] = 1
        else if(e.target.id in newState.checked)
            delete newState.checked[e.target.id]
        this.setState(newState)
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
                    getChildrenFn={this.props.getChildrenFn}
                    response={this.props.response}
                    depth={this.props.depth}
                    />
                })}
        </div>)
    }

    getField(choice) {
        if(choice.field) {
            return <TextInput referenceID={this.props.node.referenceID} choiceID={choice.referenceID} field={choice.field} addAnswer={this.props.addAnswer} response={this.props.response}/>
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
                        onClick={this.onChange}></input>
                    <label for={x.referenceID}> {x.title} </label>
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
        /*return (
            <FormControl onChange={this.onChange.bind(this)}>
                <FormLabel />
                <RadioGroup>
                    {this.props.node.choices.map((choice, index) => {

                        let checked = selectedChoice === choice.referenceID;

                        const subQuestions = this.getSubQuestions(choice.referenceID);
                        let subQuestionsList = null;
                        if (subQuestions.length > 0) {
                            subQuestionsList = (
                                <Collapse in={checked}>
                                    <List>{subQuestions}</List>
                                </Collapse>
                            );
                        }

                        let field = null;
                        if (choice.hasOwnProperty('field')) {
                            field = (
                                <Collapse in={checked}>
                                    <TextField
                                        color="primary"
                                        fullWidth={true}
                                        inputProps={{
                                            index:index
                                        }}
                                    />
                                </Collapse>
                            );
                        }

                        return (
                            <React.Fragment>
                                <FormControlLabel 
                                    value={choice.title}
                                    label={<Typography variant="h5">{choice.title}</Typography>}
                                    control={
                                        <Radio
                                            key={choice.referenceID}
                                            id={choice.referenceID}
                                            inputProps={{
                                                index: index
                                            }}
                                            checked={checked}
                                            type="checkbox"
                                            color="primary"
                                            name={this.props.node.referenceID}
                                            value={choice.title}
                                        />
                                    }
                                    key={choice.referenceID}                                
                                />
                                {field}
                                {subQuestionsList}
                            </React.Fragment>
                        );
                    })}
                </RadioGroup>
            </FormControl>
        );*/
    }
}