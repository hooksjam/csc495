import React from 'react';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { StudyActions } from 'Actions';
import { MenuOption, MenuItem } from 'Components'

class HomePage extends React.Component {

    constructor(props) {
        super(props);
        this.getPatientList = this.getPatientList.bind(this)
        this.getPatientCount = this.getPatientCount.bind(this)
        this.getRecentPatient = this.getRecentPatient.bind(this)
        this.beginStudy = this.beginStudy.bind(this)
    }   

    componentDidMount(){
        console.log(this.props.user)
        this.props.getPatients(this.props.user)
    }

    getPatientList() {
        if(this.props.study.patients == null)
            return null


        return this.props.study.patients.map(x => {
            return <MenuItem> {x} </MenuItem>
        })
    }

    getPatientCount() {
        if(this.props.study.patients == null)
            return 0

        return this.props.study.patients.length
    }

    getRecentPatient() {
        return "someone"
    }

    beginStudy() {
        this.props.history.push({pathname:`/study/`, state: {}})
    }

    render() {
        const { user, users } = this.props;
        return (
            <div className="col-md-6 col-md-offset-3">
                <h1 className="menuTitle">Diagnostic Aid </h1>
                <div style={{display:'flex', flexDirection:'row'}}>
                    <MenuOption onClick={this.beginStudy}>
                        <h2> Begin New Study </h2>
                        <h3> ({this.getPatientCount()} patients) </h3>
                    </MenuOption>
                    <MenuOption> 
                        <h2> Most Recent Study </h2>
                        <h3> ({this.getRecentPatient()}) </h3>
                    </MenuOption>
                </div>
                {/*{users.loading && <em>Loading users...</em>}
                {users.error && <span className="text-danger">ERROR: {users.error}</span>}
                {users.items &&
                    <ul>
                        {users.items.map((user, index) =>
                            <li key={user.id}>
                                {user.firstName + ' ' + user.lastName}
                                {
                                    user.deleting ? <em> - Deleting...</em>
                                    : user.deleteError ? <span className="text-danger"> - ERROR: {user.deleteError}</span>
                                    : <span> - <a onClick={this.handleDeleteUser(user.id)}>Delete</a></span>
                                }
                            </li>
                        )}
                    </ul>
                }
                <p>
                    <Link to="/login">Logout</Link>
                </p>
                <p>
                    <Link to="/test">Test the form parser</Link>
                </p>*/}
            </div>
        );
    }
}

function mapState(state) {
    const { users, authentication, study} = state;
    const { user } = authentication;
    return { user, study };
}

const actionCreators = {
    getPatients: StudyActions.getPatients,
    //deleteUser: UserActions.delete
}

const connectedHomePage = connect(mapState, actionCreators)(HomePage);
export { connectedHomePage as HomePage };