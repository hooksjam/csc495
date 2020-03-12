import React from 'react'
import { ResponseActions, FormActions, StudyActions } from 'Actions'
import { connect } from 'react-redux'
import { 
    Result,
    ESQueryDialog,
    Lung_RADS,
    TI_RADS,
    SDCForm,
    Options,
 } from 'Components'

var screenChangeThreshold = 800

const aidMap = {
   PKG_LDCT_LUNG: {name:'Lung-RADS', component:Lung_RADS},
   PKG_THYROID_US: {name:'TI-RADS', component:TI_RADS},
}

var dummyPatients = [
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
            patients:[],
            mode:1,
        }

        this.state.currentResult = this.state.patients.map(x => {
            return 0
        })

        this.getCurrentResult = this.getCurrentResult.bind(this)
        this.getResults = this.getResults.bind(this)
        this.getPatients = this.getPatients.bind(this)
        this.getStudyAid = this.getStudyAid.bind(this)
        this.getForm = this.getForm.bind(this)

        this.nextPatient = this.nextPatient.bind(this)
        this.prevPatient = this.prevPatient.bind(this)
        this.goToPatient = this.goToPatient.bind(this)
        this.selectMode = this.selectMode.bind(this)
        this.goToResult = this.goToResult.bind(this)
        this.nextResult = this.nextResult.bind(this)
        this.prevResult = this.prevResult.bind(this)
        this.toggleNav = this.toggleNav.bind(this)
        this.toggleOptions = this.toggleOptions.bind(this)
        this.viewForms = this.viewForms.bind(this)
        this.addResult = this.addResult.bind(this)
        this.setProcedure = this.setProcedure.bind(this)

        this.focusResult = this.focusResult.bind(this)
    }

    async componentDidMount() {
        this.props.getFormList()
        if(this.state.patients.length == 0) {
            await this.props.getPatientList(this.props.user)
        }
        // window.addEventListener("resize", this.resize.bind(this))
    }

    resize() {
        this.setState({smallScreen: window.innerWidth <= screenChangeThreshold})
    }

    async componentDidUpdate(prevProps, prevState) {
        if((prevState.currentPatient != this.state.currentPatient || prevState.currentResult.length != this.state.patients.length) && this.state.patients.length > 0) {
            await this.props.getResponseList(0, this.state.patients[this.state.currentPatient].id)
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        var newState = {}
        if(nextProps.patients.length != prevState.currentResult.length) {
            newState.currentResult = nextProps.patients.map(x => {return 0})
        } 
        newState.patients = []
        for(let i = 0; i < nextProps.patients.length; i++) {
            var patient = JSON.parse(JSON.stringify(nextProps.patients[i]))
            if(patient.id in nextProps.response.results) {
                patient.results = nextProps.response.results[patient.id].map(x => {return nextProps.response.cache[x]})
            } else {
                patient.results = []
            }
            newState.patients.push(patient)
        }
        return newState
    }

    focusResult(responseID, nodeID) {
        console.log("FOCUS!", responseID, nodeID, this.state)
        var match = -1 
        var results = this.state.patients[this.state.currentPatient].results
        for(var i = 0; i < results.length; i++) {
            if(results[i]._id == responseID) {
                match = i
                break
            }
        }
        if(match != -1) {
            console.log("Focus on result", match)
            var newState = {...this.state, currentMode:0}
            newState.currentResult[this.state.currentPatient] = match
            this.setState(newState)
        }
    }

    getCurrentResult() {
        if(this.state.patients.length == 0 || this.state.patients[this.state.currentPatient].results.length == 0)
            return null
        return this.state.patients[this.state.currentPatient].results[this.state.currentResult[this.state.currentPatient]]
    }

    getResults() {
        if(this.state.patients.length == 0)
            return null

        var results = this.state.patients[this.state.currentPatient].results
        if(results && results.length > 0) {
            return results.sort((a, b) => {
                return b.createdAt.localeCompare(a.createdAt)
            }).map((x, ix) => {
                return (<div 
                    key={`result_${ix}`}
                    className={`navItem ${ix == this.state.currentResult[this.state.currentPatient]?"selected":""}`}
                    onClick={() => {this.goToResult(ix)}}>
                    <span>{x.date}</span> 
                </div>)
            })
        } 
    }

    getPatients() {
        if(this.state.patients.length == 0)
            return null

        // return patients.map((x,ix) => {
        return this.state.patients.map((x,ix) => {
            return (<div 
                key={`patient_${x.id}`}
                className={`navItem ${this.state.currentPatient == ix?"selected":""}`}
                onClick={() => {this.goToPatient(ix)}}>
                <span>{x.name} : {x.id}</span>
            </div>)
        })
    }

    getStudyAid() {
        if(this.state.patients.length == 0 || this.state.patients[this.state.currentPatient].results.length == 0 || !this.props.form)
            return null

        var result = this.getCurrentResult()
        if(result) {
            var style = {height:"100%", "display":"flex"}
            if(this.state.currentMode != 1) {
                style.display = "none"
                return null
            }



            if(result.diagnosticProcedureID && result.diagnosticProcedureID != "") {
                var patientID = this.state.patients[this.state.currentPatient].id
                var rawResults = this.props.response.results[patientID]
                .filter(x => {return x in this.props.response.cache})
                .map(x => {return this.props.response.cache[x]})
                .filter(x => {return x.diagnosticProcedureID == result.diagnosticProcedureID})
 
                const Aid = aidMap[result.diagnosticProcedureID].component

                return <div style={style}>
                    {/*<Lung_RADS patient={this.state.patients[this.state.currentPatient]}/>}*/}
                    <Aid focusResult={this.focusResult} rawResults={rawResults}></Aid>{/* patient={dummyPatients[0]} patientID={patientID} rawResults={rawResults}/>*/}
                </div>
            } else {
                return null
            }
        } else {
            return null
        }
    }

    getForm() {
        if(this.state.patients.length == 0)
            return null

        // Get current patient and current result
        var result = this.getCurrentResult()
        

        if(result) {
            var style = {height:"100%"}
            if(this.state.currentMode != 0)
                style.display = "hidden"

            if(result.diagnosticProcedureID && result.diagnosticProcedureID != "") {
                return <div style={style}>
                    <SDCForm diagnosticProcedureID={result.diagnosticProcedureID} response={result}/>
                </div>
            } else if(this.props.form.forms.length > 0) {
                return <div className="studyInfo">
                    <h2> Select a procedure </h2>
                    <div className="navGroup vertical">
                        {this.props.form.forms.map((x, ix) => {
                            return <div key={ix} className="navItem" onClick={() => this.setProcedure(x.diagnosticProcedureID)}>
                                {x.title}
                            </div>
                        })}
                    </div>
                </div>
            }
        } else {
            return null
            /*return <div className="studyInfo">
                <h2> Add a new result </h2>
            </div>*/
        }
    }

    nextPatient() {
        if(this.state.currentPatient == this.state.patients.length - 1) {
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
        this.setState({currentPatient:i, currentMode:0})
    }

    nextResult() {
        if(this.state.currentResult[this.state.currentPatient] == this.state.patients[this.state.currentPatient].results.length - 1) {
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

    addResult() {
        console.log(this.state.patients)
        this.props.addResponse(0, this.state.patients[this.state.currentPatient].id)
        this.setState({currentResult:0})
    }

    setProcedure(x) {
        var result = this.getCurrentResult()
        if(result)
            this.props.setProcedure(result._id, x)
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

        var result = this.getCurrentResult()

        return (
            <div className="studyWrapper">
                <div className="navWrapper" style={navStyle}>
                    <div className="navBar noselect">
                        <div className="navGroup">
                            <h4> Patient {this.state.patients.length > 0 && `${this.state.currentPatient+1}/${this.state.patients.length}`}</h4>
                        </div>
                        <div className="navGroup vertical">
                            {this.getPatients()}
                        </div>
                        <div className="navGroup vertical">
                            <h4> Results </h4>
                            <div className="navItem" onClick={this.addResult}>
                                <div className="fas fa-plus"/>
                            </div>
                            {this.getResults()}
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
                        {this.state.patients.length > 0 && 
                        <React.Fragment>
                            {result != null && result.diagnosticProcedureID && result.diagnosticProcedureID != "" &&
                            <div className="toolGroup">
                                <div className={`toolItem ${this.state.currentMode==0?"selected":""}`} onClick={()=>{this.selectMode(0)}}>
                                    <span>Report</span>
                                </div>
                                <div className={`toolItem ${this.state.currentMode==1?"selected":""}`} onClick={()=>{this.selectMode(1)}}>
                                    <span>{aidMap[result.diagnosticProcedureID].name}</span>
                                </div>
                            </div>}
                            {this.state.collapseNav && 
                                <React.Fragment>
                                    <div className="toolGroup">
                                        <div className={`toolItem ${this.state.currentPatient == 0?"disabled":""}`} onClick={this.prevPatient}>
                                            <div className="arrow fas fa-chevron-left"/>
                                        </div>

                                        <div className="toolItem modeTitle disabled">
                                            <span> {this.state.patients[this.state.currentPatient].name} </span>
                                        </div>

                                        <div className={`toolItem ${this.state.currentPatient == (this.state.patients.length-1)?"disabled":""}`} onClick={this.nextPatient}>
                                            <div className="arrow fas fa-chevron-right"/>
                                        </div>
                                    </div>

                                    {this.state.patients[this.state.currentPatient].results.length > 0 && 
                                    <div className="toolGroup">
                                        <div className={`toolItem ${this.state.currentResult[this.state.currentPatient] == 0?"disabled":""}`} onClick={this.prevResult}>
                                            <div className="arrow fas fa-chevron-left"/>
                                        </div>

                                        <div className="toolItem modeTitle disabled">
                                            <span> {this.state.patients[this.state.currentPatient].results[this.state.currentResult[this.state.currentPatient]].date} </span>
                                        </div>

                                        <div className={`toolItem ${this.state.currentResult[this.state.currentPatient] == this.state.patients[this.state.currentPatient].results.length - 1?"disabled":""}`} onClick={this.nextResult}>
                                            <div className="arrow fas fa-chevron-right"/>
                                        </div> 

                                    </div>}

                                    <div className="toolGroup">
                                        <div className="toolItem" onClick={this.addResult}>
                                            <div className="fas fa-plus"/>
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

    return { user, form, patients:study.patients, response }
}
  
const actionCreators = {
    getFormList: FormActions.getFormList,
    addResponse: ResponseActions.addResponse,
    getResponseList: ResponseActions.getResponseList,
    setProcedure: ResponseActions.setProcedure,
    getPatientList: StudyActions.getPatientList,
    initStudy: StudyActions.initStudy,
}

const connectedStudyPage = connect(mapState, actionCreators)(StudyPage)
export { connectedStudyPage as StudyPage }
