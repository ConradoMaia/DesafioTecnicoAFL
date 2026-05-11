import { useEffect, useState } from 'react'

import axiosClient from '../api/axiosClient.js'
import { useAuth } from '../context/AuthContext.jsx'

function Dashboard() {
  const { logout } = useAuth()
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
  })

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await axiosClient.get('/tasks/')
        setTasks(data)
      } catch (error) {
        window.alert('Nao foi possivel carregar as tarefas.')
      }
    }

    fetchTasks()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setNewTask((currentTask) => ({
      ...currentTask,
      [name]: value,
    }))
  }

  const handleCreateTask = async (event) => {
    event.preventDefault()

    try {
      const { data } = await axiosClient.post('/tasks/', newTask)
      setTasks((currentTasks) => [...currentTasks, data])
      setNewTask({
        title: '',
        description: '',
      })
    } catch (error) {
      window.alert('Nao foi possivel criar a tarefa.')
    }
  }

  const handleDeleteTask = async (taskId) => {
    try {
      await axiosClient.delete(`/tasks/${taskId}`)
      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== taskId),
      )
    } catch (error) {
      window.alert('Nao foi possivel remover a tarefa.')
    }
  }

  const handleToggleStatus = async (task) => {
    const nextStatus = task.status === 'concluida' ? 'pendente' : 'concluida'

    try {
      const { data } = await axiosClient.put(`/tasks/${task.id}`, {
        status: nextStatus,
      })

      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask.id === task.id ? data : currentTask,
        ),
      )
    } catch (error) {
      window.alert('Nao foi possivel atualizar o status da tarefa.')
    }
  }

  return (
    <main>
      <header>
        <h1>Dashboard</h1>
        <button type="button" onClick={logout}>
          Sair
        </button>
      </header>

      <section>
        <h2>Nova tarefa</h2>
        <form onSubmit={handleCreateTask}>
          <div>
            <label htmlFor="title">Titulo</label>
            <input
              id="title"
              name="title"
              type="text"
              value={newTask.title}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="description">Descricao</label>
            <textarea
              id="description"
              name="description"
              value={newTask.description}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Criar tarefa</button>
        </form>
      </section>

      <section>
        <h2>Minhas tarefas</h2>
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>Status: {task.status}</p>
              <button type="button" onClick={() => handleToggleStatus(task)}>
                Alternar status
              </button>
              <button type="button" onClick={() => handleDeleteTask(task.id)}>
                Excluir
              </button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

export default Dashboard
