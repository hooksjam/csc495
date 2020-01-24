import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import { History } from 'Helpers';
import { AlertActions } from 'Actions';
import { PrivateRoute } from 'Components';
/*import { HomePage } from 'Views/HomePage';
import { LoginPage } from 'Views/LoginPage';
import { RegisterPage } from 'Views/RegisterPage';
import { UploadFormPage } from 'Views/UploadFormPage';
import { FormTestPage } from 'Views/FormTestPage';
import { FormQueryPage } from 'Views/FormQueryPage';
import { FormSelectorPage } from 'Views/FormSelectorPage';*/
import { TestPage } from 'Views/TestPage';
import { QueryPage } from 'Views/QueryPage';

const theme = createMuiTheme({});
theme.palette.primary.main = "#326295"
theme.palette.primary.dark = "#274d75"
theme.palette.primary.light = "#3a73b0"

theme.palette.secondary.main = "#342e53"
theme.palette.secondary.dark = "#282440"
theme.palette.secondary.light = "#443d6e"

import './App.css';

class App extends React.Component {
    constructor(props) {
        super(props);

        History.listen((location, action) => {
            // clear alert on location change
            this.props.clearAlerts();
        });
    }

    render() {
        const { alert } = this.props;
        return (
            <MuiThemeProvider theme={theme}>
                <div style={{height: '100%'}}>
                    {alert.message &&
                    <div className={`alert ${alert.type}`}>{alert.message}</div>
                    }
                    <Switch>
                        {/*<Route path="/login" component={LoginPage} />
                        <Route path="/register" component={RegisterPage} />
                        <Route path="/form/:diagnosticProcedureID" component={FormTestPage} />
                        <Route path="/formSelector" component={FormSelectorPage} />
                        <Route path="/upload" component={UploadFormPage} />
                        <Route path="/query" component={FormQueryPage} />
                        <Route path="/" component={LoginPage} />*/}                        
                        <Route path="/test" component={TestPage} />
                        <Route path="/" component={QueryPage} />                        
                    </Switch>
                </div>
            </MuiThemeProvider>
        );
    }
}

function mapState(state) {
    const { alert } = state;
    return { alert };
}

const actionCreators = {
    clearAlerts: AlertActions.clear
};

const connectedApp = connect(mapState, actionCreators)(App);
export { connectedApp as App };