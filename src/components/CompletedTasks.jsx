import styled from '@emotion/styled'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

const Container = styled.div`
  background: ${props => props.theme === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(26, 26, 46, 0.1)'};
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 32px 0 ${props => props.theme === 'dark'
    ? 'rgba(31, 38, 135, 0.37)'
    : 'rgba(31, 38, 135, 0.15)'};
`

const CompletedItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: ${props => props.theme === 'dark'
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(26, 26, 46, 0.05)'};
  border-radius: 10px;
  margin-bottom: 0.5rem;
  border-left: 4px solid ${props => props.isOnTime ? '#4CAF50' : '#ff6b6b'};
  position: relative;
`

const TaskText = styled.span`
  flex: 1;
  text-decoration: line-through;
  opacity: 0.7;
`

const TimeInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
  font-size: 0.8rem;
  opacity: 0.7;
`

const StatusBadge = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 5px;
  font-size: 0.8rem;
  background: ${props => props.isOnTime
    ? 'rgba(76, 175, 80, 0.2)'
    : 'rgba(255, 107, 107, 0.2)'};
  color: ${props => props.isOnTime ? '#4CAF50' : '#ff6b6b'};
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

const InfoButton = styled(motion.button)`
  background: #888;
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
    background: #aaa;
    color: #222;
  }
`

const InfoBox = styled.div`
  background: #23243aee;
  color: #fff;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.95rem;
  margin-top: 0.5rem;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.13);
  position: absolute;
  right: 1.5rem;
  top: 2.2rem;
  z-index: 10;
  @media (max-width: 600px) {
    right: 0.5rem;
    left: 0.5rem;
    width: auto;
    font-size: 0.9rem;
  }
`

const formatDate = (date) => {
  return new Date(date).toLocaleString()
}

const formatTimeRemaining = (endTime) => {
  const now = new Date()
  const end = new Date(endTime)
  const diff = end - now

  if (diff <= 0) return 'Overdue'

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (hours > 0) {
    return `${hours}h ${minutes}m remaining`
  }
  return `${minutes}m remaining`
}

function timeAgo(date) {
  const now = new Date()
  const then = new Date(date)
  const diff = Math.floor((now - then) / 1000)
  if (diff < 60) return `${diff} seconds ago`
  if (diff < 3600) return `${Math.floor(diff/60)} minutes ago`
  if (diff < 86400) return `${Math.floor(diff/3600)} hours ago`
  return `${Math.floor(diff/86400)} days ago`
}

const CompletedTasks = ({ completedTodos, theme, deleteCompleted }) => {
  const [infoId, setInfoId] = useState(null)
  return (
    <Container theme={theme}>
      <AnimatePresence>
        {completedTodos.map((todo) => (
          <CompletedItem
            key={todo.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            theme={theme}
            isOnTime={todo.isOnTime}
          >
            <TaskText>{todo.text}</TaskText>
            <TimeInfo>
              <div>Completed: {formatDate(todo.completedAt)}</div>
              <div>Due: {formatDate(todo.endTime)}</div>
              <StatusBadge isOnTime={todo.isOnTime}>
                {todo.wasAutoCompleted
                  ? 'Incomplete'
                  : todo.isOnTime
                    ? 'Completed on time'
                    : 'Completed late'}
              </StatusBadge>
            </TimeInfo>
            <InfoButton
              onClick={() => setInfoId(infoId === todo.id ? null : todo.id)}
              whileTap={{ scale: 0.95 }}
              title="Info"
            >
              Info
            </InfoButton>
            {infoId === todo.id && (
              <InfoBox>
                {todo.wasAutoCompleted
                  ? `Marked incomplete ${timeAgo(todo.completedAt)}`
                  : `Completed ${timeAgo(todo.completedAt)}`}
              </InfoBox>
            )}
            <DeleteButton
              onClick={() => deleteCompleted(todo.id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Delete"
            >
              ×
            </DeleteButton>
          </CompletedItem>
        ))}
      </AnimatePresence>
    </Container>
  )
}

export default CompletedTasks 