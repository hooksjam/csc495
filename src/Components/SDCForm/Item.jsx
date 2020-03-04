import React from "react";

import {
} from 'Components'

export class Item extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            expanded: true
        }
    }


    render(){
        return (<div className="item">
            {this.props.node.title}
        </div>)
    }
}

