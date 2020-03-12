import React from "react"
import { connect } from 'react-redux'

import { reduction, predicates} from './Lung-RADSConfig.jsx'
import { reduceResults, getAnswers } from 'Helpers'

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, ReferenceLine,
  ReferenceDot, Tooltip, CartesianGrid, Legend, Brush, ErrorBar, AreaChart, Area,
  Label, LabelList } from 'recharts'



class RADSRow extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        /*var pred = this.props.answers[this.props.predCode]
        var satisfy = []
        if(pred && Array.isArray(pred) && pred.length > 0) {
            satisfy = pred
        }*/
        return (<tr style={this.props.style}>
            <td className="noselect">
                {this.props.children}
            </td>
        </tr>)
    }
}

class Lung_RADS extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nodule:0,
            hover:false,
            hoverPos:[0,0],
            showNodules:[],
            results:[],
            answers:[],
            ownUpdate:false,
        }
        this.handleMouseEnter = this.handleMouseEnter.bind(this)
        this.handleMouseLeave = this.handleMouseLeave.bind(this)
        this.handleMouseMove = this.handleMouseMove.bind(this)
        this.getStyle = this.getStyle.bind(this)
        this.getRow = this.getRow.bind(this)
        this.getGraph = this.getGraph.bind(this)
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if(prevState.ownUpdate) {
            return {ownUpdate:false}
        }

        if(!nextProps.rawResults || !nextProps.form) {
            return null
        }

        // How many nodules?
        var results = reduceResults(nextProps.form, nextProps.rawResults, reduction)

        // Sort by date
        results = results.sort((a, b) => {
            return b.createdAt.localeCompare(a.createdAt)//new Date(a.date) - new Date(b.date)
        }) 

        console.log("RESULTS!", results)
        var answers = getAnswers(results, predicates)
        console.log("ANSWERS", answers)

        var data = results.map(x => {
            var obj = {date:x.date, createdAt:x.createdAt}
            for(let i = 0; i < x.nodules.length; i++) {
                var keys = ["solid", "partsolid", "GGN"]
                for(let j = 0; j < keys.length; j++) {
                    if(keys[j] in x.nodules[i]) {
                        obj["nodule_"+i.toString()+"_"+keys[j]] = x.nodules[i][keys[j]]
                    }
                }
            }
            return obj
        })

        // Sort by date
        data = data.sort((a, b) => {
            return a.createdAt.localeCompare(b.createdAt)//new Date(a.date) - new Date(b.date)
        }) 

        return {
            results:results,
            answers:answers,
            data:data
        }
    }

    handleMouseEnter(e, satisfy) {
        var pos = [e.pageX, e.pageY]
        // this.setState({hover:true, hoverPos:pos, showNodules:satisfy, ownUpdate:true})
    }

    handleMouseLeave(e) {
        // this.setState({hover:false, ownUpdate:true})
    }

    handleMouseMove(e) {
        var pos = [e.pageX, e.pageY]
        // this.setState({hoverPos:pos, ownUpdate:true})
    }


    getRow(text,  predCode=null){
        var pred = this.state.answers[predCode]
        var satisfy = []
        if(pred && Array.isArray(pred) && pred.length > 0) {
            satisfy = pred
        }
        return (<tr style={this.getStyle(predCode)}>
            <td className="noselect" dangerouslySetInnerHTML={{__html: text}}
            onMouseOver={(e) => {this.handleMouseEnter(e, satisfy)}}
            onMouseMove={this.handleMouseMove}
            onMouseLeave={this.handleMouseLeave}
            /> 
        </tr>)
    }

    getStyle(predCode, options) {
        // console.log("PRED CODE", predCode, "answers", this.state.answers, this.state.answers[predCode])
        if(!(predCode in this.state.answers))
            return {"color":"#bbb"}
        var pred = this.state.answers[predCode]
        var style = {}
        // console.log("RED CODE", predCode, "PRED", pred)
        style.color = "#bbb"
        if(pred == true || (Array.isArray(pred) && pred.length > 0) ) {
            style.color = "#000"
            for(var key in options)
                style[key] = options[key]

        }
        console.log("Style", predCode, style)
        return style
    }

    getGraph(nodule_number) {
        var keys = ['solid', 'partsolid', 'partsolid-solid', 'GGN']
        var nodule = null
        for(let i = 0; i < this.state.results[0].nodules.length; i++) {
            var nod = this.state.results[0].nodules[i]
            if(nod.nodule_number == nodule_number) {
                nodule = nod
            }
        }
        if(!nodule)
            return null

        var lineKeys = keys.filter(x => {
            return x in nodule
        }).map(x => {
            return {
                key:x,
                dataKey: "nodule_"+nodule_number+"_"+x
            }
        }) 
        //var colors = ["red", "blue", "green"]
        var colors = {
            'solid': 'red',
            'partsolid': 'blue',
            'GGN': 'green',
            'partsolid-solid':'red',
        }
        var lines = lineKeys.map((x, ix) => { 
            return <Line key={ix} type="monotone" dataKey={x.dataKey} stroke={colors[x.key]} yAxisId={0} /> 
        })

        return (<LineChart
            key={nodule_number}
            width={600}
            height={400}
            data={this.state.data}
            margin={{ top: 30, right: 40, left: 60, bottom: 30 }}
        >
            <XAxis domain={['auto', 'auto']} dataKey="date">
              <Label value="Date" position="insideBottom" dy={20}/>
            </XAxis>
            <YAxis domain={['auto', 'auto']} unit="mm" > 
              <Label value="Diameter" position="insideLeft" dx={-60} textAnchor="end"/>
            </YAxis>
            <Legend layout="vertical" verticalAlign="middle" align="right" />
            <Tooltip />
            <CartesianGrid stroke="#f5f5f5" />
            {lines}
        </LineChart>)
    } 

     render() {

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
                            <RADSRow style={this.getStyle("")}>Prior chest CT examination(s) being located for comparison</RADSRow>
                            <RADSRow style={this.getStyle("")}>Part or all of lungs cannot be evaluated</RADSRow>
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
                            <RADSRow style={this.getStyle("1-nonodules")}>No lung nodules</RADSRow>
                            <RADSRow style={this.getStyle("")}>Nodule(s) with specific calcifications: complete, central, popcorn, concentric rings and fat containing nodules</RADSRow>
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
                            <RADSRow style={this.getStyle("2-prefissural")}>
                                <b>Prefissural nodule(s):</b> (See Footnote 11)<br/>
                                <span style={this.getStyle("2-prefissural", {"color":"red"})}> &lt; 10 mm (524 mm<sup>3</sup>)</span>
                            </RADSRow>

                            <RADSRow style={this.getStyle("2-solid")}>
                                <b>Solid nodule(s):</b><br/>
                                <span style={this.getStyle("2-solid-a", {"color":"red"})}> &lt; 6 mm (&lt; 113 mm<sup>3</sup>)</span><br/>
                                <span style={this.getStyle("2-solid-b", {"color":"red"})}> new &lt; 4 mm (&lt; 34 mm<sup>3</sup>)</span>
                            </RADSRow>


                            <RADSRow style={this.getStyle("2-partsolid")}>
                                <b>Part solid nodule(s):</b><br/>
                                <span style={this.getStyle("2-partsolid", {"color":"red"})}> &lt; 6 mm total diameter (&lt; 113 mm<sup>3</sup>) on baseline screening</span><br/>
                            </RADSRow> 

                            <RADSRow style={this.getStyle("2-ggn")}>
                                <b>Non solid nodule(s) (GGN):</b><br/>
                                <span style={this.getStyle("2-ggn-a", {"color":"red"})}> &lt; 30 mm (&lt; 14137 mm<sup>3</sup>) </span><b>OR</b><br/>
                                <span>
                                    <span style={this.getStyle("2-ggn-b1", {"color":"red"})}> &ge; 30 mm (&ge; 14137 mm<sup>3</sup>)</span> and 
                                    <span style={this.getStyle("unchanged-ggn", {"color":"red"})}> unchanged </span> or 
                                    <span style={this.getStyle("slowlygrowing-ggn", {"color":"red"})}> slowly growing </span>
                                </span>
                            </RADSRow> 

                            <RADSRow style={this.getStyle("2-cat")}>
                                <b style={this.getStyle("2-cat", {"color":"red"})}>TODO: Category 3 or 4 nodules unchanged for &ge; 3 months</b>
                            </RADSRow> 
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

                            <RADSRow style={this.getStyle("3-solid")}>
                                <b>Solid nodule(s):</b><br/>
                                <span style={this.getStyle("3-solid-a", {"color":"red"})}> &ge; 6 to &lt; 8 mm (&ge; 113 to &lt; 268 mm<sup>3</sup>) at baseline</span> <b>OR</b><br/>
                                <span style={this.getStyle("3-solid-b", {"color":"red"})}> new &ge; 4 mm to &lt; 6mm (&ge; 4 to &lt; 113 mm<sup>3</sup>)</span>
                            </RADSRow>


                            <RADSRow style={this.getStyle("3-partsolid")}>
                                <b>Part solid nodule(s):</b><br/>
                                <span style={this.getStyle("3-partsolid-a", {"color":"red"})}> &ge; 6 mm total diameter (&ge; 113 mm<sup>3</sup>) with solid component &lt; 6 mm (&lt; 113 mm<sup>3</sup>)</span> <b>OR</b> <br/>
                                <span style={this.getStyle("3-partsolid-b", {"color":"red"})}> new &lt; 6 mm total diameter (&lt; 113 mm<sup>3</sup>)</span>
                            </RADSRow> 

                            <RADSRow style={this.getStyle("3-ggn")}>
                                <b>Non solid nodule(s) (GGN):</b><br/>
                                <span style={this.getStyle("3-ggn-a", {"color":"red"})}> &ge; 30 mm (&lt; 14137 mm<sup>3</sup>) on baseline CT</span> <b>OR</b><br/>
                                <span style={this.getStyle("new-ggn", {"color":"red"})}> new</span>
                            </RADSRow>
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
                            <RADSRow style={this.getStyle("4a-solid")}>
                                <b>Solid nodule(s):</b><br/>
                                <span style={this.getStyle("4a-solid-a", {"color":"red"})}> &ge; 8 to &lt; 15 mm (&ge; 268 to &lt; 1767 mm<sup>3</sup>) at baseline</span> <b>OR</b><br/>
                                <span style={this.getStyle("4a-solid-b", {"color":"red"})}> growing &lt; 8 mm (&lt; 268 mm<sup>3</sup>)</span> <b>OR</b><br/>
                                <span style={this.getStyle("4a-solid-c", {"color":"red"})}> new &ge; 6 to &lt; 8 mm (&ge; 113 to &lt; 268 mm<sup>3</sup>)</span>
                            </RADSRow>


                            <RADSRow style={this.getStyle("4a-partsolid")}>
                                <b>Part solid nodule(s):</b><br/>
                                <span style={this.getStyle("4a-partsolid-a", {"color":"red"})}> &ge; 6 mm (&ge; 113 mm<sup>3</sup>) with solid component &ge; 6 mm to &lt; 8 mm (&ge; 113 to &lt; 268 mm<sup>3</sup>)</span> <b>OR</b> <br/>
                                <span style={this.getStyle("4a-partsolid-b", {"color":"red"})}> with new or growing &lt; 4 mm (&lt; 34 mm<sup>3</sup>) solid component</span>
                            </RADSRow>
                            <RADSRow style={this.getStyle("")}>
                                <b>Endobronchial nodule</b>
                            </RADSRow>

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
                            <RADSRow style={this.getStyle("4b-solid")}>
                                <b>Solid nodule(s):</b><br/>
                                <span style={this.getStyle("4b-solid-a", {"color":"red"})}> &ge; 15 (&ge; 1767 mm<sup>3</sup>)</span> <b>OR</b><br/>
                                <span style={this.getStyle("4b-solid-b", {"color":"red"})}> new or growing, and &ge; 8 mm (&ge; 268 mm<sup>3</sup>)</span>
                            </RADSRow>


                            <RADSRow style={this.getStyle("4b-partsolid")}>
                                <b>Part solid nodule(s):</b><br/>
                                <span style={this.getStyle("4b-partsolid-a", {"color":"red"})}> a solid component &ge; 8 mm (&ge; 268 mm<sup>3</sup>)</span> <b>OR</b> <br/>
                                <span style={this.getStyle("4b-partsolid-b", {"color":"red"})}> a new or growing &ge; 4 mm (&ge; 34 mm<sup>3</sup>) solid component</span>
                            </RADSRow>
                            <RADSRow style={this.getStyle("")}>
                                TODO: Category 3 or 4 nodules with additional features or imaging findings that increases the suspicion of malignancy
                            </RADSRow>
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
                            <RADSRow>
                                <b>Modifier - may add on to category 0-4 coding</b>
                            </RADSRow>
                        </td>
                        <td> As appropriate to the specific finding </td>
                        <td> n/a </td>
                        <td> 10% </td>
                    </tr>  
                </table>

                {this.state.hover && 
                    <div className="hover noselect" style={{left:this.state.hoverPos[0], top:this.state.hoverPos[1]}}> 
                        {/*<pre>{summary}</pre>*/}
                        {this.state.results.length > 0 && this.state.showNodules.map((x) => {
                            return this.getGraph(x)
                        })}
                    </div>
                }
                {this.state.results.length > 0 && this.state.results[0].nodules.map((x, ix) => {
                    return this.getGraph(ix)
                })}

            </div>
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
}

const connectedLung_RADS = connect(mapState, actionCreators)(Lung_RADS)
export { connectedLung_RADS as Lung_RADS }
