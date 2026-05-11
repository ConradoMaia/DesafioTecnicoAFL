import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'

import axiosClient from '../api/axiosClient.js'
import { useAuth } from '../context/AuthContext.jsx'

function Register() {
  const navigate = useNavigate()
  const { token } = useAuth()
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
      await axiosClient.post('/users/register', formValues)
      navigate('/login')
    } catch (error) {
      const message = error.response?.data?.detail
      window.alert(
        typeof message === 'string'
          ? message
          : 'Nao foi possivel criar a conta.',
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
        <h1 className="auth-title">Registrar</h1>

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
          <label className="inline-check" htmlFor="show-register-password">
            <input
              id="show-register-password"
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword((currentValue) => !currentValue)}
            />
            <span>Mostrar senha</span>
          </label>
          <button className="button button-primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Criando...' : 'Criar conta'}
          </button>
        </form>

        <p className="auth-link-row">
          Ja possui conta? <Link to="/login">Entrar</Link>
        </p>
      </main>
    </div>
  )
}

export default Register
