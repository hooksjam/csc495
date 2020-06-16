import React from "react"
import { connect } from 'react-redux'

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, ReferenceLine,
  ReferenceDot, Tooltip, CartesianGrid, Legend, Brush, ErrorBar, AreaChart, Area,
  Label, LabelList } from 'recharts'

import { StudyActions } from 'Actions'

class Lung_RADSGraph extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
        this.getGraph = this.getGraph.bind(this)
        this.close = this.close.bind(this)
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if(!nextProps.results) {
            return null
        }

        /*var focusSet = new Set()
        for(let i = 0; i < nextProps.focusItems.length; i++) {
        	focusSet.Add(focusItems[i])
        }*/
        // console.log("Focus set", focusSet)

        var data = nextProps.results.map(x => {
            var obj = {date:x.date, createdAt:x.createdAt}
            for(let i = 0; i < x.nodules.length; i++) {
            	//if(!(x.nodules[i].nodule_number in focusSet))
            	//	continue

                var keys = ["solid", "partsolid", "partsolid-solid", "GGN"]
                for(let j = 0; j < keys.length; j++) {
                    if(keys[j] in x.nodules[i]) {
                        obj["nodule_"+x.nodules[i].nodule_number.toString()+"_"+keys[j]] = x.nodules[i][keys[j]]
                    }
                }
            }
            return obj
        })

        // Sort by date
        data = data.sort((a, b) => {
            //return new Date(b.date).localeCompare(b.createdAt)
            return new Date(b.date) - new Date(a.date)
        }) 

        return {
            data:data
        }
    } 

    close() {
    	this.props.focus(null)
    }

    getGraph(nodule_number) {
        var keys = ['solid', 'partsolid', 'partsolid-solid', 'GGN']
        var nodule = null
        for(let i = 0; i < this.props.results[0].nodules.length; i++) {
            var nod = this.props.results[0].nodules[i]
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
        if(this.props.nodule_number) {
            return this.getGraph(this.props.nodule_number)
        }

        if(this.props.results == null || this.props.focusItems == null || this.props.focusItems.length == 0) {
        	return null
        }
        return (<div className="hover noselect">{/*// style={{left:this.state.hoverPos[0], top:this.state.hoverPos[1]}}> */}
                    <div className="close" onClick={this.close}>
                        <div className="fas fa-times"/>
                    </div>
	                {this.props.focusItems.map((x) => {
	                    return this.getGraph(x)
	                })}
	            </div>)
    }
}

function mapState(state) {
    const {  study } = state

    return { results:study.results, focusItems:study.focusItems }
}
  
const actionCreators = {
	focus: StudyActions.focusItems
}

const connectedLung_RADSGraph = connect(mapState, actionCreators)(Lung_RADSGraph)
export { connectedLung_RADSGraph as Lung_RADSGraph }
