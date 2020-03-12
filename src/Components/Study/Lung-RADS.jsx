import React from "react"
import { connect } from 'react-redux'

import { StudyActions } from 'Actions'
import { reduction, predicates} from './Lung-RADSConfig.jsx'

import { Lung_RADSChart, Lung_RADSGraph } from 'Components'

class Lung_RADS extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            /*nodule:0,
            hover:false,
            hoverPos:[0,0],
            showNodules:[],
            results:[],
            answers:[],
            ownUpdate:false,*/
            initialized: false,
            rawResults:null,
        }
        // this.handleMouseEnter = this.handleMouseEnter.bind(this)
        // this.handleMouseLeave = this.handleMouseLeave.bind(this)
        // this.handleMouseMove = this.handleMouseMove.bind(this)
        // this.getStyle = this.getStyle.bind(this)
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        /*if(nextProps.rawResults)
            console.log(nextProps.rawResults.id, prevState.rawResults.id)*/
        if(!prevState.initialized && nextProps.form && nextProps.rawResults) {
            nextProps.initStudy(nextProps.form, nextProps.rawResults, reduction, predicates)
            return {initialized:true, rawResults:nextProps.rawResults}
        }
        /*if(nextProps.form && nextProps.rawResults && nextProps.rawResults.id != prevState.rawResults.id)
            nextProps.initStudy(nextProps.form, nextProps.rawResults.results, reduction, predicates)
        return null*/
        /*console.log("RAW!", nextProps.rawResults == prevState.rawResults, nextProps.rawResults, prevState.rawResults)
        if(nextProps.form != null && nextProps.rawResults != null && nextProps.rawResults != prevState.rawResults) {
            nextProps.initStudy(nextProps.form, nextProps.rawResults, reduction, predicates)
            return {
                rawResults:nextProps.rawResults
            } 
        } else {
            return null
        }*/
    }

    render() {
        return (
            <React.Fragment>
            <Lung_RADSChart focusResult = {this.props.focusResult}>
            </Lung_RADSChart>
            <Lung_RADSGraph>
            </Lung_RADSGraph>
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const {  study, response } = state

    var form = null
    if('PKG_LDCT_LUNG' in state.form.cache)
        form = state.form.cache['PKG_LDCT_LUNG']

    return { form, study, response }
}
  
const actionCreators = {
    initStudy: StudyActions.initStudy
}

const connectedLung_RADS = connect(mapState, actionCreators)(Lung_RADS)
export { connectedLung_RADS as Lung_RADS }
