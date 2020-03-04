import React from "react";

import {FormActions} from "Actions";

export class TextInput extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            errorText: '',
            value: ''
        };

        this.uploadLatency = undefined;
        this.onChange = this.onChange.bind(this)
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.response !== undefined && nextProps.response.answers !== undefined && prevState.value === ""){
            let answer = nextProps.response.answers.filter(answer => answer.nodeID === nextPropsrops.referenceID)[0];
            let value = "";
            if (answer !== undefined) {
                let key = "stringValue"
                if (nextProps.field.valueType === "decimal") {
                    key = "numberValue"
                }
                value = answer.field[key]
            }
            return {
                value:value
            }
        }
        return null
    }

    onChange(e) {
        this.setState({value:e.target.value})
        return 

        let error = false;
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

        if (this.uploadLatency !== undefined){
            clearTimeout(this.uploadLatency);
        }
        this.uploadLatency = setTimeout(function() {
            this.uploadLatency = undefined;
            if (value === this.state.value){
                let answerType = "stringValue";
                if (this.props.node.field.valueType === "decimal"){
                    answerType = "numberValue";
                }
                this.props.addAnswer(this.props.response, this.props.node.referenceID,
                    answerType, value, null);
            }
        }.bind(this), 500);
    }

    render() {
        let textAfter = null;
        if (this.props.field && this.props.field.hasOwnProperty("textAfter")) {
            textAfter = <i>&nbsp;{this.props.field.textAfter}</i>
        }

        return (
        <input
            className="textInput"
            name={this.props.referenceID}
            error={this.state.error}
            value={this.state.value}
            inputProps={{
                style: {fontSize: 15}
            }}
            onChange={this.onChange}>
        </input>
        )
    }
}