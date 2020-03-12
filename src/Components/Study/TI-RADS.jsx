import React from "react"

import { findings, scores } from './TI-RADSConfig.jsx'

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

export class TI_RADS extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        this.getFindings = this.getFindings.bind(this)
        this.getScores = this.getScores.bind(this)
        this.satisfy = this.satisfy.bind(this)
        this.handleMouseEnter = this.handleMouseEnter.bind(this)
        this.handleMouseLeave = this.handleMouseLeave.bind(this)
        this.handleMouseMove = this.handleMouseMove.bind(this)
    }

    handleMouseEnter(e, satisfy) {
    }

    handleMouseLeave(e) {
    }

    handleMouseMove(e) {
    }

    satisfy(p) {
        return true
    }

    getFindings() {
        return Object.keys(findings).map((key,ix) => {
            var x = findings[key]
            return <div className="findings" key={ix}>
                <h3> {key} </h3>
                <h4> {x.subtitle} </h4>
                {x.predicates.map((p, ip) => {
                    var sat = this.satisfy(p)
                    return <div className={`predicate ${sat?"satisfy":""}`} key={ip}>
                        <span> {p.text} </span> 
                        <span style={{whiteSpace: "nowrap", marginLeft:"auto"}}> {p.points} {p.points==1?"point":"points"} </span>
                    </div>
                })}
            </div>

        })
    }

    getScores() {
        return scores.map((x, ix) => {
            var sat = true//this.satisfy(x.predicate)
            var bgColor = scoreColors[ix].background
            var borderColor = scoreColors[ix].border
            var styleA = {
               background:`linear-gradient(#eef3f3, ${bgColor})`,
            }
            var styleB = {
               background:`linear-gradient(#eef3f3, ${bgColor})`,
               borderColor:borderColor,
            }

            return <div className="scoreWrapper" key={ix}>
                <div className={`score ${sat?"satisfy":""}`} style={styleA}>
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

    render() {
        return (
            <div className="studyAid TI-RADS">
                <h1> ACR TI-RADS </h1>
                <div className="findingsRow">
                    {this.getFindings()}
                </div>
                <div className="addInfo">
                    <b>Add Points From All Categories to Determine TI-RADS Level</b>
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
            </div>
        )
    }
}