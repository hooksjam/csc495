import React from 'react'
import { FormActions, StudyActions } from 'Actions'
import { connect } from 'react-redux'
import { 
    Result,
    ESQueryDialog,
    Lung_RADS,
    SDCForm,
    Options,
 } from 'Components'

var screenChangeThreshold = 800

var patients = [
    {
        id: 0,
        name: "John Smith",
        diagnosticProcedureID:"PKG_LDCT_LUNG",
        results: [
            {
                date: "2020-01-01",
                responseID:"",
                nodules: [
                    {
                        nodule_number:0,
                        "solid": 30,
                        "partsolid": 5,
                    },
                    {
                        nodule_number:1,
                        "GGN": 5,
                    } 
                ]
            },
            {
                date: "2019-01-01",
                responseID:"",
                nodules: [
                    {
                        nodule_number:0,
                        "solid": 25,
                        "partsolid": 3,
                    },
                    {
                        nodule_number:1,
                        "GGN": 4,
                    } ,
                ]
            },
            {
                date: "2018-01-01",
                responseID:"",
                nodules: [
                    {
                        nodule_number:0,
                        "solid": 22,
                        "partsolid": 2,
                    },
                    {
                        nodule_number:1,
                        "GGN": 3,
                    } 
                ]
            }  
        ]
    },
    {
        id: 1,
        name: "Jane Doe",
        diagnosticProcedureID:"PKG_THYROID_US",
        results: [
            {
                date: "2020-01-01",
                responseID: "",
                nodules: [
                    {
                        nodule_number:0,
                        "solid": 30,
                        "partsolid": 5,
                    },
                    {
                        nodule_number:1,
                        "GGN": 5,
                    } 
                ]
            },
            {
                date: "2019-01-01",
                responseID: "",
                nodules: [
                    {
                        nodule_number:0,
                        "solid": 25,
                        "partsolid": 3,
                    },
                    {
                        nodule_number:1,
                        "GGN": 4,
                    } ,
                ]
            }  
        ]
    }
]

class StudyPage extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            smallScreen:false,
            patientDropdown:false,
            currentPatient:0,
            currentMode:0,
            scroll:0,
            collapseNav:true,
            showOptions:false,
        }

        this.state.currentResult = patients.map(x => {
            return 0
        })

        this.getPatient = this.getPatient.bind(this)
        this.getResultList = this.getResultList.bind(this)
        this.getPatientList = this.getPatientList.bind(this)

        this.nextPatient = this.nextPatient.bind(this)
        this.prevPatient = this.prevPatient.bind(this)
        this.goToPatient = this.goToPatient.bind(this)
        this.toggleDropdown = this.toggleDropdown.bind(this)
        this.selectMode = this.selectMode.bind(this)
        this.goToResult = this.goToResult.bind(this)
        this.nextResult = this.nextResult.bind(this)
        this.prevResult = this.prevResult.bind(this)
        this.toggleNav = this.toggleNav.bind(this)
        this.toggleOptions = this.toggleOptions.bind(this)
        this.viewForms = this.viewForms.bind(this)
    }

    getPatient(id) {
        for(let i = 0; i < this.props.study.patients.length; i++) {
            if(id == this.props.study.patients[i].id)
                return this.props.study.patients[i]
        }
        return null
    }

    componentDidMount() {
        // await this.props.getFormList();
        // await this.props.getForm("PKG_LDCT_LUNG");
        // await this.getResponseList(0, this.props.study.patients[this.currentPatient].id)

        // window.addEventListener("resize", this.resize.bind(this))
    }

    resize() {
        this.setState({smallScreen: window.innerWidth <= screenChangeThreshold})
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevState.currentPatient != this.state.currentPatient) {
            // await this.getResponseList(0, this.props.study.patients[this.currentPatient].id)
        }
    }

    getResultList() {
        // var id = this.props.study.patients[this.currentPatient].id
        // var results = this.response.cache.filter(x => x.patientID = id)
        return patients[this.state.currentPatient].results.map((x, ix) => {
        // return results.map((x, ix) => {
            return (<div 
                key={`result_${ix}`}
                className={`navItem ${ix == this.state.currentResult[this.state.currentPatient]?"selected":""}`}
                onClick={() => {this.goToResult(ix)}}>
                <span>{x.date}</span> 
            </div>)
        })
    }

    getPatientList() {
        return patients.map((x,ix) => {
        // return this.props.study.patients.map((x,ix) => {
            return (<div 
                key={`patient_${x.id}`}
                className={`navItem ${this.state.currentPatient == ix?"selected":""}`}
                onClick={() => {this.goToPatient(ix)}}>
                <span>{x.name} : {x.id}</span>
            </div>)
        })
    }

    nextPatient() {
        if(this.state.currentPatient == patients.length - 1) {
            // this.goToPatient(0)
        } else {
            this.goToPatient(this.state.currentPatient+1)
        }
    }

    prevPatient() {
        if(this.state.currentPatient == 0) {
            //this.goToPatient(patients.length-1)
        } else {
            this.goToPatient(this.state.currentPatient-1)
        }
    }

    goToPatient(i) {
        console.log("GO TO PATIENT ", i)
        this.setState({currentPatient:i, patientDropdown:false})
    }

    toggleDropdown() {
        console.log("Toggle dropdown")
        this.setState({patientDropdown:!this.state.patientDropdown})

    }


    nextResult() {
        if(this.state.currentResult[this.state.currentPatient] == patients[this.state.currentPatient].results.length - 1) {
            // this.goToResult(0)
        } else {
            this.goToResult(this.state.currentResult[this.state.currentPatient]+1)
        }
    }

    prevResult() {
        if(this.state.currentResult[this.state.currentPatient] == 0) {
            //this.goToResult(patients[this.state.currentPatient].results.length-1)
        } else {
            this.goToResult(this.state.currentResult[this.state.currentPatient]-1)
        }
    }
        
    goToResult(i) {
        var newState = this.state;
        newState.currentResult[this.state.currentPatient] = i
        newState.mode = 0
        this.setState(newState)
    }

    toggleNav() {
        this.setState({collapseNav:!this.state.collapseNav})
    }

    selectMode(i) {
        this.setState({currentMode:i})
    }

    toggleOptions() {
        this.setState({showOptions: !this.state.showOptions})
    }

    viewForms() {
        this.props.history.push({pathname:`/test/`, state: {}})
    }

    render() {
        const columnWidth = this.state.smallScreen ? 12 : 4

        var navStyle = {}
        if(this.state.collapseNav) {
            navStyle.flexBasis = "0px"
        }

        return (
            <div className="studyWrapper">
                <div className="navWrapper" style={navStyle}>
                    <div className="navBar noselect">
                        <div className="navGroup">
                            <h4> Patient {this.state.currentPatient+1}/{patients.length}</h4>
                        </div>
                        <div className="navGroup vertical">
                            {this.getPatientList()}
                        </div>
                        <div className="navGroup vertical">
                            <h4> Results </h4>
                            {this.getResultList()}
                            <div className="navItem">
                                <span>+ new result </span>
                            </div>
                        </div>

                        <div className="navGroup vertical" style={{marginTop:"auto"}}>

                            <div className="navItem" onClick={this.toggleOptions}>
                                <div className="fas fa-cog"/>
                            </div>
                        </div>
                    </div>
                </div>

                {this.state.showOptions && <Options clickOutside={this.toggleOptions} viewForms={this.viewForms}/>}

                <div className="contentWrapper">
                    <div className="toolbar noselect">

                        <div className="toolGroup">
                            <div className="toolItem" onClick={this.toggleNav}>
                                <div className={`arrow fas fa-angle-double-${this.state.collapseNav?"right":"left"}`}/>
                            </div>
                        </div>

                        <div className="toolGroup">
                            <div className={`toolItem ${this.state.currentMode==0?"selected":""}`} onClick={()=>{this.selectMode(0)}}>
                                <span>Report</span>
                            </div>
                            <div className={`toolItem ${this.state.currentMode==1?"selected":""}`} onClick={()=>{this.selectMode(1)}}>
                                <span>Lung-RADS</span>
                            </div>
                        </div>
                        {this.state.collapseNav && 
                            <React.Fragment>
                                <div className="toolGroup">
                                    <div className={`toolItem ${this.state.currentPatient == 0?"disabled":""}`} onClick={this.prevPatient}>
                                        <div className="arrow fas fa-chevron-left"/>
                                    </div>

                                    <div className="toolItem modeTitle disabled">
                                        <span> {patients[this.state.currentPatient].name} </span>
                                    </div>

                                    <div className={`toolItem ${this.state.currentPatient == (patients.length-1)?"disabled":""}`} onClick={this.nextPatient}>
                                        <div className="arrow fas fa-chevron-right"/>
                                    </div>
                                </div>

                                <div className="toolGroup">
                                    <div className={`toolItem ${this.state.currentResult[this.state.currentPatient] == 0?"disabled":""}`} onClick={this.prevResult}>
                                        <div className="arrow fas fa-chevron-left"/>
                                    </div>

                                    <div className="toolItem modeTitle disabled">
                                        <span> {patients[this.state.currentPatient].results[this.state.currentResult[this.state.currentPatient]].date} </span>
                                    </div>

                                    <div className={`toolItem ${this.state.currentResult[this.state.currentPatient] == patients[this.state.currentPatient].results.length - 1?"disabled":""}`} onClick={this.nextResult}>
                                        <div className="arrow fas fa-chevron-right"/>
                                    </div> 
                                </div>
                            </React.Fragment>
                        }
                    </div>

                    <div className="content">
                        {this.state.currentMode == 1 &&  
                            <Lung_RADS patient={patients[this.state.currentPatient]}/>}
                        {this.state.currentMode == 0 && 
                            <SDCForm diagnosticProcedureID={patients[this.state.currentPatient].diagnosticProcedureID} responseID=""/>
                        }
                    </div>

                </div>
            </div>
        )
    }
}

function mapState(state) {
    const { form, authentication, study } = state
    const { user } = authentication

    return { user, form, study }
}
  
const actionCreators = {
    getFormList: FormActions.getFormList,
    getResponseList: FormActions.getResponseList,
}

const connectedStudyPage = connect(mapState, actionCreators)(StudyPage)
export { connectedStudyPage as StudyPage }
