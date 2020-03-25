import React from "react"

export class RADSTable extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return null
    }
      
    render() {
        var map = this.props.map
        var data = this.props.data
        var keys
        var values
        if(Array.isArray(map)) {
            keys = map
            values = map.reduce((vals, obj) => {
                if(obj == Object(obj))
                    vals[obj] = Object.values(obj)[1]
                else
                    vals[obj] = null
                return vals
            }, {})
        } else {
            keys = Object.keys(map)
            values = map
        }
        return (<table>
            <thead>
                {keys.reduce((arr, key) => {
                    var val = values[key]
                    if(!Array.isArray(val)) {
                        arr.push(<th>{key}</th>)
                    } else {
                        arr.push.apply(arr, val.map((keyB, ix) => {
                            var name = this.props.getName(keyB)
                            return <th key={arr.length + ix}><tr>{key}</tr><tr>{name}</tr></th>
                        }))
                    }
                    return arr
                }, [])}
            </thead>
            <tbody>
            {data.map(result => {
                return <tr className="mainRow" onClick={()=>{this.props.focusResult(result.responseID, 0, null)}}>
                    {keys.map((x,ix) => {
                        if(x in result) {
                            var val = values[x]
                            if(Array.isArray(val)) {
                                return val.map((key, iy) => {
                                    // Inefficient, but must look through array each time
                                    var find = result[x].find(f => {return Object.keys(f)[0] == key})
                                    if(!find)
                                        return <td></td>
                                    var valB = Object.values(find)[0]
                                    var name = this.props.getName(key)
                                    return <td key={`${ix}_${iy}`}>{valB}</td>
                                })
                            } else {
                                val = result[x]
                                val = this.props.getName(val)
                                return <td key={ix}>{val}</td>
                            }
                        } else {
                            return <td key={ix}></td>
                        }
                    })}
                </tr>

            })}
            </tbody>
        </table>)
    }
}
