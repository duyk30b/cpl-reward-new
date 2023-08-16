import React, { createContext, ReactNode, useMemo, useState } from 'react'

type UserType = { username: string } | null

type RegisterType = (username: string, password: string) => Promise<{
	accessToken: string,
	expiredToken: number,
}>
type LoginType = (username: string, password: string) => Promise<{
	accessToken: string,
	expiredToken: number,
}>
type LogoutType = () => Promise<void>

type AuthContextType = {
	user: UserType;
	register: RegisterType
	login: LoginType
	logout: LogoutType
} | null

export const AuthContext = createContext<AuthContextType>(null)

function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<UserType>(null)

	const register: RegisterType = async (username, password) => {
		setUser({ username })
		return {
			accessToken: '123456789',
			expiredToken: new Date().getTime() + 60 * 60 * 1000,
			user: { username },
		}
	}

	const login: LoginType = async (username, password) => {
		setUser({ username })
		return {
			accessToken: '123456789',
			expiredToken: new Date().getTime() + 60 * 60 * 1000,
			user: { username },
		}
	}

	const logout: LogoutType = async () => {
		setUser(null)
	}

	const value = useMemo(() => ({ user, login, register, logout }), [user])

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
