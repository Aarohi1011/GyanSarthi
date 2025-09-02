import { useState } from 'react'
import axios from 'axios'
import TaskModal from './TaskModal'
import './Task.css'

const Task = ({ task, index, onMoveTask, socket, boardId }) => {
  const [showModal, setShowModal] = useState(false)

  const handleClick = () => {
    setShowModal(true)
  }

  const handleUpdate = async (updatedData) => {
    try {
      const response = await axios.put(`/api/tasks/${task._id}`, updatedData)
      
      if (socket) {
        socket.emit('task-updated', {
          ...response.data,
          boardId
        })
      }
    } catch (error) {
      console.error('Failed to update task:', error)
    }
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/tasks/${task._id}`)
      
      if (socket) {
        socket.emit('task-deleted', {
          ...task,
          boardId
        })
      }
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444'
      case 'medium': return '#f59e0b'
      case 'low': return '#10b981'
      default: return '#6b7280'
    }
  }

  return (
    <>
      <div className="task-card" onClick={handleClick}>
        <div className="task-header">
          <h4>{task.title}</h4>
          {task.priority && (
            <span 
              className="priority-badge"
              style={{ backgroundColor: getPriorityColor(task.priority) }}
            >
              {task.priority}
            </span>
          )}
        </div>
        
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}
        
        <div className="task-footer">
          {task.assignees && task.assignees.length > 0 && (
            <div className="assignees">
              {task.assignees.slice(0, 3).map(assignee => (
                <span key={assignee._id} className="assignee-avatar">
                  {assignee.username?.charAt(0).toUpperCase() || 'U'}
                </span>
              ))}
              {task.assignees.length > 3 && (
                <span className="more-assignees">+{task.assignees.length - 3}</span>
              )}
            </div>
          )}
          
          {task.dueDate && (
            <span className="due-date">
              {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      {showModal && (
        <TaskModal
          task={task}
          onClose={() => setShowModal(false)}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </>
  )
}

export default Task