import React from "react"

import {
    Node,
    Collapsible,
} from 'Components'

export class MultiSection extends React.Component {

    constructor(props) {
        super(props);

        // Initialize number of sections to response
        this.state = {
            expanded: true,
            sectionCount:0,
            currentSection:0,
            sections:[],
            sectionCounter:0,
            responseID:null,
        }
        this.toggleExpand = this.toggleExpand.bind(this)
        this.toggleEvent = this.toggleEvent.bind(this)
        // this.getSubNodes = this.getSubNodes.bind(this)
        this.addSection = this.addSection.bind(this)
        this.removeSection = this.removeSection.bind(this)
        this.getSections = this.getSections.bind(this)
        this.getNav = this.getNav.bind(this)
        this.nextSection = this.nextSection.bind(this)
        this.prevSection = this.prevSection.bind(this)
        this.goToSection = this.goToSection.bind(this)
    }

    componentDidMount() {
        document.addEventListener('toggleSections', this.toggleEvent);
    }

    componentWillUnmount() {
        document.removeEventListener('toggleSections', this.toggleEvent);
    }

    toggleEvent(e) {
        if(e.detail != this.state.expanded)
            this.toggleExpand()
    }

    toggleExpand() {
        this.setState({
            expanded: !this.state.expanded
        });
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if(nextProps.response != null && nextProps.node != null && (prevState.sectionCount == 0 || nextProps.response._id != prevState.responseID)) {
            var i = 0

            for(var i = 0; i < nextProps.node.maxInstances; i++) {
                var key = `${nextProps.node.referenceID}_${i}`
                if(!(key in nextProps.response.map))
                    break
            }
            return {sectionCount: i, responseID:nextProps.response._id}
        }
        return null
    }

    addSection() {
        if(this.state.sectionCount < this.props.node.maxInstances) {
            /*this.state.sections.push(
                <Node
                key={`${this.props.id}_${this.state.sectionCounter}`}
                sectionID={this.state.sections.length-1}
                node={this.props.node}
                getChildrenFn={this.props.getChildrenFn}
                response={this.props.response}
                showID={this.state.showID}
                />
            ) */
            this.setState({currentSection: this.state.sectionCount, sectionCount:this.state.sectionCount+1, sections:this.state.sections, sectionCounter:this.state.sectionCounter+1})
            this.props.addAnswer(this.props.response, this.props.node, {instance:this.state.sectionCount})
        }
    }

    removeSection() {
        if(this.state.sectionCount > 0) {
            // this.state.sections.splice(this.state.currentSection, 1)
            this.setState({sectionCount:this.state.sectionCount-1, currentSection:Math.max(this.state.currentSection-1, 0), sections:this.state.sections})
        }
    }

    prevSection() {
        if(this.state.currentSection > 0) 
            this.goToSection(this.state.currentSection-1)
    }

    nextSection() {
        if(this.state.currentSection < this.state.sectionCount-1)
            this.goToSection(this.state.currentSection+1)
    }

    goToSection(section) {
        this.setState({currentSection: section})
    }

    getSections() {
        var sections = []
        for(let i = 0; i < this.state.sectionCount; i++) {
            sections.push(
                <Node
                key={`${this.props.id}_${i}`}
                sectionID={i}
                node={this.props.node}
                addAnswer={this.props.addAnswer}
                getChildrenFn={this.props.getChildrenFn}
                response={this.props.response}
                showID={this.state.showID}
                instance={i}
                />
            )
        }
        return sections
    }

    getNav() {
        return (<div className="multiNav">
                    {/*ref={(x) => {this.props.helpers && this.props.helpers.registerNode(this.props.node, x, this.props.depth)}}>*/}
            <div className="toolGroup">
                <div className="toolItem" onClick={this.addSection}>
                    <div className="plus fas fa-plus"/>
                </div>

                <div className={`toolItem ${this.state.sectionCount < 1?"disabled":""}`} onClick={this.removeSection}>
                    <div className="plus fas fa-minus"/>
                </div>
            </div>
            <div className="toolGroup">
                <div className={`toolItem ${this.state.sectionCount == 0 || this.state.currentSection == 0?"disabled":""}`} onClick={this.prevSection}>
                    <div className="plus fas fa-chevron-left"/>
                </div>
                <div className={`toolItem ${this.state.sectionCount == 0 || this.state.currentSection == this.state.sectionCount-1?"disabled":""}`} onClick={this.nextSection}>
                    <div className="plus fas fa-chevron-right"/>
                </div>
            </div>
            <div className="toolGroup">
            {Array.apply(null, {length: this.state.sectionCount}).map(Number.call, Number).map((x, ix) => {
                return <div key={ix} className={`toolItem ${this.state.currentSection == x?"selected":""}`} onClick={() => this.goToSection(x)}>
                    <span>{x+1}</span>
                </div>
            })}
            </div>
        </div>)
    }

    render() {
        return (
            <div className={`multisection ${this.props.className!=null?this.props.className:""} ${this.state.expanded?"expanded":""}`}>
                <div className="sectionTitle" onClick={this.toggleExpand}>
                    <div className={`arrow fas fa-caret-${this.state.expanded?"down":"right"}`}/>
                    <h3> {this.props.node.title} {this.state.sectionCount==0?0:(this.state.currentSection+1)} / {this.state.sectionCount} </h3>
                    {this.props.showID && <div className="identifier"><span>{this.props.node.referenceID}</span></div>}
                </div>
                <Collapsible show={this.state.expanded}>
                    {this.getNav()}
                    {this.state.sectionCount > 0 && 
                    <div className="subnodes">
                        <Node
                            key={`${this.props.id}_${this.state.currentSection}`}
                            node={this.props.node}
                            sectionID={this.state.currentSection}
                            addAnswer={this.props.addAnswer}
                            getChildrenFn={this.props.getChildrenFn}
                            response={this.props.response}
                            showID={this.state.showID}
                            helpers={this.props.helpers}
                            depth={this.props.depth}
                            instance={this.state.currentSection}
                            />
                    </div>}
                    {this.state.sectionCount > 0 && this.getNav()}
                </Collapsible>
            </div>
        )
        /*return (
            <div className={`section ${this.props.className!=null?this.props.className:""} ${this.state.expanded?"expanded":""}`}>
                <div className="sectionTitle" onClick={this.toggleExpand}>
                    <div className={`arrow fas fa-caret-${this.state.expanded?"down":"right"}`}/>
                    <h3> {this.props.node.title} </h3>
                    {this.props.showID && <div className="identifier"><span>{this.props.node.referenceID}</span></div>}
                </div>
                <Collapsible show={this.state.expanded} className={`questions`} style={{paddingLeft:"10px"}}>
                    {this.getSubNodes()}
                </Collapsible>
            </div>
        )*/
    }
}

/*<Card style={{}}>
    <CardContent>
        <Typography variant="h3" onClick={this.toggleExpand}>
            {title}
        </Typography>
        <Collapse className="sectionContent" in={this.state.expanded} timeout="auto" unmountOnExit>
            <List>{rootQuestions}</List>
        </Collapse>
    </CardContent>
</Card>*/