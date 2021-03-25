import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import logo from "./img/ebarIcon.png";

import AuthService from "./services/auth.service";

import BarList from "./components/bar-list.component";
import Login from "./components/login.component";
import Profile from "./components/profile.component";
import Votings from "./components/votings-list.component";
import PrivateRoute from "./components/private-route.js";

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      currentUser: undefined
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();
    if (user) {
      this.setState({
        currentUser: user
      });
    }
  }

  logOut() {
    AuthService.logout();
  }
  


  render() {
    console.log('User', this.state.currentUser) 
    const style = {
      height: '40px',
    }
    const { currentUser } = this.state;

    return (
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <Link to={"/"} className="navbar-brand">
            <img src={logo} alt="Logo E-Bar" style={style} />
          </Link>
          <div className="navbar-nav mr-auto">
            <li className="nav-item active">
              <Link to={"/bares"} className="nav-link">
                Bares
              </Link>
            </li>
            <li className="nav-item active">
              <Link to={"/votations"} className="nav-link">
                Votaciones
              </Link>
            </li>
          </div>
          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link">
                  {currentUser.username}
                </Link>
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={this.logOut}>
                  Salir
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Iniciar sesión
                </Link>
              </li>
            </div>
          )}
        </nav>

        <div className="container mt-3">
          <Switch>
            <Route exact path={"/bares"} component={BarList} />
            <Route exact path={"/login"} component={Login} />
            <Route exact path={"/profile"} component={Profile} />
            <PrivateRoute path={"/votations"} component={Votings} />
            </Switch>
        </div>
      </div>
    );
  }
}

export default App;