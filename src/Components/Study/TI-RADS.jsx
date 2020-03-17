import React from "react"
import { connect } from 'react-redux'

import { StudyActions } from 'Actions'
import { reduction, predicates } from './TI-RADSConfig.jsx'
import { TI_RADSChart } from 'Components'

class TI_RADS extends React.Component {
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

    render() {
        return (
            <TI_RADSChart>
            </TI_RADSChart>
        )
    }
}

function mapState(state) {

    var form = null
    if('PKG_THYROID_US' in state.form.cache)
        form = state.form.cache['PKG_THYROID_US']

    return { form }
}
  
const actionCreators = {
    initStudy: StudyActions.initStudy
}

const connectedTI_RADS = connect(mapState, actionCreators)(TI_RADS)
export { connectedTI_RADS as TI_RADS }