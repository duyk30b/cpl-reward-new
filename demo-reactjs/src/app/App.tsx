/* eslint-disable react/jsx-one-expression-per-line */
import React, { Suspense, useState } from 'react'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import AuthGuard from '../authentication/AuthGuard'
import AuthProvider from '../authentication/AuthProvider'

const Login = React.lazy(() => import('../authentication/Login'))
const Register = React.lazy(() => import('../authentication/Register'))

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Link to="/">Home</Link> - {' '}
        <Link to="/login">Login</Link> - {' '}
        <Link to="/register">Register</Link> - {' '}
        <Link to="/dashboard">Dashboard</Link> - {' '}
        <hr />
        <Suspense fallback={<>...</>}>
          <Routes>
            <Route path="/" element={<h3>This is home page</h3>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<AuthGuard><h1>Dash board Pag---------------e</h1></AuthGuard>} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
