import React from "react"

export class MenuOption extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div className="menuOption">
                {this.props.children}
            </div>
        )
    }
}