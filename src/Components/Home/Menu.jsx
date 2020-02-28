import React from "react"

export class MenuOption extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div className="menuOption noselect" onClick={this.props.onClick}>
                {this.props.children}
            </div>
        )
    }
}

export class MenuItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div className="menuItem noselect">
                {this.props.children}
            </div>
        )
    }
}