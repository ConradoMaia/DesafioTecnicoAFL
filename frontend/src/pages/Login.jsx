import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'

import axiosClient from '../api/axiosClient.js'
import { useAuth } from '../context/AuthContext.jsx'

function Login() {
  const navigate = useNavigate()
  const { login, token } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
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
      setIsSubmitting(true)
      const formData = new FormData(event.currentTarget)
      const payload = new URLSearchParams(formData)
      const { data } = await axiosClient.post('/users/login', payload)

      login(data.access_token)
      navigate('/')
    } catch (error) {
      const message = error.response?.data?.detail
      window.alert(
        typeof message === 'string'
          ? message
          : 'Nao foi possivel realizar o login.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (token) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="auth-shell">
      <main className="auth-card auth-card-compact">
        <h1 className="auth-title">Entrar</h1>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field">
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
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formValues.password}
              onChange={handleChange}
              required
            />
          </div>
          <label className="inline-check" htmlFor="show-password">
            <input
              id="show-password"
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword((currentValue) => !currentValue)}
            />
            <span>Mostrar senha</span>
          </label>
          <button className="button button-primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="auth-link-row">
          Nao tem conta? <Link to="/register">Registrar</Link>
        </p>
      </main>
    </div>
  )
}

export default Login
