import React from "react"
import { connect } from 'react-redux'
import { RADSTable, RADSGraph, TI_RADSGraph, TI_RADSRow } from 'Components'
import { rotateResults } from 'Helpers'
import { StudyActions } from 'Actions'
import { overrides } from './TI-RADSConfig.jsx'

var parseVal = (v) => {
    if(!v)
        return null
    var v = JSON.stringify(v).replace(/"/g, '')
    if(/^[0-9\.]+$/.test(v))
        v = parseFloat(v)
    return v
}

var thyroid = {
    "date":0, 
    "right_lobe": ["LI_77991_77991.100004300","LI_77992_77992.100004300","LI_77993_77993.100004300"], 
    "left_lobe": ["LI_78001_78001.100004300","LI_77999_77999.100004300","LI_78000_78000.100004300"]
}
// TODO: Add overall rightlobe/leftlobe
var nodules = {
    "date":0, 
    // "location":0, 
    "size": ["LI_78034_78034.100004300","LI_78035_78035.100004300","LI_78039_78039.100004300","LI_78040_78040.100004300"],
    //"composition":0, 
    //"echogenicity":0, 
    //"shape":0, 
    //"margin":0, 
    //"echogenicfoci":0, 
    "category":0
}

var nodules_graph = {
    "date":0, 
    "size": ["LI_78034_78034.100004300","LI_78035_78035.100004300","LI_78039_78039.100004300","LI_78040_78040.100004300"],
}

class TI_RADSSummary extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			summary:null,
		}
		this.getSummary = this.getSummary.bind(this)
		this.flatten = this.flatten.bind(this)
		this.getName = this.getName.bind(this)
	}

    static getDerivedStateFromProps(nextProps, prevState) {
    	if(nextProps.results != null) {
	    	var summary = rotateResults(nextProps.results, "nodules")
	    	return {
	    		summary
	    	}
	    } else {
	    	return null
	    }
    }

    getName(name) {
    	if(!this.props)
    		return name

        if(name in overrides) {
            return overrides[name]
        } else if(name in this.props.names) {
            return this.props.names[name]
        } else {
            return name
        }
    }

	flatten(results, mapping, prefix=null) {
	    return results.map(result => {
        	var pfx = ''
        	if(prefix != null) {
        		pfx = `${result[prefix]}_`
        	}
	        return Object.keys(result).reduce((map, obj) => {
	            if(obj in mapping) {
	                var val = mapping[obj]
	                if(Array.isArray(val)) {
	                    for(let i = 0; i < val.length; i++) {
	                        var key = val[i]
	                        var find = result[obj].find(z => {return Object.keys(z)[0] == key})
	                        if(find != null) {
	                            var valB = Object.values(find)[0]
	                            var name = this.getName(key)
	                            map[`${pfx}${this.getName(obj)}_${name}`] = parseVal(valB)
	                        }
	                    }
	                } else {
	                    map[`${pfx}${this.getName(obj)}`] = parseVal(result[obj])
	                }

	            }
	            return map
	        }, {})
	    })
	}

    getSummary() {
        if(this.state.summary == null)
            return null


        var flatResults = this.flatten(this.props.results, thyroid)
        var flatNodules = this.state.summary.map(nodule => {
            return this.flatten(nodule, nodules_graph)
        })

        return (<React.Fragment>
            <div className="nodule" key="thyroid">
                    <h1> Thyroid </h1>
                    <div style={{"display":"flex", "flexDirection":"row", "justifyContent":"space-around"}}>
                        <div className="results">
                            <RADSTable map={thyroid} data={this.props.results} focusResult={this.props.focusResult} getName={this.getName}/>
                        </div>
                        <RADSGraph data={flatResults}/>
                    </div>
            </div>
            {this.state.summary.map((x,ix) => {
                return <div className="nodule" key={ix}>
                    <h1> Nodule {x[0].nodule_number} </h1>
                    <div style={{"display":"flex", "flexDirection":"row", "justifyContent":"space-around"}}>
                        <div className="results">
                            <RADSTable map={nodules} data={x} focusResult={this.props.focusResult} getName={this.getName}/>
                        </div>
                        <RADSGraph data={flatNodules[ix]}></RADSGraph>
                    </div>
                </div>
            })}
        </React.Fragment>)
    }

	render() {
		// Loading
		if(this.props.answers == null || this.props.results == null)
			return null

		return (
            <div className="summary">
            	{this.getSummary()}
            </div>)
	}
}

function mapState(state) {
    const {  study } = state

    return { results:study.results, answers:study.answers, names:study.names, focusItems:study.focusItems  }
}
  
const actionCreators = {
	focus: StudyActions.focusItems
}

const connectedTI_RADSSummary = connect(mapState, actionCreators)(TI_RADSSummary)
export { connectedTI_RADSSummary as TI_RADSSummary }
