import { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import { motion, AnimatePresence } from 'framer-motion'

const Container = styled.div`
  background: ${props => props.theme === 'dark'
    ? 'rgba(255, 255, 255, 0.10)'
    : 'rgba(255, 255, 255, 0.65)'};
  backdrop-filter: blur(14px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 32px 0 ${props => props.theme === 'dark'
    ? 'rgba(31, 38, 135, 0.37)'
    : 'rgba(180, 180, 200, 0.18)'};
  border: 1px solid ${props => props.theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(180,180,200,0.18)'};
  max-width: 100vw;
  @media (max-width: 900px) {
    padding: 1.2rem 0.5rem;
  }
  @media (max-width: 600px) {
    padding: 0.7rem 0.1rem;
    border-radius: 12px;
  }
`

const InputContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  align-items: flex-end;
  @media (max-width: 900px) {
    gap: 0.5rem;
  }
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0.7rem;
    margin-bottom: 1.2rem;
  }
`

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 150px;
  @media (max-width: 600px) {
    min-width: 100%;
  }
`

const Label = styled.label`
  font-size: 0.9rem;
  color: ${props => props.theme === 'dark' ? 'rgba(255,255,255,0.7)' : '#222'};
  margin-bottom: 0.1rem;
  font-weight: 500;
  @media (max-width: 600px) {
    font-size: 0.85rem;
  }
`

const Input = styled.input`
  flex: 1;
  min-width: 200px;
  padding: 1rem;
  border: none;
  border-radius: 10px;
  background: ${props => props.theme === 'dark'
    ? 'rgba(255, 255, 255, 0.13)'
    : 'rgba(240, 240, 255, 0.7)'};
  color: ${props => props.theme === 'dark' ? '#fff' : '#1a1a2e'};
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
  box-shadow: 0 1px 4px 0 rgba(0,0,0,0.03);
  @media (max-width: 900px) {
    min-width: 120px;
    padding: 0.7rem;
    font-size: 0.97rem;
  }
  @media (max-width: 600px) {
    min-width: 100%;
    font-size: 0.95rem;
    padding: 0.6rem;
  }
`

const TimeInput = styled(Input)`
  min-width: 150px;
  @media (max-width: 900px) {
    min-width: 100px;
  }
  @media (max-width: 600px) {
    min-width: 100%;
  }
`

const PrioritySelect = styled.select`
  padding: 1rem;
  border: none;
  border-radius: 10px;
  background: ${props => props.theme === 'dark'
    ? 'rgba(255, 255, 255, 0.13)'
    : 'rgba(240, 240, 255, 0.7)'};
  color: ${props => props.theme === 'dark' ? '#fff' : '#1a1a2e'};
  font-size: 1rem;
  outline: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 1px 4px 0 rgba(0,0,0,0.03);
  appearance: none;
  position: relative;
  z-index: 2;
  @media (max-width: 900px) {
    padding: 0.7rem;
    font-size: 0.97rem;
  }
  @media (max-width: 600px) {
    font-size: 0.95rem;
    padding: 0.6rem;
    min-width: 100%;
  }
`

const AddButton = styled(motion.button)`
  padding: 1rem 2rem;
  border: none;
  border-radius: 10px;
  background: ${props => props.theme === 'dark'
    ? 'linear-gradient(45deg, #00f2fe, #4facfe)'
    : 'linear-gradient(45deg, #4facfe, #00f2fe)'};
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.07);
  @media (max-width: 900px) {
    padding: 0.7rem 1.2rem;
    font-size: 0.97rem;
  }
  @media (max-width: 600px) {
    width: 100%;
    font-size: 0.95rem;
    padding: 0.7rem 0.5rem;
  }
`

const TodoItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: ${props => props.theme === 'dark'
    ? 'rgba(255, 255, 255, 0.07)'
    : 'rgba(255, 255, 255, 0.85)'};
  border-radius: 10px;
  margin-bottom: 0.5rem;
  border-left: 4px solid ${props => {
    switch (props.priority) {
      case 'very-important': return '#ff6b6b'
      case 'important': return '#ffd93d'
      case 'normal': return '#4facfe'
      case 'less-important': return '#6c5ce7'
      default: return '#4facfe'
    }
  }};
  box-shadow: 0 1px 4px 0 rgba(0,0,0,0.04);
  position: relative;
  @media (max-width: 900px) {
    padding: 0.7rem;
    gap: 0.5rem;
  }
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.3rem;
    padding: 0.6rem;
    border-radius: 7px;
  }
`

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
`

const TodoText = styled.span`
  flex: 1;
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
  opacity: ${props => props.completed ? 0.5 : 1};
`

const PriorityBadge = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 5px;
  font-size: 0.8rem;
  background: ${props => {
    switch (props.priority) {
      case 'very-important': return 'rgba(255, 107, 107, 0.2)'
      case 'important': return 'rgba(255, 217, 61, 0.2)'
      case 'normal': return 'rgba(79, 172, 254, 0.2)'
      case 'less-important': return 'rgba(108, 92, 231, 0.2)'
      default: return 'rgba(79, 172, 254, 0.2)'
    }
  }};
  color: ${props => {
    switch (props.priority) {
      case 'very-important': return '#ff6b6b'
      case 'important': return '#ffd93d'
      case 'normal': return '#4facfe'
      case 'less-important': return '#6c5ce7'
      default: return '#4facfe'
    }
  }};
`

const PendingBadge = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 5px;
  font-size: 0.8rem;
  background: #ffd93d33;
  color: #b8860b;
  margin-left: 0.5rem;
`

const TimeRemaining = styled.span`
  font-size: 0.8rem;
  color: ${props => {
    if (props.isOverdue) return '#ff6b6b'
    if (props.isUrgent) return '#ffd93d'
    return props.theme === 'dark' ? '#fff' : '#1a1a2e'
  }};
  opacity: 0.8;
`

const DeleteButton = styled(motion.button)`
  background: none;
  border: none;
  color: #ff6b6b;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0.5rem;
  opacity: 0.7;
  transition: all 0.3s ease;
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  &:hover {
    opacity: 1;
    transform: scale(1.1);
  }
`

const EditButton = styled(motion.button)`
  background: #4facfe;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.3rem 0.8rem;
  font-size: 0.9rem;
  font-weight: 500;
  margin-left: 0.5rem;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #00f2fe;
    color: #222;
  }
`

const SaveButton = styled(EditButton)`
  background: #27ae60;
  &:hover { background: #2ecc71; color: #fff; }
`
const CancelButton = styled(EditButton)`
  background: #888;
  &:hover { background: #aaa; color: #fff; }
`

const EditRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.3rem;
  }
`

const formatTimeRemaining = (endTime) => {
  const now = new Date()
  const end = new Date(endTime)
  const diff = end - now

  if (diff <= 0) return { text: 'Overdue', isOverdue: true, isUrgent: false }

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (hours > 0) {
    return {
      text: `${hours}h ${minutes}m remaining`,
      isOverdue: false,
      isUrgent: hours < 1
    }
  }
  return {
    text: `${minutes}m remaining`,
    isOverdue: false,
    isUrgent: minutes < 30
  }
}

const TodoList = ({ todos, addTodo, toggleTodo, deleteTodo, theme, isPending, onEdit }) => {
  const [newTodo, setNewTodo] = useState('')
  const [priority, setPriority] = useState('normal')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [timeRemaining, setTimeRemaining] = useState({})
  const [editId, setEditId] = useState(null)
  const [editValues, setEditValues] = useState({})

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeRemaining = {}
      todos.forEach(todo => {
        newTimeRemaining[todo.id] = formatTimeRemaining(todo.endTime)
      })
      setTimeRemaining(newTimeRemaining)
    }, 1000)

    return () => clearInterval(timer)
  }, [todos])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newTodo.trim() && startTime && endTime) {
      addTodo(newTodo.trim(), priority, startTime, endTime)
      setNewTodo('')
      setPriority('normal')
      setStartTime('')
      setEndTime('')
    }
  }

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'very-important': return 'Very Important'
      case 'important': return 'Important'
      case 'normal': return 'Normal'
      case 'less-important': return 'Less Important'
      default: return 'Normal'
    }
  }

  const startEdit = (todo) => {
    setEditId(todo.id)
    setEditValues({
      text: todo.text,
      startTime: todo.startTime,
      endTime: todo.endTime,
      priority: todo.priority
    })
  }

  const handleEditChange = (e) => {
    setEditValues({ ...editValues, [e.target.name]: e.target.value })
  }

  const saveEdit = (id) => {
    if (onEdit && editValues.text.trim() && editValues.startTime && editValues.endTime) {
      onEdit(id, {
        text: editValues.text.trim(),
        startTime: editValues.startTime,
        endTime: editValues.endTime,
        priority: editValues.priority
      })
      setEditId(null)
      setEditValues({})
    }
  }

  const cancelEdit = () => {
    setEditId(null)
    setEditValues({})
  }

  return (
    <Container theme={theme}>
      {addTodo && (
        <form onSubmit={handleSubmit}>
          <InputContainer>
            <InputGroup>
              <Label theme={theme} htmlFor="task-input">Task</Label>
              <Input
                id="task-input"
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Add a new task..."
                theme={theme}
              />
            </InputGroup>
            <InputGroup>
              <Label theme={theme} htmlFor="start-time">Start Time</Label>
              <TimeInput
                id="start-time"
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                theme={theme}
              />
            </InputGroup>
            <InputGroup>
              <Label theme={theme} htmlFor="end-time">End Time</Label>
              <TimeInput
                id="end-time"
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                theme={theme}
              />
            </InputGroup>
            <InputGroup>
              <Label theme={theme} htmlFor="priority">Priority</Label>
              <PrioritySelect
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                theme={theme}
              >
                <option value="very-important">Very Important</option>
                <option value="important">Important</option>
                <option value="normal">Normal</option>
                <option value="less-important">Less Important</option>
              </PrioritySelect>
            </InputGroup>
            <AddButton
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              theme={theme}
            >
              Add Task
            </AddButton>
          </InputContainer>
        </form>
      )}

      <AnimatePresence>
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            theme={theme}
            priority={todo.priority}
          >
            {editId === todo.id ? (
              <EditRow>
                <Input
                  name="text"
                  value={editValues.text}
                  onChange={handleEditChange}
                  theme={theme}
                />
                <TimeInput
                  name="startTime"
                  type="datetime-local"
                  value={editValues.startTime}
                  onChange={handleEditChange}
                  theme={theme}
                />
                <TimeInput
                  name="endTime"
                  type="datetime-local"
                  value={editValues.endTime}
                  onChange={handleEditChange}
                  theme={theme}
                />
                <PrioritySelect
                  name="priority"
                  value={editValues.priority}
                  onChange={handleEditChange}
                  theme={theme}
                >
                  <option value="very-important">Very Important</option>
                  <option value="important">Important</option>
                  <option value="normal">Normal</option>
                  <option value="less-important">Less Important</option>
                </PrioritySelect>
                <SaveButton onClick={() => saveEdit(todo.id)} whileTap={{ scale: 0.95 }}>Save</SaveButton>
                <CancelButton onClick={cancelEdit} whileTap={{ scale: 0.95 }}>Cancel</CancelButton>
              </EditRow>
            ) : (
              <>
                {!isPending && (
                  <Checkbox
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                  />
                )}
                <TodoText completed={todo.completed}>{todo.text}</TodoText>
                <TimeRemaining
                  theme={theme}
                  isOverdue={timeRemaining[todo.id]?.isOverdue}
                  isUrgent={timeRemaining[todo.id]?.isUrgent}
                >
                  {timeRemaining[todo.id]?.text}
                </TimeRemaining>
                <PriorityBadge priority={todo.priority}>
                  {getPriorityLabel(todo.priority)}
                </PriorityBadge>
                {isPending && <PendingBadge>Pending</PendingBadge>}
                <EditButton
                  onClick={() => startEdit(todo)}
                  whileTap={{ scale: 0.95 }}
                  title="Edit"
                >
                  Edit
                </EditButton>
                <DeleteButton
                  onClick={() => deleteTodo(todo.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Delete"
                >
                  ×
                </DeleteButton>
              </>
            )}
          </TodoItem>
        ))}
      </AnimatePresence>
    </Container>
  )
}

export default TodoList 