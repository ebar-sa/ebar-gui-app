import React, { useState } from 'react'

const Context = React.createContext({})

export function UserContextProvider ({children}) {
    const [auth, setAuth] = useState(() => JSON.parse(window.sessionStorage.getItem('user')))
    
    return <Context.Provider value={{auth, setAuth}}>
        {children}
    </Context.Provider>
}

export default Context