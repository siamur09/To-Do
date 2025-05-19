import { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import TodoList from './components/TodoList'
import CompletedTasks from './components/CompletedTasks'
import Background3D from './components/Background3D'
import './App.css'

const STORAGE_KEY = 'taskflow-all-tasks'
const TASK_LIFETIME = 3 * 24 * 60 * 60 * 1000 // 3 days in ms

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${props => props.theme === 'dark' 
    ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
    : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'};
  color: ${props => props.theme === 'dark' ? '#fff' : '#1a1a2e'};
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  padding: 0 0.5rem;

  @media (max-width: 900px) {
    padding: 0 0.2rem;
  }
`

const Header = styled(motion.header)`
  padding: 2rem 0 1.5rem 0;
  text-align: center;
  z-index: 1;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 800px;
  margin: 0 auto;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 1rem;
    padding: 1.2rem 0 1rem 0;
  }
`

const Title = styled(motion.h1)`
  font-size: 3rem;
  margin: 0;
  background: ${props => props.theme === 'dark'
    ? 'linear-gradient(45deg, #00f2fe, #4facfe)'
    : 'linear-gradient(45deg, #16213e, #1a1a2e)'};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
  @media (max-width: 600px) {
    font-size: 2.1rem;
  }
`

const ThemeToggle = styled(motion.button)`
  background: ${props => props.theme === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(26, 26, 46, 0.1)'};
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${props => props.theme === 'dark' ? '#fff' : '#1a1a2e'};
  font-size: 1.2rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
  @media (max-width: 600px) {
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }
`

const MainContent = styled(motion.main)`
  width: 100%;
  max-width: 800px;
  padding: 2rem;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin: 0 auto;

  @media (max-width: 900px) {
    max-width: 98vw;
    padding: 1.2rem 0.2rem;
  }
  @media (max-width: 600px) {
    padding: 0.5rem 0.1rem;
    gap: 1.2rem;
  }
`

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin: 0 0 0.5rem 0;
  color: ${props => props.theme === 'dark' ? '#fff' : '#1a1a2e'};
  opacity: 0.8;
  @media (max-width: 600px) {
    font-size: 1.1rem;
    margin-bottom: 0.2rem;
  }
`

const DeleteAllButton = styled(motion.button)`
  background: #ff6b6b;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  cursor: pointer;
  margin-left: auto;
  display: block;
  transition: background 0.2s;
  &:hover {
    background: #e74c3c;
  }
  @media (max-width: 600px) {
    font-size: 0.9rem;
    padding: 0.4rem 0.8rem;
  }
`

function loadFromStorage(key, fallback = []) {
  try {
    const data = localStorage.getItem(key)
    if (!data) return fallback
    return JSON.parse(data)
  } catch {
    return fallback
  }
}

function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function filterOldTasks(tasks) {
  const now = Date.now()
  return tasks.filter(task => {
    const baseTime = task.completedAt ? new Date(task.completedAt).getTime() : new Date(task.createdAt).getTime()
    return now - baseTime < TASK_LIFETIME
  })
}

function App() {
  const [allTasks, setAllTasks] = useState([])
  const [initialized, setInitialized] = useState(false)
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    const loadedTasks = filterOldTasks(loadFromStorage(STORAGE_KEY))
    setAllTasks(loadedTasks)
    setInitialized(true)
  }, [])

  useEffect(() => {
    if (initialized) {
      saveToStorage(STORAGE_KEY, allTasks)
    }
  }, [allTasks, initialized])

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      setAllTasks(prev => prev.map(task => {
        if (
          task.status === 'active' &&
          new Date(task.endTime).getTime() < now &&
          !task.completed
        ) {
          return {
            ...task,
            status: 'completed',
            completed: false,
            completedAt: new Date().toISOString(),
            isOnTime: false,
            wasAutoCompleted: true
          }
        }
        return task
      }))
    }, 1000 * 30)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setAllTasks(prev => filterOldTasks(prev))
    }, 1000 * 60 * 10)
    return () => clearInterval(interval)
  }, [])

  const addTodo = (text, priority, startTime, endTime) => {
    const now = Date.now()
    const newTask = {
      id: Date.now(),
      text,
      completed: false,
      status: 'active',
      priority,
      startTime,
      endTime,
      createdAt: new Date().toISOString(),
      completedAt: null
    }
    setAllTasks(prev => [...prev, newTask])
  }

  const toggleTodo = (id) => {
    setAllTasks(prev => prev.map(task => {
      if (task.id === id && task.status === 'active') {
        const now = new Date()
        const endTime = new Date(task.endTime)
        const isOnTime = now <= endTime
        return {
          ...task,
          status: 'completed',
          completed: true,
          completedAt: now.toISOString(),
          isOnTime,
          wasAutoCompleted: false
        }
      }
      return task
    }))
  }

  const deleteTodo = (id) => {
    setAllTasks(prev => prev.filter(task => task.id !== id))
  }

  const deleteAllCompleted = () => {
    setAllTasks(prev => prev.filter(task => task.status !== 'completed'))
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const onEdit = (id, updates) => {
    setAllTasks(prev => prev.map(task => {
      if (task.id === id) {
        return {
          ...task,
          ...updates
        }
      }
      return task
    }))
  }

  const activeTasks = allTasks.filter(task => task.status === 'active')
  const completedTasks = allTasks.filter(task => task.status === 'completed')

  return (
    <AppContainer theme={theme}>
      <Background3D theme={theme} />
      <Header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Title theme={theme}>TaskFlow</Title>
        <ThemeToggle
          theme={theme}
          onClick={toggleTheme}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </ThemeToggle>
      </Header>
      <MainContent
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div>
          <SectionTitle theme={theme}>Active Tasks</SectionTitle>
          <TodoList
            todos={activeTasks}
            addTodo={addTodo}
            toggleTodo={toggleTodo}
            deleteTodo={deleteTodo}
            theme={theme}
            onEdit={onEdit}
          />
        </div>
        <div>
          <SectionTitle theme={theme}>Completed Tasks</SectionTitle>
          <DeleteAllButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={deleteAllCompleted}
          >
            Delete All
          </DeleteAllButton>
          <CompletedTasks
            completedTodos={completedTasks}
            theme={theme}
            deleteCompleted={deleteTodo}
          />
        </div>
      </MainContent>
    </AppContainer>
  )
}

export default App
