import { useDrag } from 'react-dnd'
import './Task.css'

const Task = ({ task, columnId }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'task',
    item: { id: task._id, columnId },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }), [task._id, columnId])

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high': return 'priority-high'
      case 'medium': return 'priority-medium'
      case 'low': return 'priority-low'
      default: return ''
    }
  }

  return (
    <div 
      ref={drag}
      className={`task ${getPriorityClass(task.priority)} ${isDragging ? 'task-dragging' : ''}`}
    >
      <div className="task-header">
        <h4>{task.title}</h4>
        <span className="priority-dot"></span>
      </div>
      
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}
      
      <div className="task-meta">
        {task.assignees && task.assignees.length > 0 && (
          <div className="assignees">
            {task.assignees.map(assignee => (
              <span key={assignee._id} className="assignee-avatar">
                {assignee.username.charAt(0).toUpperCase()}
              </span>
            ))}
          </div>
        )}
        
        {task.dueDate && (
          <div className="due-date">
            {new Date(task.dueDate).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  )
}

export default Task