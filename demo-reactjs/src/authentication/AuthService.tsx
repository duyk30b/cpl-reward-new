import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

type UserType = { username: string } | null

type AuthContextType = {
	user: UserType;
	accessToken: string;
} | null

export const AuthContext = createContext<AuthContextType>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<UserType>(null)
	const value = useMemo(() => ({ user, setUser }), [user, setUser])
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function AuthGuard({ children }: { children: JSX.Element }) {
	const auth = useContext(AuthContext)
	const location = useLocation()

	if (!auth?.user) {
		return <Navigate to="/login" state={{ prevPath: location.pathname }} replace />
	}
	return children
}
