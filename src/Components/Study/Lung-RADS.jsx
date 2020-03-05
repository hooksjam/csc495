import React from "react"

import { predicates } from './Lung-RADSConfig.jsx'

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, ReferenceLine,
  ReferenceDot, Tooltip, CartesianGrid, Legend, Brush, ErrorBar, AreaChart, Area,
  Label, LabelList } from 'recharts'

export class Lung_RADS extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nodule:0,
            hover:false,
            hoverPos:[0,0],
            showNodules:[],
            results:[]
        }
        this.handleMouseEnter = this.handleMouseEnter.bind(this)
        this.handleMouseLeave = this.handleMouseLeave.bind(this)
        this.handleMouseMove = this.handleMouseMove.bind(this)
        this.getNoduleSize = this.getNoduleSize.bind(this)

        // Process results with config into nodules
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return null
        var newState = {}
        var results = []
        for(let i = 0; i < nextProps.patient.results.length; i++) {
            var result = nextProps.patient.results[i]
            var obj = {
                date:result.date,
                responseID: result.responseID,
                nodules:{}
            }

            // Go through answers and map to nodules
            // Put answers in map
            var fields = []
            var answerMap = {}
            for(let i = 0; i < result.answers.length; i++) {

            }

            results.push(obj)
        }
    }

    handleMouseEnter(e, satisfy) {
        var pos = [e.pageX, e.pageY]
        this.setState({hover:true, hoverPos:pos, showNodules:satisfy})
    }

    handleMouseLeave(e) {
        this.setState({hover:false})
    }

    handleMouseMove(e) {
        var pos = [e.pageX, e.pageY]
        this.setState({hoverPos:pos})
    }

    getNoduleSize(nodule) {
        var size = 0
        if("solid" in nodule)
            size = Math.max(size, nodule["solid"])
        if("partsolid" in nodule)
            size = Math.max(size, nodule["partsolid"])
        if("GGN" in nodule)
            size = Math.max(size, nodule["GGN"])
        return size
    }

     render() {
        // Calculate predefined predicates about this nodule
        var nodule = 0
        var growing = false
        var growingSlowly = false
        var growthThreshold = 1.5
        var unchanged = false
        var slowGrowthThreshold = 0.1
        var new_nodules = false
        var baseline = true
        var patient = this.props.patient

        //TODO: Sort by date
        if(patient.results.length > 1) {
            var growth = this.getNoduleSize(patient.results[0].nodules[nodule]) - this.getNoduleSize(patient.results[1].nodules[nodule])
            growing = growth > growthThreshold;
            growingSlowly = growth <= growthThreshold && growth > slowGrowthThreshold
            unchanged = !growing && !growingSlowly

            if(patient.results[0].nodules.length > patient.results[1].nodules.length)
                new_nodules = true;
        } else if(patient.results[0].nodules.length > 0) {
            new_nodules = true;
        }

        var evalPred = (obj, nn = 0) => {
            if(!(typeof obj === 'object')) {
                return false
            }

            var key = Object.keys(obj)[0]
            var pred = obj[key]

            switch(key) {
                case "count": {
                    if(Array.isArray(patient.results[0][pred.field]) &&
                        patient.results[0][pred.field].length == pred.value)
                        return true
                    else
                        return false
                }
                case "or": {
                    for(var i = 0; i < pred.length; i++) {
                        if(evalPred(pred[i], nn)) {
                            return true
                        }
                    }
                    return false
                }
                case "and": {
                    for(var i = 0; i < pred.length; i++) {
                        if(!evalPred(pred[i], nn))
                            return false
                    }
                    return true
                }
                case "pred": {
                    switch(pred) {
                        case "new":
                        return new_nodules
                        case "growing":
                        return growing
                        case "baseline":
                        return baseline
                        case "unchanged":
                        return unchanged
                        case "growingSlowly":
                        return growingSlowly
                        default:
                        return false
                    }
                }
                case "lt": {
                    // TODO: only cares about one nodule, should probably do them all
                    return patient.results[0].nodules[nn][pred.field] < pred.value
                }
                case "gte": {
                    return patient.results[0].nodules[nn][pred.field] >= pred.value
                }
                case "eq": {
                    return patient.results[1].nodules[nn][pred.field] == pred.value
                }
                case "change": {
                    var time = 0
                    var first = new Date(patient.results[0].date)
                    var fields = pred.field.split('|')
                    for(var i = 1; i < patient.results.length; i++) {
                        var nodules = patient.results[i].nodules
                        var prev = patient.results[0].nodules
                        if(nodules.length != prev.length)
                            return false

                        for(let j = 0; j < nodules.length; j++) {
                            if("category" in pred) {
                                var cats = pred.category.split('|')
                                var match = false
                                if("category" in nodules[j]) {
                                    for(let k = 0; k < cats.length; k++) {
                                        if(nodules[j].category == cats[k]) {
                                            match = true
                                            break
                                        }
                                    }
                                }
                                if(!match) {
                                    if(j == nodules.length-1)
                                        return false
                                    else
                                        continue
                                }
                            } 

                            for(let k = 0; k < fields.length; k++) {
                                if(!(fields[k] in nodules[j]) && !(fields[k] in prev[j]))
                                    continue
                                if((fields[k] in nodules[j]) != (fields[k] in prev[j]))
                                    return false
                                if(prev[j][fields[k]] - nodules[j][fields[k]] > pred.value)
                                    return false
                            }
                        }

                        // No change, check timeframe
                        var check = new Date(patient.results[i].date) 
                        var yearsDif = first.getFullYear() - check.getFullYear()
                        var monthsDif = yearsDif*12 + first.getMonth() - check.getMonth()
                        if(monthsDif > pred.since)
                            return true
                    }
                }
            }
            return false
        }

        var getFindings = (score) => {
            if(!(score in predicates))
                return null;

            return predicates[score].map(x => {
                // TODO: style as colored if predicate is true?
                // Check current nodule for predicate

                var satisfy = patient.results[0].nodules.filter((y, iy) => {
                    return evalPred(x.predicate, iy)
                }).map(y => {
                    return y.nodule_number
                })

                var style = {}
                if(satisfy.length == 0) {
                    style.color = "#bbb"
                }

                return (<tr style={style}>
                    <td className="noselect" dangerouslySetInnerHTML={{__html: x.text}}
                    onMouseOver={(e) => {this.handleMouseEnter(e, satisfy)}}
                    onMouseMove={this.handleMouseMove}
                    onMouseLeave={this.handleMouseLeave}
                    /> 
                </tr>)
            })
        }

        var summary = JSON.stringify(patient.results, undefined, 2)

        var data = []
        patient.results.map(x => {
            var obj = {date:x.date}
            for(let i = 0; i < x.nodules.length; i++) {
                var keys = ["solid", "partsolid", "GGN"]
                for(let j = 0; j < keys.length; j++) {
                    if(keys[j] in x.nodules[i]) {
                        obj["nodule_"+i.toString()+"_"+keys[j]] = x.nodules[i][keys[j]]
                    }
                }
            }
            data.push(obj)
        })

        // Sort by date
        data = data.sort((a, b) => {
            return new Date(a.date) - new Date(b.date)
        })


        var getGraph = (nodule_num) => {
            var keys = ["solid", "partsolid", "GGN"]
            var lineKeys = keys.filter(x => {
                return x in patient.results[0].nodules[nodule_num]
            }).map(x => {
                return "nodule_"+nodule_num+"_"+x
            }) 
            var colors = ["red", "blue", "green"]
            var lines = lineKeys.map((x, ix) => { 
                return <Line key={ix} type="monotone" dataKey={x} stroke={colors[ix]} yAxisId={0} /> 
            })

            return (<LineChart
                key={nodule_num}
                width={600}
                height={400}
                data={data}
                margin={{ top: 30, right: 40, left: 60, bottom: 30 }}
            >
                <XAxis domain={['auto', 'auto']} dataKey="date">
                  <Label value="Date" position="insideBottom" dy={20}/>
                </XAxis>
                <YAxis domain={['auto', 'auto']} unit="mm" > 
                  <Label value="Diameter" position="insideLeft" dx={-60} textAnchor="end"/>
                </YAxis>
                <Legend layout="vetical" verticalAlign="middle" align="right" />
                <Tooltip />
                <CartesianGrid stroke="#f5f5f5" />
                {lines}
            </LineChart>)
        } 

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
                            {getFindings("0")}
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
                            {getFindings("1")}
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
                            {getFindings("2")}
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
                            {getFindings("3")}
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
                            {getFindings("4A")}
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
                            {getFindings("4B/4X")}
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
                        </td>
                        <td> As appropriate to the specific finding </td>
                        <td> n/a </td>
                        <td> 10% </td>
                    </tr>  
                </table>

                {this.state.hover && 
                    <div className="hover noselect" style={{left:this.state.hoverPos[0], top:this.state.hoverPos[1]}}> 
                        {/*<pre>{summary}</pre>*/}
                        {this.state.showNodules.map((x) => {
                            return getGraph(x)
                        })}
                    </div>
                }
                {patient.results[0].nodules.map((x, ix) => {
                    return getGraph(ix)
                })}

            </div>
        );
    }
}