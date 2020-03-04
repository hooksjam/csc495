import React from "react"
import { connect } from 'react-redux'
import { OptionActions } from 'Actions'


class Options extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clearing:false,
            forming:false,
        }
        this.handleClick= this.handleClick.bind(this)
        this.startClear = this.startClear.bind(this)
        this.startForms = this.startForms.bind(this)
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClick);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClick);
    }

    handleClick(e) {
        if(this.props.clickOutside && this.optionsRef && !this.optionsRef.contains(event.target)) {
            this.props.clickOutside(e)
        }
    } 

    async startClear(e) {
        this.setState({clearing:true})
        await this.props.clear()
        this.setState({clearing:false})
    }

    async startForms(e) {
        this.setState({forming:true})
        await this.props.reloadForms()
        this.setState({forming:false})
    }


    render() {
        return (
            <div className="optionsWrapper">
                <div className="options" ref={(x) => {this.optionsRef=x}}>
                    <div className="close" onClick={this.props.clickOutside}>
                        <div className="fas fa-times"/>
                    </div>
                    <div className="navGroup vertical">
                        <h3> Options </h3>
                        <div className={`navItem ${this.state.clearing?"disabled":""}`} onClick={this.startClear}>
                            <span>Clear</span>
                        </div>
                        <div className={`navItem ${this.state.forming?"disabled":""}`} onClick={this.startForms}>
                            <span>Reload Forms</span>
                        </div>

                        <div className={`navItem`} onClick={this.props.viewForms}>
                            <span>View Forms</span>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

function mapState(state) {
    return { }
}
  
const actionCreators = {
    clear:OptionActions.clear,
    reloadForms:OptionActions.reloadForms,
}

const connectedOptions = connect(mapState, actionCreators)(Options)
export { connectedOptions as Options }