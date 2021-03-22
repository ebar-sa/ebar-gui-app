import React from "react";
import { Switch, Route } from "react-router-dom";
import { UserContextProvider } from "./context/UserContext";

import { SnackbarProvider } from "notistack";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import BarList from "./pages/BarList";

import Header from "./components/Header";



export function App() {
    return <UserContextProvider>
        <SnackbarProvider>
            <Header />
            <Switch>
                <Route exact path={"/"} component={Home} />
                <Route exact path={"/bares"} component={BarList}/>
                <Route exact path={"/login"} component={Login}/>
                <Route exact path={"/profile"} component={Profile}/>
            </Switch>
        </SnackbarProvider>
    </UserContextProvider>  
}

export default App;
