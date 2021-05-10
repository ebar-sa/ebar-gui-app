import React, { useState } from 'react'

const Context = React.createContext({})

export function UserContextProvider ({children}) {
    const [auth, setAuth] = useState(() => JSON.parse(window.localStorage.getItem('user')))
    const [currentBar, setCurrentBar] = useState(undefined);
    
    return <Context.Provider value={{auth, setAuth, currentBar, setCurrentBar}}>
        {children}
    </Context.Provider>
}

export default Context