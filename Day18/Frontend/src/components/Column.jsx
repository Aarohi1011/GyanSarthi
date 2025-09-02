import { useState } from 'react'
import axios from 'axios'
import Task from './Task'
import './Column.css'

const Column = ({ column, onAddTask, onTaskMove, socket, boardId }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(column.title)

  const handleTitleChange = async (e) => {
    if (e.key === 'Enter') {
      try {
        const response = await axios.put(`/api/columns/${column._id}`, {
          title: e.target.value
        })
        
        if (socket) {
          socket.emit('column-updated', {
            ...response.data,
            boardId
          })
        }
        
        setIsEditing(false)
      } catch (error) {
        console.error('Failed to update column title:', error)
      }
    } else if (e.key === 'Escape') {
      setTitle(column.title)
      setIsEditing(false)
    }
  }

  return (
    <div className="column-card">
      <div className="column-header">
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleTitleChange}
            onBlur={() => setIsEditing(false)}
            autoFocus
          />
        ) : (
          <h3 onClick={() => setIsEditing(true)}>{column.title}</h3>
        )}
        <span className="task-count">{column.tasks?.length || 0}</span>
      </div>

      <div className="task-list">
        {column.tasks?.map((task, index) => (
          <Task
            key={task._id}
            task={task}
            index={index}
            onMoveTask={onTaskMove}
            socket={socket}
            boardId={boardId}
          />
        ))}
      </div>

      <button className="add-task-btn" onClick={onAddTask}>
        + Add Task
      </button>
    </div>
  )
}

export default Column