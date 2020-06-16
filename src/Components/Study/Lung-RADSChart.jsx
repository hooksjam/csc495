import React from "react"
import { connect } from 'react-redux'
import { RADSTable, RADSGraph, Lung_RADSGraph, Lung_RADSRow, Lung_RADSSummary } from 'Components'
import { rotateResults } from 'Helpers'
import { StudyActions } from 'Actions'


var overrides = {
}

var parseVal = (v) => {
    if(!v)
        return null
    var v = JSON.stringify(v).replace(/"/g, '')
    if(/^[0-9\.]+$/.test(v))
        v = parseFloat(v)
    return v
}

class Lung_RADSChart extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			summary:null,
		}
		this.getStyle = this.getStyle.bind(this)
		this.getHoverGraph = this.getHoverGraph.bind(this)
		this.close = this.close.bind(this)
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
    getStyle(predCode, options) {
        // console.log("PRED CODE", predCode, "answers", this.state.answers, this.state.answers[predCode])
        if(!(predCode in this.props.answers))
            return {"color":"#bbb"}
        var pred = this.props.answers[predCode]
        var style = {}
        // console.log("RED CODE", predCode, "PRED", pred)
        style.color = "#bbb"
        if(pred == true || (Array.isArray(pred) && pred.length > 0) ) {
            style.color = "#000"
            for(var key in options)
                style[key] = options[key]

        }
        return style
    }

    getHoverGraph() {
        var nodules_graph = {
            "date":0, 
            "solid":0,
            "partsolid":0,
            "partsolid-solid":0,
            "GGN":0,
        }

        var temp = {}
        for(let i = 0; i < this.state.summary.length; i++) {
        	var nod = this.state.summary[i]

        	for(let j = 0; j < nod.length; j++) {
        		var nodule = nod[j]
        		var number = nodule.nodule_number
	        	if(!this.props.focusItems.includes(number)) {
	        		break;
	        	}

        		if(!(nodule.date in temp))
        			temp[nod[j].date] = {}
        		for(var key in nod[j]) {
        			if(key != 'date' && key in nodules_graph) {
        				temp[nod[j].date][`${number}_${key}`] = nodule[key]
        			}
        		}
        	}
        }
        var focusNodules = Object.keys(temp).map(x => {
        	var val = temp[x]
        	val['date'] = x
        	return val
        })
        if(focusNodules.length > 0) {
        	return <RADSGraph data={focusNodules}/>
        }
        else
        	return null;
    }

    close() {
    	this.props.focus(null)
    }

	render() {
		// Loading
		if(this.props.answers == null || this.props.results == null)
			return null

		return (
			<React.Fragment>
			<div className="studyAid Lung-RADS">
	            <h1> Lung-RADS<sup>&copy;</sup> Version 1.1</h1>
	            <h3> Study Categories Release Date: 2019 </h3>
	            <table>
	                <thead style={{backgroundColor:"#323e4f", color:"white"}}>
	                    <tr>
	                        <th> Category Descriptor </th>
	                        <th> Lung-RADS Score </th>
	                        <th style={{width:"25%"}}> Findings </th>
	                        <th> Management </th>
	                        <th> Risk of Malignancy </th>
	                        <th> Est. Population Prevelence </th>
	                    </tr>
	                </thead>
	                {/* Incomplete */}
	                <tr>
	                    <td style={{backgroundColor:"#d9d9d9"}}> <b>Incomplete</b> </td>
	                    <td style={{backgroundColor:"#d9d9d9"}}> 0 </td>
	                    <td className="findings"> 
	                        <Lung_RADSRow code="" getStyle={this.getStyle}>Prior chest CT examination(s) being located for comparison</Lung_RADSRow>
	                        <Lung_RADSRow code="" getStyle={this.getStyle}>Part or all of lungs cannot be evaluated</Lung_RADSRow>
	                    </td>
	                    <td> Additional lung cancer screening CT images and/or comparison to prior chest CT examinations is needed </td>
	                    <td> n/a </td>
	                    <td> 1% </td>
	                </tr>

	                {/* Negative */}
	                <tr>
	                    <td style={{backgroundColor:"#b4c6e7"}}> 
	                        <p>
	                            <b>Negative</b>
	                            <br></br>
	                            <br></br>
	                            No nodules and definitely benign nodules
	                        </p>
	                    </td>
	                    <td style={{backgroundColor:"#b4c6e7"}}> 1 </td>
	                    <td className="findings"> 
	                        <Lung_RADSRow code="1-nonodules" getStyle={this.getStyle}>No lung nodules</Lung_RADSRow>
	                        <Lung_RADSRow code="" getStyle={this.getStyle}>Nodule(s) with specific calcifications: complete, central, popcorn, concentric rings and fat containing nodules</Lung_RADSRow>
	                    </td>
	                    <td> Continue annual screening with LDCT in 12 months </td>
	                    <td> &lt; 1% </td>
	                    <td> 90% </td>
	                </tr> 

	                {/* Benign Appearance or Behavior */}
	                <tr>
	                    <td style={{backgroundColor:"#70ad47"}}> 
	                        <p>
	                            <b>Benign Appearance or Behavior</b> 
	                            <br></br>
	                            <br></br>
	                            Nodules with a very low likelihood of becoming a clinically active cancer due to size or lack of growth> 
	                        </p>
	                    </td>
	                    <td style={{backgroundColor:"#70ad47"}}> 2 </td>
	                    <td className="findings"> 
	                        <Lung_RADSRow code="2-prefissural" getStyle={this.getStyle}>
	                            <b>Prefissural nodule(s):</b> (See Footnote 11)<br/>
	                            <span style={this.getStyle("2-prefissural", {"color":"red"})}> &lt; 10 mm (524 mm<sup>3</sup>)</span>
	                        </Lung_RADSRow>

	                        <Lung_RADSRow code="2-solid" getStyle={this.getStyle}>
	                            <b>Solid nodule(s):</b><br/>
	                            <span style={this.getStyle("2-solid-a", {"color":"red"})}> &lt; 6 mm (&lt; 113 mm<sup>3</sup>)</span><br/>
	                            <span style={this.getStyle("2-solid-b", {"color":"red"})}> new &lt; 4 mm (&lt; 34 mm<sup>3</sup>)</span>
	                        </Lung_RADSRow>


	                        <Lung_RADSRow code="2-partsolid" getStyle={this.getStyle}>
	                            <b>Part solid nodule(s):</b><br/>
	                            <span style={this.getStyle("2-partsolid", {"color":"red"})}> &lt; 6 mm total diameter (&lt; 113 mm<sup>3</sup>) on baseline screening</span><br/>
	                        </Lung_RADSRow> 

	                        <Lung_RADSRow code="2-ggn" getStyle={this.getStyle}>
	                            <b>Non solid nodule(s) (GGN):</b><br/>
	                            <span style={this.getStyle("2-ggn-a", {"color":"red"})}> &lt; 30 mm (&lt; 14137 mm<sup>3</sup>) </span><b>OR</b><br/>
	                            <span>
	                                <span style={this.getStyle("2-ggn-b1", {"color":"red"})}> &ge; 30 mm (&ge; 14137 mm<sup>3</sup>)</span> and 
	                                <span style={this.getStyle("unchanged-ggn", {"color":"red"})}> unchanged </span> or 
	                                <span style={this.getStyle("slowlygrowing-ggn", {"color":"red"})}> slowly growing </span>
	                            </span>
	                        </Lung_RADSRow> 

	                        <Lung_RADSRow code="2-cat" getStyle={this.getStyle}>
	                            <b style={this.getStyle("2-cat", {"color":"red"})}>TODO: Category 3 or 4 nodules unchanged for &ge; 3 months</b>
	                        </Lung_RADSRow> 
	                    </td>
	                    <td> Continue annual screening with LDCT in 12 months </td>
	                    <td> &lt; 1% </td>
	                    <td> 90% </td>
	                </tr> 

	                {/* Probably Benign */}
	                <tr>
	                    <td style={{backgroundColor:"#ffff00"}}> 
	                        <p>
	                            <b>Probably Benign</b> 
	                            <br></br>
	                            <br></br>
	                            Probably benign finding(s) - short term follow up suggested; includes nodules with a low likelihood of becoming a clinically active cancer
	                        </p>
	                    </td>
	                    <td style={{backgroundColor:"#ffff00"}}> 3 </td>
	                    <td className="findings"> 

	                        <Lung_RADSRow code="3-solid" getStyle={this.getStyle}>
	                            <b>Solid nodule(s):</b><br/>
	                            <span style={this.getStyle("3-solid-a", {"color":"red"})}> &ge; 6 to &lt; 8 mm (&ge; 113 to &lt; 268 mm<sup>3</sup>) at baseline</span> <b>OR</b><br/>
	                            <span style={this.getStyle("3-solid-b", {"color":"red"})}> new &ge; 4 mm to &lt; 6mm (&ge; 4 to &lt; 113 mm<sup>3</sup>)</span>
	                        </Lung_RADSRow>


	                        <Lung_RADSRow code="3-partsolid" getStyle={this.getStyle}>
	                            <b>Part solid nodule(s):</b><br/>
	                            <span style={this.getStyle("3-partsolid-a", {"color":"red"})}> &ge; 6 mm total diameter (&ge; 113 mm<sup>3</sup>) with solid component &lt; 6 mm (&lt; 113 mm<sup>3</sup>)</span> <b>OR</b> <br/>
	                            <span style={this.getStyle("3-partsolid-b", {"color":"red"})}> new &lt; 6 mm total diameter (&lt; 113 mm<sup>3</sup>)</span>
	                        </Lung_RADSRow> 

	                        <Lung_RADSRow code="3-ggn" getStyle={this.getStyle}>
	                            <b>Non solid nodule(s) (GGN):</b><br/>
	                            <span style={this.getStyle("3-ggn-a", {"color":"red"})}> &ge; 30 mm (&lt; 14137 mm<sup>3</sup>) on baseline CT</span> <b>OR</b><br/>
	                            <span style={this.getStyle("new-ggn", {"color":"red"})}> new</span>
	                        </Lung_RADSRow>
	                    </td>
	                    <td> 6 months LDCT </td>
	                    <td> 1-2% </td>
	                    <td> 5% </td>
	                </tr>  

	                {/* Suspicious */}
	                <tr>
	                    <td style={{backgroundColor:"#ed7d31"}}> 
	                        <p>
	                            <b>Suspicious</b> 
	                            <br></br>
	                            <br></br>
	                            Findings for which additional diagnostic testing is recommended
	                        </p>
	                    </td>
	                    <td style={{backgroundColor:"#ed7d31"}}> 4A </td>
	                    <td className="findings"> 
	                        <Lung_RADSRow code="4a-solid" getStyle={this.getStyle}>
	                            <b>Solid nodule(s):</b><br/>
	                            <span style={this.getStyle("4a-solid-a", {"color":"red"})}> &ge; 8 to &lt; 15 mm (&ge; 268 to &lt; 1767 mm<sup>3</sup>) at baseline</span> <b>OR</b><br/>
	                            <span style={this.getStyle("4a-solid-b", {"color":"red"})}> growing &lt; 8 mm (&lt; 268 mm<sup>3</sup>)</span> <b>OR</b><br/>
	                            <span style={this.getStyle("4a-solid-c", {"color":"red"})}> new &ge; 6 to &lt; 8 mm (&ge; 113 to &lt; 268 mm<sup>3</sup>)</span>
	                        </Lung_RADSRow>


	                        <Lung_RADSRow code="4a-partsolid" getStyle={this.getStyle}>
	                            <b>Part solid nodule(s):</b><br/>
	                            <span style={this.getStyle("4a-partsolid-a", {"color":"red"})}> &ge; 6 mm (&ge; 113 mm<sup>3</sup>) with solid component &ge; 6 mm to &lt; 8 mm (&ge; 113 to &lt; 268 mm<sup>3</sup>)</span> <b>OR</b> <br/>
	                            <span style={this.getStyle("4a-partsolid-b", {"color":"red"})}> with new or growing &lt; 4 mm (&lt; 34 mm<sup>3</sup>) solid component</span>
	                        </Lung_RADSRow>
	                        <Lung_RADSRow code="" getStyle={this.getStyle}>
	                            <b>Endobronchial nodule</b>
	                        </Lung_RADSRow>

	                    </td>
	                    <td> 3 months LDCT; PET/CT may be used when there is a &ge; 8mm (&ge; 268 mm<sup>3</sup>) solid component </td>
	                    <td> 5-15% </td>
	                    <td> 2% </td>
	                </tr>   

	                {/* Very Suspicious */}
	                <tr>
	                    <td style={{backgroundColor:"#ff0000"}}> 
	                        <p>
	                            <b>Very Suspicious</b> 
	                            <br></br>
	                            <br></br>
	                            Findings for which additional diagnostic testing and/or tissue sampling is recommended
	                        </p>
	                    </td>
	                    <td style={{backgroundColor:"#ff0000"}}> 4B/4X </td>
	                    <td className="findings"> 
	                        <Lung_RADSRow code="4b-solid" getStyle={this.getStyle}>
	                            <b>Solid nodule(s):</b><br/>
	                            <span style={this.getStyle("4b-solid-a", {"color":"red"})}> &ge; 15 (&ge; 1767 mm<sup>3</sup>)</span> <b>OR</b><br/>
	                            <span style={this.getStyle("4b-solid-b", {"color":"red"})}> new or growing, and &ge; 8 mm (&ge; 268 mm<sup>3</sup>)</span>
	                        </Lung_RADSRow>


	                        <Lung_RADSRow code="4b-partsolid" getStyle={this.getStyle}>
	                            <b>Part solid nodule(s):</b><br/>
	                            <span style={this.getStyle("4b-partsolid-a", {"color":"red"})}> a solid component &ge; 8 mm (&ge; 268 mm<sup>3</sup>)</span> <b>OR</b> <br/>
	                            <span style={this.getStyle("4b-partsolid-b", {"color":"red"})}> a new or growing &ge; 4 mm (&ge; 34 mm<sup>3</sup>) solid component</span>
	                        </Lung_RADSRow>
	                        <Lung_RADSRow code="" getStyle={this.getStyle}>
	                            TODO: Category 3 or 4 nodules with additional features or imaging findings that increases the suspicion of malignancy
	                        </Lung_RADSRow>
	                    </td>
	                    <td> Chest CT with or without contrast, PET/CT and/or tissue sampling dependeing on the probability of malignancy and comorbidities. PET/CT may be used when there is a &ge; 8mm (&ge; 268mm<sup>3</sup>) solid component. For new large nodules that develop on an annual repeat screening CT, a 1 month LDCT may be recommended to address potentially infectious or inflammatory conditions</td>
	                    <td> 5-15% </td>
	                    <td> 2% </td>
	                </tr>   

	                {/* Other */}
	                <tr>
	                    <td style={{backgroundColor:"#ffffff"}}> 
	                        <p>
	                            <b>Other</b> 
	                            <br></br>
	                            <br></br>
	                            Clinically Significant or Potentially Clinically Significant Findings (non lung cancer)
	                        </p>
	                    </td>
	                    <td style={{backgroundColor:"#ffffff"}}> S </td>
	                    <td className="findings"> 
	                        <Lung_RADSRow code="" getStyle={this.getStyle}>
	                            <b>Modifier - may add on to category 0-4 coding</b>
	                        </Lung_RADSRow>
	                    </td>
	                    <td> As appropriate to the specific finding </td>
	                    <td> n/a </td>
	                    <td> 10% </td>
	                </tr>  
	            </table>

	            {/*<Lung_RADSSummary focusResult={this.props.focusResult}/>*/}
	            
	        </div>
	        {this.props.focusItems.length > 0 && 
	        <div className="hover noselect">
                <div className="close" onClick={this.close}>
                    <div className="fas fa-times"/>
                </div>
                {this.getHoverGraph()}
            </div>}
			</React.Fragment>)
	}
}

function mapState(state) {
    const {  study } = state

    return { results:study.results, answers:study.answers, names:study.names, focusItems:study.focusItems  }
}
  
const actionCreators = {
	focus: StudyActions.focusItems
}

const connectedLung_RADSChart = connect(mapState, actionCreators)(Lung_RADSChart)
export { connectedLung_RADSChart as Lung_RADSChart }
