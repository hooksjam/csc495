import React from "react"
import { connect } from 'react-redux'

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, ReferenceLine,
  ReferenceDot, Tooltip, CartesianGrid, Legend, Brush, ErrorBar, AreaChart, Area,
  Label, LabelList } from 'recharts'

import { StudyActions } from 'Actions'

class RADSGraph extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data:null

        }
        this.getGraph = this.getGraph.bind(this)
        this.close = this.close.bind(this)
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        console.log("DERP!")
        /*if(!nextProps.results) {
            return null
        }*/

        // Sort by date
        var data = nextProps.data.sort((a, b) => {
            //return new Date(b.date).localeCompare(b.createdAt)
            return new Date(b.date) - new Date(a.date)
        }) 

        var keys = new Set()
        for(let i = 0; i < data.length; i++) {
            for(var key in data[i]) {
                if(key != 'date')
                    keys.add(key)
            }
        }
        keys = Array.from(keys)
        console.log("DAT", data, "keys", keys)

        return {
            data:data,
            keys:keys,
        }
    } 

    close() {
    	this.props.focus(null)
    }

    getGraph() {
        if(this.state.keys == null)
            return null
        /*var keys = ['solid', 'partsolid', 'partsolid-solid', 'GGN']
        var nodule = null
        for(let i = 0; i < this.props.results[0].nodules.length; i++) {
            var nod = this.props.results[0].nodules[i]
            if(nod.nodule_number == nodule_number) {
                nodule = nod
            }
        }
        if(!nodule)
            return null*/

        /*var lineKeys = keys.filter(x => {
            return x in nodule
        }).map(x => {
            return {
                key:x,
                dataKey: "nodule_"+nodule_number+"_"+x
            }
        }) */
        //var colors = ["red", "blue", "green"]
        console.log("Getting graph with data", this.state.data, "and keys", this.state.keys)
        var colors = ['red', 'blue', 'green', 'cyan', 'purple', 'pink', 'grey']
        var lines = this.state.keys.map((x, ix) => { 
            return <Line key={ix} type="monotone" dataKey={x} stroke={colors[ix%colors.length]} yAxisId={0} /> 
        })

        return (<LineChart
            key={'test'}
            width={600}
            height={400}
            data={this.state.data}
            margin={{ top: 30, right: 40, left: 60, bottom: 30 }}
        >
            <XAxis domain={['auto', 'auto']} dataKey="date">
              <Label value="Date" position="insideBottom" dy={20}/>
            </XAxis>
            <YAxis domain={['auto', 'auto']} unit="cm" > 
              <Label value="Diameter" position="insideLeft" dx={-60} textAnchor="end"/>
            </YAxis>
            <Legend layout="vertical" verticalAlign="middle" align="right" />
            <Tooltip />
            <CartesianGrid stroke="#f5f5f5" />
            {lines}
        </LineChart>)
    } 
    render() {
        return this.getGraph()

        /*if(this.props.nodule_number) {
            return this.getGraph(this.props.nodule_number)
        }

        if(this.props.results == null || this.props.focusItems == null || this.props.focusItems.length == 0) {
        	return null
        }
        return (<div className="hover noselect">{
                    <div className="close" onClick={this.close}>
                        <div className="fas fa-times"/>
                    </div>
	                {this.props.focusItems.map((x) => {
	                    return this.getGraph(x)
	                })}
	            </div>)*/
    }
}

function mapState(state) {
    const {  study } = state

    return { results:study.results, focusItems:study.focusItems }
}
  
const actionCreators = {
	focus: StudyActions.focusItems
}

const connectedRADSGraph = connect(mapState, actionCreators)(RADSGraph)
export { connectedRADSGraph as RADSGraph }
