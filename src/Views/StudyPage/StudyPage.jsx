import React from 'react'
import { ResponseActions, FormActions, StudyActions } from 'Actions'
import { connect } from 'react-redux'
import { 
    Result,
    ESQueryDialog,
    Lung_RADS,
    SDCForm,
    Options,
 } from 'Components'

var screenChangeThreshold = 800

var patientss = [
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
            currentPatient:0,
            currentMode:0,
            collapseNav:true,
            showOptions:false,
        }

        this.state.currentResult = this.props.study.patients.map(x => {
            return 0
        })

        this.getResults = this.getResults.bind(this)
        this.getPatients = this.getPatients.bind(this)
        this.getStudyAid = this.getStudyAid.bind(this)
        this.getForm = this.getForm.bind(this)

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

    async componentDidMount() {
        if(this.props.study.patients.length == 0) {
            await this.props.getPatientList(this.props.user)
        }
        // window.addEventListener("resize", this.resize.bind(this))
    }

    resize() {
        this.setState({smallScreen: window.innerWidth <= screenChangeThreshold})
    }

    async componentDidUpdate(prevProps, prevState) {
        if(prevState.currentPatient != this.state.currentPatient || prevState.currentResult.length != this.props.study.patients.length) {
            await this.props.getResponseList(0, this.props.study.patients[this.currentPatient].id)
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        var newState = {}
        if(nextProps.study.patients.length != prevState.currentResult.length) {
            newState.currentResult = nextProps.study.patients.map(x => {return 0})
        } 
        newState.patients = []
        for(let i = 0; i < nextProps.study.patients.length; i++) {
            var patient = JSON.parse(JSON.stringify(nextProps.study.patients[i]))
            patient.results = nextProps.response.cache[patient.id]
        }
        return newState
    }

    getResults() {
        if(this.study.patients.length == 0)
            return null

        var id = this.props.study.patients[this.state.currentPatient].id
        var results = this.props.response.cache[id]
        if(results) {
            // return patients[this.state.currentPatient].results.map((x, ix) => {
            return results.map((x, ix) => {
                return (<div 
                    key={`result_${ix}`}
                    className={`navItem ${ix == this.state.currentResult[this.state.currentPatient]?"selected":""}`}
                    onClick={() => {this.goToResult(ix)}}>
                    <span>{x.date}</span> 
                </div>)
            })
        } else {
            return null
        }
    }

    getPatients() {
        if(this.props.study.patients.length == 0)
            return null

        // return patients.map((x,ix) => {
        return this.props.study.patients.map((x,ix) => {
            return (<div 
                key={`patient_${x.id}`}
                className={`navItem ${this.state.currentPatient == ix?"selected":""}`}
                onClick={() => {this.goToPatient(ix)}}>
                <span>{x.name} : {x.id}</span>
            </div>)
        })
    }

    getStudyAid() {
        if(this.props.study.patients.length == 0)
            return null

        var style = {}
        if(this.currentMode != 1)
            style.display = "hidden"
        return <div style={style}>
            <Lung_RADS patient={patients[this.state.currentPatient]}/>}
        </div>
    }

    getForm() {
        if(this.props.study.patients.length == 0)
            return null

        var style = {}
        if(this.currentMode != 0)
            style.display = "hidden"

        // Get current patient and current result
        var patient = this.props.study[this.state.currentPatient]
        var result = this.props.response.cache[patient.id][this.state.currentResult]

        return <div style={style}>
            <SDCForm diagnosticProcedureID={result.diagnosticProcedureID} responseID={result.responseID}/>
        </div>
    }

    nextPatient() {
        if(this.state.currentPatient == this.props.study.patients.length - 1) {
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
        if(this.state.currentResult[this.state.currentPatient] == this.props.response.cache[this.props.study.patients[this.state.currentPatient].id].length - 1) {
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
                            <h4> Patient {this.state.currentPatient+1}/{this.props.study.patients.length}</h4>
                        </div>
                        <div className="navGroup vertical">
                            {this.getPatients()}
                        </div>
                        <div className="navGroup vertical">
                            <h4> Results </h4>
                            {this.getResults()}
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
                    {
                    <div className="toolbar noselect">

                        <div className="toolGroup">
                            <div className="toolItem" onClick={this.toggleNav}>
                                <div className={`arrow fas fa-angle-double-${this.state.collapseNav?"right":"left"}`}/>
                            </div>
                        </div>
                        {this.props.study.patients.length> 0 && 
                        <React.Fragment>
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
                                        <span> {this.props.study.patients[this.state.currentPatient].name} </span>
                                    </div>

                                    <div className={`toolItem ${this.state.currentPatient == (this.props.study.patients.length-1)?"disabled":""}`} onClick={this.nextPatient}>
                                        <div className="arrow fas fa-chevron-right"/>
                                    </div>
                                </div>

                                <div className="toolGroup">
                                    <div className={`toolItem ${this.state.currentResult[this.state.currentPatient] == 0?"disabled":""}`} onClick={this.prevResult}>
                                        <div className="arrow fas fa-chevron-left"/>
                                    </div>

                                    <div className="toolItem modeTitle disabled">
                                        <span> {this.props.response.cache[this.props.patients[this.state.currentPatient].id][this.state.currentResult[this.state.currentPatient]].date} </span>
                                    </div>

                                    <div className={`toolItem ${this.state.currentResult[this.state.currentPatient] == this.props.results.cache[this.props.study.patients[this.state.currentPatient].id].length - 1?"disabled":""}`} onClick={this.nextResult}>
                                        <div className="arrow fas fa-chevron-right"/>
                                    </div> 
                                </div>
                            </React.Fragment>
                        }
                        </React.Fragment>}
                    </div>}

                    <div className="content">
                        {this.getStudyAid()}
                        {this.getForm()}
                        {/*this.state.currentMode == 1 && getStudyAid()*/}
                        {/*this.state.currentMode == 0 && getForm()*/}
                    </div>


                </div>
            </div>
        )
    }
}

function mapState(state) {
    const { form, authentication, study, response } = state
    const { user } = authentication

    return { user, form, study, response }
}
  
const actionCreators = {
    getFormList: FormActions.getFormList,
    getResponseList: ResponseActions.getResponseList,
    getPatientList: StudyActions.getPatientList,
}

const connectedStudyPage = connect(mapState, actionCreators)(StudyPage)
export { connectedStudyPage as StudyPage }
