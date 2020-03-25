import React from "react"
import { connect } from 'react-redux'

import { StudyActions } from 'Actions'
import { reduction, predicates} from './Lung-RADSConfig.jsx'

import { Lung_RADSChart, Lung_RADSGraph } from 'Components'

class Lung_RADS extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active:false
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if(nextProps.form && nextProps.rawResults && nextProps.active && !prevState.active) {
            nextProps.initStudy(nextProps.form, nextProps.rawResults, reduction, predicates)
        }
        return {active:nextProps.active}
    }

    getGraph() {
    }

    render() {
        return (
            <React.Fragment>
            <Lung_RADSChart focusResult = {this.props.focusResult}>
            </Lung_RADSChart>
            </React.Fragment>
        );
    }
}

function mapState(state) {

    var form = null
    if('PKG_LDCT_LUNG' in state.form.cache)
        form = state.form.cache['PKG_LDCT_LUNG']

    return { form }
}
  
const actionCreators = {
    initStudy: StudyActions.initStudy
}

const connectedLung_RADS = connect(mapState, actionCreators)(Lung_RADS)
export { connectedLung_RADS as Lung_RADS }
