import { useDrop } from 'react-dnd'
import Task from './Task'
import './Column.css'

const Column = ({ column, onMoveTask }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item) => {
      if (item.columnId !== column._id) {
        onMoveTask(item.id, item.columnId, column._id)
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }), [column._id])

  return (
    <div 
      ref={drop}
      className={`column ${isOver ? 'column-over' : ''}`}
    >
      <div className="column-header">
        <h3>{column.title}</h3>
        <span className="task-count">{column.tasks?.length || 0}</span>
      </div>
      
      <div className="tasks-list">
        {column.tasks?.map(task => (
          <Task
            key={task._id}
            task={task}
            columnId={column._id}
          />
        ))}
        
        {(!column.tasks || column.tasks.length === 0) && (
          <div className="empty-tasks">
            <p>No tasks</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Column