import React from "react"


export class TI_Rads extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        this.handleMouseEnter = this.handleMouseEnter.bind(this)
        this.handleMouseLeave = this.handleMouseLeave.bind(this)
        this.handleMouseMove = this.handleMouseMove.bind(this)
    }

    handleMouseEnter(e, satisfy) {
    }

    handleMouseLeave(e) {
    }

    handleMouseMove(e) {
    }

    render() {
        return (
            <React.Fragment>
                <div>
                    Test
                </div>
            </React.Fragment>
        )
    }
}