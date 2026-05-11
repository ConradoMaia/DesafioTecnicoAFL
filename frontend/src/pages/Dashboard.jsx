import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import axiosClient from '../api/axiosClient.js'
import { useAuth } from '../context/AuthContext.jsx'

function sortTasks(taskList) {
  return [...taskList].sort((leftTask, rightTask) => {
    if (leftTask.is_urgent !== rightTask.is_urgent) {
      return Number(rightTask.is_urgent) - Number(leftTask.is_urgent)
    }

    if (leftTask.status !== rightTask.status) {
      return leftTask.status === 'pendente' ? -1 : 1
    }

    return new Date(rightTask.created_at) - new Date(leftTask.created_at)
  })
}

function Dashboard() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [busyTaskId, setBusyTaskId] = useState(null)
  const [isComposerOpen, setIsComposerOpen] = useState(false)
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    is_urgent: false,
  })

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await axiosClient.get('/tasks/')
        setTasks(sortTasks(data))
      } catch (error) {
        if (error.response?.status === 401) {
          logout()
          navigate('/login', { replace: true })
          window.alert('Sua sessao expirou. Faca login novamente.')
          return
        }

        const message = error.response?.data?.detail
        window.alert(
          typeof message === 'string'
            ? message
            : 'Nao foi possivel carregar as tarefas.',
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [logout, navigate])

  const handleChange = (event) => {
    const { checked, name, type, value } = event.target
    setNewTask((currentTask) => ({
      ...currentTask,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleCreateTask = async (event) => {
    event.preventDefault()

    try {
      setIsCreating(true)
      const { data } = await axiosClient.post('/tasks/', newTask)
      setTasks((currentTasks) => sortTasks([data, ...currentTasks]))
      setNewTask({
        title: '',
        description: '',
        is_urgent: false,
      })
      setIsComposerOpen(false)
    } catch (error) {
      if (error.response?.status === 401) {
        logout()
        navigate('/login', { replace: true })
        window.alert('Sua sessao expirou. Faca login novamente.')
        return
      }

      const message = error.response?.data?.detail
      window.alert(
        typeof message === 'string'
          ? message
          : 'Nao foi possivel criar a tarefa.',
      )
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteTask = async (taskId) => {
    try {
      setBusyTaskId(taskId)
      await axiosClient.delete(`/tasks/${taskId}`)
      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== taskId),
      )
    } catch (error) {
      if (error.response?.status === 401) {
        logout()
        navigate('/login', { replace: true })
        window.alert('Sua sessao expirou. Faca login novamente.')
        return
      }

      const message = error.response?.data?.detail
      window.alert(
        typeof message === 'string'
          ? message
          : 'Nao foi possivel remover a tarefa.',
      )
    } finally {
      setBusyTaskId(null)
    }
  }

  const handleToggleStatus = async (task) => {
    const nextStatus = task.status === 'concluida' ? 'pendente' : 'concluida'

    try {
      setBusyTaskId(task.id)
      const { data } = await axiosClient.put(`/tasks/${task.id}`, {
        status: nextStatus,
      })

      setTasks((currentTasks) =>
        sortTasks(
          currentTasks.map((currentTask) =>
            currentTask.id === task.id ? data : currentTask,
          ),
        ),
      )
    } catch (error) {
      if (error.response?.status === 401) {
        logout()
        navigate('/login', { replace: true })
        window.alert('Sua sessao expirou. Faca login novamente.')
        return
      }

      const message = error.response?.data?.detail
      window.alert(
        typeof message === 'string'
          ? message
          : 'Nao foi possivel atualizar o status da tarefa.',
      )
    } finally {
      setBusyTaskId(null)
    }
  }

  const handleToggleUrgent = async (task) => {
    try {
      setBusyTaskId(task.id)
      const { data } = await axiosClient.put(`/tasks/${task.id}`, {
        is_urgent: !task.is_urgent,
      })

      setTasks((currentTasks) =>
        sortTasks(
          currentTasks.map((currentTask) =>
            currentTask.id === task.id ? data : currentTask,
          ),
        ),
      )
    } catch (error) {
      if (error.response?.status === 401) {
        logout()
        navigate('/login', { replace: true })
        window.alert('Sua sessao expirou. Faca login novamente.')
        return
      }

      const message = error.response?.data?.detail
      window.alert(
        typeof message === 'string'
          ? message
          : 'Nao foi possivel atualizar a prioridade da tarefa.',
      )
    } finally {
      setBusyTaskId(null)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const urgentTasks = tasks.filter((task) => task.is_urgent)
  const regularTasks = tasks.filter((task) => !task.is_urgent)

  return (
    <div className="dashboard-shell">
      <header className="dashboard-bar">
        <h1 className="page-title">Tarefas</h1>
        <button className="quiet-button" type="button" onClick={handleLogout}>
          Sair
        </button>
      </header>

      <section className="todo-surface">
        {isLoading ? (
          <div className="empty-state">
            <p>Carregando tarefas...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <p>Voce ainda nao tem tarefas.</p>
          </div>
        ) : (
          <>
            {urgentTasks.length > 0 && (
              <section className="task-group">
                <h2 className="group-title">Urgentes</h2>
                <ul className="task-list">
                  {urgentTasks.map((task) => (
                    <li
                      key={task.id}
                      className={`task-row ${
                        task.status === 'concluida' ? 'is-complete' : ''
                      }`}
                    >
                      <label className="task-check" htmlFor={`task-${task.id}`}>
                        <input
                          id={`task-${task.id}`}
                          type="checkbox"
                          checked={task.status === 'concluida'}
                          onChange={() => handleToggleStatus(task)}
                          disabled={busyTaskId === task.id}
                        />
                        <span />
                      </label>
                      <div className="task-content">
                        <div className="task-topline">
                          <h3 className="task-title">{task.title}</h3>
                          <button
                            className="tag-button tag-button-active"
                            type="button"
                            onClick={() => handleToggleUrgent(task)}
                            disabled={busyTaskId === task.id}
                          >
                            Urgente
                          </button>
                        </div>
                        <p className="task-description">{task.description}</p>
                      </div>
                      <button
                        className="icon-button"
                        type="button"
                        onClick={() => handleDeleteTask(task.id)}
                        disabled={busyTaskId === task.id}
                        aria-label="Excluir tarefa"
                      >
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M9 3h6l1 2h4v2H4V5h4l1-2Zm-2 6h2v9H7V9Zm4 0h2v9h-2V9Zm4 0h2v9h-2V9ZM6 21a2 2 0 0 1-2-2V7h16v12a2 2 0 0 1-2 2H6Z" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {regularTasks.length > 0 && (
              <section className="task-group">
                <h2 className="group-title">Tarefas</h2>
                <ul className="task-list">
                  {regularTasks.map((task) => (
                    <li
                      key={task.id}
                      className={`task-row ${
                        task.status === 'concluida' ? 'is-complete' : ''
                      }`}
                    >
                      <label className="task-check" htmlFor={`task-${task.id}`}>
                        <input
                          id={`task-${task.id}`}
                          type="checkbox"
                          checked={task.status === 'concluida'}
                          onChange={() => handleToggleStatus(task)}
                          disabled={busyTaskId === task.id}
                        />
                        <span />
                      </label>
                      <div className="task-content">
                        <div className="task-topline">
                          <h3 className="task-title">{task.title}</h3>
                          <button
                            className="tag-button"
                            type="button"
                            onClick={() => handleToggleUrgent(task)}
                            disabled={busyTaskId === task.id}
                          >
                            Marcar urgente
                          </button>
                        </div>
                        <p className="task-description">{task.description}</p>
                      </div>
                      <button
                        className="icon-button"
                        type="button"
                        onClick={() => handleDeleteTask(task.id)}
                        disabled={busyTaskId === task.id}
                        aria-label="Excluir tarefa"
                      >
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M9 3h6l1 2h4v2H4V5h4l1-2Zm-2 6h2v9H7V9Zm4 0h2v9h-2V9Zm4 0h2v9h-2V9ZM6 21a2 2 0 0 1-2-2V7h16v12a2 2 0 0 1-2 2H6Z" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}
      </section>

      <button
        className="fab-button"
        type="button"
        onClick={() => setIsComposerOpen(true)}
        aria-label="Adicionar tarefa"
      >
        +
      </button>

      {isComposerOpen && (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={() => setIsComposerOpen(false)}
        >
          <div
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-task-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <h2 id="new-task-title" className="group-title">
                Nova tarefa
              </h2>
              <button
                className="quiet-button"
                type="button"
                onClick={() => setIsComposerOpen(false)}
              >
                Fechar
              </button>
            </div>

            <form className="auth-form" onSubmit={handleCreateTask}>
              <div className="field">
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
              <div className="field">
                <label htmlFor="description">Descricao</label>
                <textarea
                  id="description"
                  name="description"
                  value={newTask.description}
                  onChange={handleChange}
                  required
                />
              </div>
              <label className="inline-check" htmlFor="is_urgent">
                <input
                  id="is_urgent"
                  name="is_urgent"
                  type="checkbox"
                  checked={newTask.is_urgent}
                  onChange={handleChange}
                />
                <span>Marcar como urgente</span>
              </label>
              <button
                className="button button-primary"
                type="submit"
                disabled={isCreating}
              >
                {isCreating ? 'Salvando...' : 'Salvar tarefa'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
