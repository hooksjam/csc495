 import React from "react";

import {FormActions} from "Actions";

export class TextInput extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            errorText: '',
            value: '',
            responseID: null, 
        };

        this.saveTimeout = undefined;
        this.onChange = this.onChange.bind(this)
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.disabled && !this.props.disabled && this.state.value != "") {
            this.onChange()
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if(nextProps.response != null && nextProps.node != null && (prevState.value == "" || nextProps.response._id != prevState.responseID)) {
        //if (nextProps.response !== undefined && nextProps.response.answers !== undefined && prevState.value === ""){
            var answer = nextProps.response.getAnswerFn(nextProps.node.referenceID, nextProps.instance)
            if(answer) {
                if(nextProps.choiceID != null && nextProps.node.choices != null)
                {
                    var choice = nextProps.node.choices.find(x => {return x.referenceID == nextProps.choiceID})
                    if(choice != null && choice.field) {
                        var type = "numberValue"
                        if(choice.field.valueType == "string")
                            type = "stringValue"

                        var answerChoice = answer.choices.find(x => {return x.choiceID == nextProps.choiceID})
                        if(answerChoice && answerChoice.field) {
                            var value = answerChoice.field[type]
                            if(value != null) {
                                return {
                                    value:value,
                                    responseID: nextProps.response._id,
                                }
                            }
                        }
                    }
                } else if(answer.field) {
                    var type = "numberValue"
                    if(nextProps.node.field.valueType == "string")
                        type = "stringValue"

                    var value = answer.field[type]
                    if(value != null) {
                        return {
                            value:value,
                            responseID: nextProps.response._id,
                        }
                    }
                }
            } else if(nextProps.response != null) {
                return {value:"", responseID:nextProps.response._id}
            }
        }
        if(nextProps.response != null)
            return {responseID:nextProps.response._id}
        return null
    }

    onChange(e=null) {
        var value
        // console.log("CHANGE!", e.target.value, e.target.value == '')
        if(e != null) {
            value = e.target.value
            // console.log("Setting value to ", value)
            this.setState({value:value})
        } else {
            value = this.state.value
        }

        if (this.saveTimeout != null){
            clearTimeout(this.saveTimeout)
        }

        var instance = this.props.instance
        var choiceID = this.props.choiceID
        var node = this.props.node
        var response = this.props.response
        this.saveTimeout = setTimeout(function() {
            this.saveTimeout = null
            if (value === this.state.value && value != ''){
                var answer = {instance:instance}
                if(choiceID) {
                    answer.choices= [{choiceID:choiceID, field: {stringValue:value}}]
                } else {
                    answer.field= {stringValue:value}
                }

                this.props.addAnswer(response, node, answer)
            }
        }.bind(this), 500)
        return 

        /*let error = false;
        let value = e.target.value;
        if (this.props.field && this.props.field.valueType && this.props.field.valueType === "decimal") {
            let pattern = /^\d+.?\d*$/g;
            if (e.target.value.length > 0 && !e.target.value.match(pattern)) {
                error = true;
            } else {
                error = false;
            }
        }
        this.setState({
            error: error,
            value: value
        });
        if (error){
            return;
        }

        if (this.saveTimeout !== undefined){
            clearTimeout(this.saveTimeout);
        }
        this.saveTimeout = setTimeout(function() {
            this.saveTimeout = undefined;
            if (value === this.state.value){
                let answerType = "stringValue";
                if (this.props.node.field.valueType === "decimal"){
                    answerType = "numberValue";
                }
                this.props.addAnswer(this.props.response, this.props.node.referenceID,
                    answerType, value, null);
            }
        }.bind(this), 500);*/
    }

    render() {
        let textAfter = null;
        if (this.props.field && this.props.field.hasOwnProperty("textAfter")) {
            textAfter = <i>&nbsp;{this.props.field.textAfter}</i>
        }

        return (
        <input
            className="textInput"
            name={this.props.node.referenceID}
            error={this.state.error}
            value={this.state.value}
            onChange={this.onChange}
            disabled={this.props.disabled}>
        </input>
        )
    }
}