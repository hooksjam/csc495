import React from "react"
import { connect } from 'react-redux'
import { OptionActions } from 'Actions'


class Options extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clearingEverything:false,
            clearingAnswers:false,
            clearingResponses:false,
            forming:false,
        }
        this.handleClick= this.handleClick.bind(this)
        this.startForms = this.startForms.bind(this)
        this.clearEverything = this.clearEverything.bind(this)
        this.clearResponses = this.clearResponses.bind(this)
        this.clearAnswers = this.clearAnswers.bind(this)
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

    async clearEverything(e) {
        this.setState({clearingEverything:true})
        await this.props.clear()
        this.setState({clearingEverything:false})
    }

    async clearAnswers(e) {
        this.setState({clearingAnswers:true})
        await this.props.clear('responses')
        this.setState({clearingAnswers:false})
    }

    async clearResponses(e) {
        this.setState({clearingResponses:true})
        await this.props.clear('answers')
        this.setState({clearingResponses:false})
    }

    async startResponses(e) {
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
                        <div className={`navItem ${this.state.clearingEverything?"disabled":""}`} onClick={this.clearEverything }>
                            <span>Clear Everything</span>
                        </div>
                        <div className={`navItem ${this.state.clearingResponses?"disabled":""}`} onClick={this.clearResponses}>
                            <span>Clear Responses</span>
                        </div>
                        <div className={`navItem ${this.state.clearingAnswers?"disabled":""}`} onClick={this.clearAnswers}>
                            <span>Clear Answers</span>
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