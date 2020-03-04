import React from "react"

import {
    Node,
    Collapsible,
} from 'Components'

export class Section extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            expanded: true
        }
        this.toggleExpand = this.toggleExpand.bind(this)
        this.toggleEvent = this.toggleEvent.bind(this)
        this.getSubNodes = this.getSubNodes.bind(this)
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

        document.dispatchEvent(new CustomEvent('trackerScroll', {detail:null}))
    }


    getSubNodes() {   
        if (!this.props.node.dependencies || this.props.node.dependencies.length == 0)
            return null

        var filtered = this.props.node.dependencies.filter(dep => dep.choiceid == null).map(dep => this.props.getChildrenFn(dep.nodeID))

        if(filtered.length == 0)
            return null

        return filtered.map((node, ix) => {
            return <Node
                    key={`${this.props.id}_${ix}_${node.referenceID}`}
                    id={`${this.props.id}_${ix}_${node.referenceID}`}
                    node={node}
                    nested={true}
                    addAnswer={this.props.addAnswer}
                    getChildrenFn={this.props.getChildrenFn}
                    response={this.props.response}
                    helpers={this.props.helpers}
                    depth={this.props.depth}
                    />
            })
    }

    render() {
        if(this.props.sectionID == null) {
            return (
                <div 
                    className={`section ${this.props.className!=null?this.props.className:""} ${this.state.expanded?"expanded":""}`} 
                    ref={(x) => {this.props.helpers && this.props.helpers.registerNode(this.props.node, x, this.props.depth)}}>

                    <div className="sectionTitle" onClick={this.toggleExpand}>
                        <div className={`arrow fas fa-caret-${this.state.expanded?"down":"right"}`}/>
                        <h3> {this.props.node.title} </h3>
                        {this.props.showID && <div className="identifier"><span>{this.props.node.referenceID}</span></div>}
                    </div>
                    <Collapsible show={this.state.expanded} className="subnodes">
                        {this.getSubNodes()}
                    </Collapsible>
                </div>
            )
        } else {
            return this.getSubNodes()

        }
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