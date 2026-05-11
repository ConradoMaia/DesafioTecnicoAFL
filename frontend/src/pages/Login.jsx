import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'

import axiosClient from '../api/axiosClient.js'
import { useAuth } from '../context/AuthContext.jsx'

function Login() {
  const navigate = useNavigate()
  const { login, token } = useAuth()
  const [formValues, setFormValues] = useState({
    username: '',
    password: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const formData = new FormData(event.currentTarget)
      const payload = new URLSearchParams(formData)
      const { data } = await axiosClient.post('/users/login', payload)

      login(data.access_token)
      navigate('/')
    } catch (error) {
      window.alert('Nao foi possivel realizar o login.')
    }
  }

  if (token) {
    return <Navigate to="/" replace />
  }

  return (
    <main>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            value={formValues.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formValues.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Entrar</button>
      </form>
      <p>
        Nao tem conta? <Link to="/register">Criar conta</Link>
      </p>
    </main>
  )
}

export default Login
