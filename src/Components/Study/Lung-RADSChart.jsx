import React from "react"
import { connect } from 'react-redux'
import { Lung_RADSGraph, Lung_RADSRow } from 'Components'
import { rotateResults } from 'Helpers'

class Lung_RADSChart extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			summary:null,
		}
		this.getStyle = this.getStyle.bind(this)
		this.getSummary = this.getSummary.bind(this)
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

    getSummary() {
    	var keys = ["date", "responseID", "solid", "partsolid", "partsolid-solid", "GGN"]
		var propSet = new Set(keys)
		console.log("Propset", propSet)
    	return this.state.summary.map((x,ix) => {
    		return <div className="nodule" key={ix}>
    			<h1> Nodule {x[0].nodule_number} </h1>
    			<div style={{"display":"flex", "flexDirection":"row", "justifyContent":"space-around"}}>
    				<div className="results">
		    			{x.map((y, iy) => {
		    				console.log("Y", y)
		    				return <div className="result" key={iy} onClick={()=>{this.props.focusResult(y.responseID, 0, ix)}}>
		    					{Object.keys(y)
		    						.filter(y => {console.log("YW", y, propSet.has(y)); return propSet.has(y)})
		    						.sort((a, b) => {
		    							return keys.indexOf(a) - keys.indexOf(b)
		    						})
		    						.map(z => {
		    						// return null
		    						return (<React.Fragment><span> <b>{JSON.stringify(z).replace(/"/g,'')}</b>: {JSON.stringify(y[z]).replace(/"/g, '')}</span><br/></React.Fragment>)
		    					})}
		    				</div>	
		    			})}
		    			{/*Nodule properties*/}
	    			</div>
	    			<div className="graph">
	    				<Lung_RADSGraph nodule_number={x[0].nodule_number}>
	    				</Lung_RADSGraph>
	    			</div>
	    		</div>
    		</div>
    	})

    }

	render() {
		// Loading
		if(this.props.answers == null || this.props.results == null)
			return null

		return (
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

	            <div class="summary">
	            	{this.getSummary()}
	            </div>
	        </div>)
	}
}

function mapState(state) {
    const {  study } = state

    return { results:study.results, answers:study.answers }
}
  
const actionCreators = {
}

const connectedLung_RADSChart = connect(mapState, actionCreators)(Lung_RADSChart)
export { connectedLung_RADSChart as Lung_RADSChart }
