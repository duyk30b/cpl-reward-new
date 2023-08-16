import React from 'react'
import { createRoot } from 'react-dom/client'
import './assets/reset.css'
import App from './app/App'
// import { store } from './app/store.js';

import Env from '../config'

console.log(Env)

const container = document.getElementById('root')

const root = createRoot(container as Element)

root.render(<App />)
