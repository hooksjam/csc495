import React from "react"
import { connect } from 'react-redux'
// import { TI_RADSGraph, TI_RADSRow } from 'Components'
// import { rotateResults } from 'Helpers'
import { TI_RADSSummary, RADSTable, RADSGraph } from 'Components'
import { rotateResults } from 'Helpers'
import { findings, scores } from './TI-RADSConfig.jsx'


var findingNames = [
	"composition", 
	"",
	"",
	"",
	""
]
var scoreColors = [
    {
        background:"#bad896",
        border:"#a0b473",
    },
    {
        background:"#ecef71",
        border:"#e9da51",
    },
    {
        background:"#fdcb22",
        border:"#db9e37",
    },
    {
        background:"#f59044",
        border:"#ac626c",
    },
    {
        background:"#e24c5f",
        border:"#893a42",
    }
]

var overrides = {
    'LI_78046_78046.100004300':'cystic/almost completely cystic',
    'LI_78047_78047.100004300':'spongiform',
    'LI_78048_78048.100004300':'mixed cystic and solid',
    'LI_78044_78044.100004300':'solid/almost completely solid',
    'LI_78045_78045.100004300':'shadowing calcifications prevent assessment',
    'LI_78049_78049.100004300':'anechoic',
    'LI_78050_78050.100004300':'iso/hyperechoic',
    'LI_78051_78051.100004300':'hypoechoic',
    'LI_78052_78052.100004300':'very hypoechoic',
    'LI_78053_78053.100004300':'cannot be determined',
    'LI_78054_78054.100004300':'wider than tall or round',
    'LI_78055_78055.100004300':'tall than wide',
    'LI_78056_78056.100004300':'smooth',
    'LI_78057_78057.100004300':'ill-defined',
    'LI_78058_78058.100004300':'lobulated/irregular',
    'LI_78059_78059.100004300':'extra-thyroidal extension',
    'LI_78060_78060.100004300':'border not seen clearly',
    'LI_78061_78061.100004300':'none',
    'LI_78062_78062.100004300':'large comet-tail artifacts',
    'LI_78063_78063.100004300':'macrocalcifications',
    'LI_78064_78064.100004300':'peripherial calcifications',
    'LI_78065_78065.100004300':'punctate echogenic foci',
    'LI_77991_77991.100004300':'length',
    'LI_77992_77992.100004300':'width',
    'LI_77993_77993.100004300':'height',
    'LI_78001_78001.100004300':'length',
    'LI_77999_77999.100004300':'width',
    'LI_78000_78000.100004300':'height',
    'LI_78034_78034.100004300':'length',
    'LI_78035_78035.100004300':'width',
    'LI_78039_78039.100004300':'height',
    'LI_78040_78040.100004300':'volume',
}

var parseVal = (v) => {
    if(!v)
        return null
    var v = JSON.stringify(v).replace(/"/g, '')
    if(/^[0-9\.]+$/.test(v))
        v = parseFloat(v)
    return v
}

var total = 0
class TI_RADSChart extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			nodule_number:0,
            num_nodules:0,
		}
		this.getStyle = this.getStyle.bind(this)
		this.getFindings = this.getFindings.bind(this)
		this.getScores = this.getScores.bind(this)
		this.getValue = this.getValue.bind(this)
        this.getNoduleNum = this.getNoduleNum.bind(this)
        this.prevNodule = this.prevNodule.bind(this)
        this.nextNodule = this.nextNodule.bind(this)
        this.getSummary = this.getSummary.bind(this)
        this.getName = this.getName.bind(this)
	}

    static getDerivedStateFromProps(nextProps, prevState) {
    	if(nextProps.results != null && nextProps.results.length > 0) {
            var summary = rotateResults(nextProps.results, "nodules")
            return {num_nodules: nextProps.results[0].nodules.length, summary:summary}
	    } else {
	    	return null
	    }
    }

    getNoduleNum() {
        if(this.props.results != null && this.props.results.length > 0 && this.props.results[0].nodules.length > this.state.nodule_number) {
            return this.props.results[0].nodules[this.state.nodule_number].nodule_number
        } else {
            console.log("Can't get nodule num")
            return -1
        }
    }

    prevNodule() {
        if(this.state.nodule_number > 0)
            this.setState({nodule_number: this.state.nodule_number-1})
    }

    nextNodule() {
        if(this.state.nodule_number < this.state.num_nodules)
            this.setState({nodule_number: this.state.nodule_number+1})
    }

    getValue(p) {
        var pred = this.props.answers[p.predicate]
        if(Array.isArray(pred)) {
        	for(var i = 0; i < pred.length; i++) {
        		if(pred[i].nodule_number == this.getNoduleNum()) {
        			return p.points
        		}
        	}
        }
        return 0
    }

    getStyle(predCode, options) {
        // console.log("PRED CODE", predCode, "answers", this.state.answers, this.state.answers[predCode])
        if(!(predCode in this.props.answers))
            return {"color":"#bbb"}
        var pred = this.props.answers[predCode]
        var style = {}
        // console.log("RED CODE", predCode, "PRED", pred)
        style.color = "#bbb"
        if(Array.isArray(pred)) {
        	for(let i = 0; i < pred.length; i++) {
        		if(pred[i].nodule_number == this.getNoduleNum()) {
            		style.color = "#000"

		            for(var key in options)
		                style[key] = options[key]
        		}
        	}
        } else if(pred == true) {
            style.color = "#000"

        }
        return style
    }

    getFindings() {
    	total = 0
        return Object.keys(findings).map((key,ix) => {
            var x = findings[key]
            return <div className="findings" key={ix}>
                <h3> {key} </h3>
                <h4> {x.subtitle} </h4>
                {x.predicates.map((p, ip) => {
                    total += this.getValue(p)
                    return <div className={`predicate`} style={this.getStyle(p.predicate)} key={ip}>
                        <span> {p.text} </span> 
                        <span style={{whiteSpace: "nowrap", marginLeft:"auto"}}> {p.points} {p.points==1?"point":"points"} </span>
                    </div>
                })}
            </div>

        })
    }
    
    getScores() {
        console.log("Total after findings ", total)
        var score = 0
        switch(total) {
            case 0:
            case 1:
                score = 0
            break
            case 2:
                score = 1
            break
            case 3:
                score = 2
            break
            case 4:
            case 5:
            case 6:
                score = 3
            break
            case 7:
            default:
                score = 4
            break
        }

        return scores.map((x, ix) => {
            var bgColor = scoreColors[ix].background
            var borderColor = scoreColors[ix].border
            var styleA = {
               background:`linear-gradient(#eef3f3, ${bgColor})`,
            }

            var styleB = {
               background:`linear-gradient(#eef3f3, ${bgColor})`,
               borderColor:borderColor,
            }

            if(score != ix) {
                styleA.opacity = 0.5
                styleB.opacity = 0.5
            }

            return <div className="scoreWrapper" key={ix}>
                <div className={`score`} style={styleA}>
                    <b>{x.text}</b>
                </div>
                <div className="arrow">
                    <div className="fas fa-arrow-down"/>
                </div>
                <div className="scoreSummary" style={styleB}>
                    <h3> {x.title} </h3>
                    <b> {x.subtitle} </b>
                    <span dangerouslySetInnerHTML={{__html: x.additional}}/>
                </div>
            </div>
        })
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

    getSummary() {
        if(this.state.summary == null)
            return null

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

        var flatten = (results, mapping) => {
            return results.map(result => {
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
                                    map[`${this.getName(obj)}_${name}`] = parseVal(valB)
                                }
                            }
                        } else {
                            map[this.getName(obj)] = parseVal(result[obj])
                        }

                    }
                    return map
                }, {})
            })
        }

        var flatResults = flatten(this.props.results, thyroid)
        var flatNodules = this.state.summary.map(nodule => {
            return flatten(nodule, nodules_graph)
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
            <React.Fragment>
			<div className="studyAid TI-RADS">
                <h1> ACR TI-RADS </h1>

                <div className="toolGroup noduleSelect">
                    <div className={`toolItem ${this.state.nodule_number == 0?"disabled":""}`} onClick={this.prevNodule}>
                        <div className="arrow fas fa-chevron-left"/>
                    </div>

                    <div className="toolItem modeTitle disabled">
                        <span>Nodule: {this.getNoduleNum()}</span>
                    </div>

                    <div className={`toolItem ${this.state.nodule_number == (this.state.num_nodules-1)?"disabled":""}`} onClick={this.nextNodule}>
                        <div className="arrow fas fa-chevron-right"/>
                    </div>
                </div>

                <div className="findingsRow">
                    {this.getFindings()}
                </div>
                <div className="addInfo" style={{"textAlign":"center"}}>
                    <b>Add Points From All Categories to Determine TI-RADS Level</b><br/><br/>
                    <b>Total: {total} points</b>
                </div>
                <div className="findingsRow">
                    {this.getScores()}
                </div>
                <div className="reference">
                    <table>

                        <thead>
                            <tr>
                                <th> COMPOSITION </th>
                                <th> ECHOGENICITY </th>
                                <th> SHAPE </th>
                                <th> MARGIN </th>
                                <th> ECHOGENIC FOCI </th>
                            </tr>
                        </thead>
                        <tr>
                            <td>
                                <i>Spongiform:</i> Composed predominantly (>50%) of small cystic spaces. Do not add further points for other categories. <br/><br/> <i> Mixed cystic and solid: </i> Assign points for predominant solid component. <br/><br/> Assign 2 points if composition cannot be determiend because of calcification.
                            </td>
                            <td>
                                <i>Anechoic:</i> Applies to cystic or almost completely cystic nodules. <br/><br/> <i>Hyperechoic/isoechoic/hypoechoic:</i> Compared to adjacent parenchyma. <br/><br/> <i>Very hyopechoic:</i> More hypoechoic than strap muscles. <br/><br/> Assign 1 point if echogenicity cannot be determined.
                            </td>

                            <td>
                                <i>Taller-than-wide:</i> Should be assessed on a transverse image with measurements parallel to sound beam for heigh and perpendicular to sound beam for width. <br/><br/>This can usually be assessed by visual inspection.
                            </td>
                            <td>
                                <i>Lobulated:</i> Protrusions into adjacent tissue.<br/><br/><i>Irregular:</i>Jagged, spiculated, or sharp angles.<br/><br/><i>Extrathyroidal extension</i>Obvious invation = malignancy.<br/><br/>Assign 0 points if margin cannot be determined.
                            </td>
                            <td>
                                <i>Large comet-tail artifacts:</i> V-shaped > 1mm, in cystic components.<br/><br/><i>Macrocalcifications:</i>Cause acoustic shadowing.<br/><br/><i>Peripheral:</i>Complete or incomplete along margin.<br/><br/><i>Punctate echogenic foci:</i> May have small comet-tail artifacts.
                            </td>

                        </tr>


                    </table>
                </div>
                <div>
                    <span>*Refer to discussion of papillary microcarcinomas for 5-9mm TR5 nodules.</span>
                </div>
                {/*<TI_RADSSummary focusResult={this.props.focusResult}/>*/}
                {/*<div className="summary">
                    {this.getSummary()}
                </div>*/}
            </div>
            </React.Fragment>
        )
	}
}

function mapState(state) {
    const {  study } = state

    return { results:study.results, answers:study.answers, names:study.names, ordering:study.ordering }
}
  
const actionCreators = {
}

const connectedTI_RADSChart = connect(mapState, actionCreators)(TI_RADSChart)
export { connectedTI_RADSChart as TI_RADSChart }
