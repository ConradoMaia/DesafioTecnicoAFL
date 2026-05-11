import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import axiosClient from '../api/axiosClient.js'

function Register() {
  const navigate = useNavigate()
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
      await axiosClient.post('/users/register', formValues)
      navigate('/login')
    } catch (error) {
      window.alert('Nao foi possivel criar a conta.')
    }
  }

  return (
    <main>
      <h1>Registro</h1>
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
        <button type="submit">Criar conta</button>
      </form>
      <p>
        Ja possui conta? <Link to="/login">Entrar</Link>
      </p>
    </main>
  )
}

export default Register
