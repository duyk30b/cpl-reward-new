import React, { useContext } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { AuthContext } from './AuthProvider'

function AuthGuard({ children }: { children: JSX.Element }) {
	const auth = useContext(AuthContext)
	const location = useLocation()

	if (!auth?.user) {
		return <Navigate to="/login" state={{ prevPath: location.pathname }} replace />
	}
	return children
}

export default AuthGuard
