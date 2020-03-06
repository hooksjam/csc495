import React from 'react'
import { connect } from 'react-redux'
import { ResponseActions, FormActions } from 'Actions'
import { Node, Tracker } from 'Components'

import ReactDOM from 'react-dom'

var divCache = {}
var divCacheTimeout = null

class SDCForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showSections:true,
            showQuestions:true,
            showIDs:false,
            nodeCount: 0,
        }
        this.getTitle = this.getTitle.bind(this)
        this.getProperties = this.getProperties.bind(this)
        this.getSections = this.getSections.bind(this)
        this.toggleSections = this.toggleSections.bind(this)
        this.toggleQuestions = this.toggleQuestions.bind(this)
        this.toggleIDs = this.toggleIDs.bind(this)
        this.submitForm = this.submitForm.bind(this)
        this.handleScroll = this.handleScroll.bind(this)
        this.scrollTo = this.scrollTo.bind(this)
        this.registerNode = this.registerNode.bind(this)
    }

	componentDidMount() {
        divCache = {}
        if(this.props.diagnosticProcedureID != "" && !(this.props.diagnosticProcedureID in this.props.cache))
            this.props.getForm(this.props.diagnosticProcedureID)
	}

    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.diagnosticProcedureID != this.props.diagnosticProcedureID) {
            divCache = {}
            if(!(nextProps.diagnosticProcedureID in this.props.cache))
                this.props.getForm(nextProps.diagnosticProcedureID)
        }
    }

    getTitle() {
        for(let i = 0; i < this.props.form.properties.length; i++) {
            if(this.props.form.properties[i].name == "OfficialName")
                return <h1> {this.props.form.properties[i].value} </h1>
        }
        return null
    }

    getProperties() {
        if(this.props.form.properties) {
            return this.props.form.properties.map((x, ix) => {
                return <span key={x.name}><strong>{x.name}</strong>: {x.value}</span>
            })
        } else
            return null

    }

    registerNode(node, x, depth) {
        if(node.nodeType == "Section" && !(node.referenceID in divCache)) {
            divCache[node.referenceID] = {node:node, ref:x, depth:depth}
        }
        if(Object.keys(divCache).length != this.state.nodeCount) {

            if(divCacheTimeout != null)
                clearTimeout(divCacheTimeout)

            divCacheTimeout = setTimeout(() => {
                 this.setState({nodeCount: Object.keys(divCache).length})
                divCacheTimeout = null
            }, 1000)
        }
    }
    getSections() {
        var helpers = {registerNode:this.registerNode}
        // console.log("HELPRS!", helpers)
        return this.props.form.roots.map((node,ix) => {
            return (
                <Node
                    key={`${ix}_${node.referenceID}`}
                    id={`${ix}_${node.referenceID}`}
                    node={node}
                    getChildrenFn={this.props.form.getChildrenFn}
                    addAnswer={this.props.addAnswer}
                    response={this.props.response}
                    helpers={helpers}
                    depth={0}
                    instance={0}
                />
            )
        })
    }

    toggleSections() {
        document.dispatchEvent(new CustomEvent('toggleSections', {detail: !this.state.showSections}))
        this.setState({showSections:!this.state.showSections})
    }

    toggleQuestions() {
        document.dispatchEvent(new CustomEvent('toggleQuestions', {detail: !this.state.showQuestions}))
        this.setState({showQuestions:!this.state.showQuestions})
    }

    toggleIDs() {
        document.dispatchEvent(new CustomEvent('toggleIDs', {detail: !this.state.showIDs}))
        this.setState({showIDs:!this.state.showIDs})
    }

    submitForm() {
        alert("Submitted!")
    }

    handleScroll(e) {
        document.dispatchEvent(new CustomEvent('trackerScroll', {detail:e}))
    }

    scrollTo(obj) {
        this.content.scrollTo(0, obj.ref.offsetTop)

        var node = ReactDOM.findDOMNode(obj.ref)
        node.classList.toggle("glow", true)
        setTimeout(() => {
            node.classList.toggle("glow", false)
        }, 1000)
    }

    render() {
        if(this.props.form == null) {
            return (<div className="spinWrapper">
                <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div> 
            </div>)
        } else {
            return (
            <div className="SDCForm">
                <div className="formNav">
                    <div className="navGroup">
                        <div className="navItem" onClick={this.toggleSections}>
                            <span>Toggle Sections</span>
                        </div>
                        <div className="navItem" onClick={this.toggleQuestions}>
                            <span>Toggle Questions</span>
                        </div>
                        <div className="navItem" onClick={this.toggleIDs}>
                            <span>Toggle IDs</span>
                        </div>
                    </div>

                    {/*<div className="navGroup">
                        <Tracker items={divCache} count={this.state.nodeCount} scrollTo={this.scrollTo}/>
                    </div>*/}
                </div>
                <div className="formContent" ref={(x) => {this.content = x}} onScroll={this.handleScroll}>
                    {this.getTitle()}
                    <div className="summary" ref={(x) => {this.summary = x}}>
                        {this.getProperties()}
                    </div>
                    <div className="sections">
                        {this.getSections()}
                        <div className="footer">
                            <div className="navItem submit" onClick={this.submitForm}>
                                <span>Submit Form</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            )
        }
    }
}



function mapState(state, ownProps) {
    var form = null
    if(ownProps.diagnosticProcedureID in state.form.cache)
        form = state.form.cache[ownProps.diagnosticProcedureID]
    var cache = state.form.cache

    return { form, cache }
}
  
const actionCreators = {
    getForm: FormActions.getForm,
    addAnswer: ResponseActions.addAnswer,
}

const connectedSDCFormPage = connect(mapState, actionCreators)(SDCForm)
export { connectedSDCFormPage as SDCForm }