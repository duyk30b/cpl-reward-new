import React, { useContext, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from './AuthProvider'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()
  const location = useLocation()
  const auth = useContext(AuthContext)

  const locationState = location.state as { prevPath?: string }
  const prevPath = locationState?.prevPath || '/'

  const handleLogin = async () => {
    const response = await auth?.login(username, password)
    console.log('response', response)
    navigate(prevPath, { replace: true })
  }

  return (
    <div>
      <h2>Login</h2>
      <div>
        <input type="text" placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        <input type="text" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button type="button" onClick={handleLogin}>Login</button>
    </div>
  )
}

export default Login
