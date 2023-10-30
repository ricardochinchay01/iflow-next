import { createContext, useContext } from 'react'

const PermissionsContext = createContext()

export const usePermissions = () => {
    const context = useContext(PermissionsContext)
    if (!context) {
        throw new Error(
            'usePermissions must be used within a PermissionsProvider',
        )
    }
    return context
}

export const PermissionsProvider = ({ children, value }) => {
    return (
        <PermissionsContext.Provider value={value}>
            {children}
        </PermissionsContext.Provider>
    )
}
