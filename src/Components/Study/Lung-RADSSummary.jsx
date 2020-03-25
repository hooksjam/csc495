import React from "react"
import { connect } from 'react-redux'
import { RADSTable, RADSGraph, Lung_RADSGraph, Lung_RADSRow } from 'Components'
import { rotateResults } from 'Helpers'
import { StudyActions } from 'Actions'
import { overrides } from './Lung-RADSConfig.jsx'

var parseVal = (v) => {
    if(!v)
        return null
    var v = JSON.stringify(v).replace(/"/g, '')
    if(/^[0-9\.]+$/.test(v))
        v = parseFloat(v)
    return v
}

var nodules_map = {
    "date":0, 
    "solid":0,
    "partsolid":0,
    "partsolid-solid":0,
    "GGN":0,
}

class Lung_RADSSummary extends React.Component {
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
        // Combine summaries
        var temp = {}
        for(let i = 0; i < this.state.summary.length; i++) {
        	var nod = this.state.summary[i]
        	for(let j = 0; j < nod.length; j++) {
        		if(!(nod[j].date in temp))
        			temp[nod[j].date] = {}

        		var nodule = nod[j]
        		var number = nodule.nodule_number
        		for(var key in nod[j]) {
        			if(key != 'date' && key in nodules_map) {
        				temp[nod[j].date][`${number}_${key}`] = nodule[key]
        			}
        		}
        	}
        }
        var allNodules = Object.keys(temp).map(x => {
        	var val = temp[x]
        	val['date'] = x
        	return val
        })

        var flatNodules = this.state.summary.map(nodule => {
            return this.flatten(nodule, nodules_map)
        })

        return (<React.Fragment>
            <div className="nodule" key={"all"}>
                <h1> All Nodules </h1>
                <div style={{"display":"flex", "flexDirection":"row", "justifyContent":"space-around"}}>
                    <div className="results">
                        {/*<RADSTable map={nodules_map} data={allNodules} focusResult={this.props.focusResult} getName={this.getName}/>*/}
            		</div>
            		<RADSGraph data={allNodules} width={800}></RADSGraph>
            	</div>
            </div>
            {this.state.summary.map((x,ix) => {
                return <div className="nodule" key={ix}>
                    <h1> Nodule {x[0].nodule_number} </h1>
                    <div style={{"display":"flex", "flexDirection":"row", "justifyContent":"space-around"}}>
                        <div className="results">
                            <RADSTable map={nodules_map} data={x} focusResult={this.props.focusResult} getName={this.getName}/>
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

const connectedLung_RADSSummary = connect(mapState, actionCreators)(Lung_RADSSummary)
export { connectedLung_RADSSummary as Lung_RADSSummary }
