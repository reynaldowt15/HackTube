import { getItem } from "expo-secure-store";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null)

export default function AuthContextProvider({ children }) {
    const [isSignIn, setIsSignIn] = useState(false)


    useEffect(() => {
        const token = getItem('token')
        if (token) {
            setIsSignIn(true)
        }
    }, [])

    return (
        <AuthContext value={{ isSignIn, setIsSignIn }}>
            {children}
        </AuthContext>
    )
}