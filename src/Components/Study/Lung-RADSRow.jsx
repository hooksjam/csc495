import React from "react"
import { connect } from 'react-redux'

import { StudyActions } from 'Actions'

class Lung_RADSRow extends React.Component {
    constructor(props) {
        super(props)
        this.getAnswer = this.getAnswer.bind(this)
    }

    getAnswer(code) {
    	return this.props.answers[code]
    }

    render() {
        var satisfy = null
        if(this.props.code != null) {
            var answer = this.getAnswer(this.props.code)
            if(Array.isArray(answer)) {
                // Extract unique nodule_numbers
                var sat = new Set()
                var drill = (arr) => {
                    for(var i = 0; i < arr.length; i++) {
                        if(Array.isArray(arr[i]))
                            drill(arr[i])
                        else {
                            if(!(arr[i].nodule_number in sat))
                                sat.add(arr[i].nodule_number)
                        }
                    }

                }
                drill(answer)
                satisfy = Array.from(sat)
            }
        }

        var style = {}
        if(this.props.code != null) {
        	style = this.props.getStyle(this.props.code)
        }
        for(var key in this.props.style) {
        	style[key] = this.props.style[key]
        }
        //console.log("CODE", this.props.code, "STYLE", style)

        if(satisfy != null) {
            return (<tr style={style}
                onMouseEnter={() => {this.props.focusItems(satisfy)}}
                onMouseLeave={() => {/*this.props.focusItems(null)*/}}>
                <td className="noselect">
                    {this.props.children}
                </td>
            </tr>)
        } else {
            return (<tr style={style}>
                <td className="noselect">
                    {this.props.children}
                </td>
            </tr>)
        }
    }
}

function mapState(state) {
    const {  study } = state

    return { results:study.results, answers:study.answers }
}
  
const actionCreators = {
	focusItems: StudyActions.focusItems,
}

const connectedLung_RADSRow = connect(mapState, actionCreators)(Lung_RADSRow)
export { connectedLung_RADSRow as Lung_RADSRow }
