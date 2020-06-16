import React from "react"

export class Collapsible extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        var style = {
            display:'flex',
            flexDirection:'column'
        }
        if(!this.props.show)
            style.display = 'none'

        return (
            <div style={style} className={this.props.className}>
                {this.props.children}
            </div>
        )
    }
}