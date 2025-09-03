import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Column from './Column'
import CreateTaskModal from './CreateTaskModal'
import CreateColumnModal from './CreateColumnModal'
import CreateBoardModal from './CreateBoardModal'
import './Board.css'

const Board = ({ socket }) => {
  const { id } = useParams()
  const [board, setBoard] = useState(null)
  const [columns, setColumns] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateTask, setShowCreateTask] = useState(false)
  const [showCreateColumn, setShowCreateColumn] = useState(false)
  const [selectedColumn, setSelectedColumn] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchBoardData()
    
    if (socket) {
      socket.emit('join-board', id)
      
      socket.on('task-created', handleTaskCreated)
      socket.on('task-updated', handleTaskUpdated)
      socket.on('task-deleted', handleTaskDeleted)
      socket.on('column-created', handleColumnCreated)
      socket.on('column-updated', handleColumnUpdated)
    }

    return () => {
      if (socket) {
        socket.emit('leave-board', id)
        socket.off('task-created')
        socket.off('task-updated')
        socket.off('task-deleted')
        socket.off('column-created')
        socket.off('column-updated')
      }
    }
  }, [id, socket])

  const fetchBoardData = async () => {
    try {
      setError('')
      const [boardResponse, columnsResponse] = await Promise.all([
        axios.get(`/api/boards/${id}`),
        axios.get(`/api/columns/board/${id}`)
      ])
      
      setBoard(boardResponse.data)
      setColumns(columnsResponse.data)
    } catch (error) {
      console.error('Failed to fetch board data:', error)
      setError('Failed to load board data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleTaskCreated = (task) => {
    setColumns(prev => prev.map(col => 
      col._id === task.columnId 
        ? { ...col, tasks: [...col.tasks, task] }
        : col
    ))
  }

  const handleTaskUpdated = (updatedTask) => {
    setColumns(prev => prev.map(col => 
      col._id === updatedTask.columnId 
        ? { 
            ...col, 
            tasks: col.tasks.map(task => 
              task._id === updatedTask._id ? updatedTask : task
            )
          }
        : col
    ))
  }

  const handleTaskDeleted = (deletedTask) => {
    setColumns(prev => prev.map(col => 
      col._id === deletedTask.columnId 
        ? { 
            ...col, 
            tasks: col.tasks.filter(task => task._id !== deletedTask._id)
          }
        : col
    ))
  }

  const handleColumnCreated = (newColumn) => {
    setColumns(prev => [...prev, newColumn])
  }

  const handleColumnUpdated = (updatedColumn) => {
    setColumns(prev => prev.map(col => 
      col._id === updatedColumn._id ? updatedColumn : col
    ))
  }

  const handleOpenCreateTask = (columnId) => {
    setSelectedColumn(columnId)
    setShowCreateTask(true)
  }

  const handleTaskCreate = async (taskData) => {
    try {
      const response = await axios.post('/api/tasks', {
        ...taskData,
        columnId: selectedColumn,
        boardId: id
      })
      
      if (socket) {
        socket.emit('task-created', {
          ...response.data,
          boardId: id
        })
      }
      
      setShowCreateTask(false)
      setSelectedColumn(null)
    } catch (error) {
      console.error('Failed to create task:', error)
      setError('Failed to create task. Please try again.')
    }
  }

  const handleColumnCreate = async (columnData) => {
    try {
      const response = await axios.post('/api/columns', {
        ...columnData,
        boardId: id
      })
      
      if (socket) {
        socket.emit('column-created', {
          ...response.data,
          boardId: id
        })
      }
      
      setShowCreateColumn(false)
    } catch (error) {
      console.error('Failed to create column:', error)
      setError('Failed to create column. Please try again.')
    }
  }

  const handleTaskMove = async (taskId, sourceColId, destinationColId, newIndex) => {
    try {
      // Optimistic UI update first
      const taskToMove = columns
        .find(col => col._id === sourceColId)
        ?.tasks.find(task => task._id === taskId)
      
      if (taskToMove) {
        setColumns(prev => prev.map(col => {
          if (col._id === sourceColId) {
            return {
              ...col,
              tasks: col.tasks.filter(task => task._id !== taskId)
            }
          }
          if (col._id === destinationColId) {
            const newTasks = [...col.tasks]
            newTasks.splice(newIndex, 0, { ...taskToMove, columnId: destinationColId })
            return { ...col, tasks: newTasks }
          }
          return col
        }))
        
        // Then make the API call
        await axios.put(`/api/tasks/${taskId}/move`, {
          columnId: destinationColId,
          position: newIndex
        })
        
        if (socket) {
          socket.emit('task-updated', {
            ...taskToMove,
            columnId: destinationColId,
            boardId: id
          })
        }
      }
    } catch (error) {
      console.error('Failed to move task:', error)
      setError('Failed to move task. Please try again.')
      fetchBoardData() // Revert to server state if move fails
    }
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading board...</div>
      </div>
    )
  }

  if (!board) {
    return (
      <div className="container">
        <div className="error-message">Board not found</div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="flex-between mb-4">
        <div>
          <h1>{board.title}</h1>
          {board.description && <p className="board-description">{board.description}</p>}
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowCreateColumn(true)}
        >
          Add Column
        </button>
      </div>

      {error && (
        <div className="error-message mb-3">
          {error}
          <button 
            className="btn btn-secondary ml-2"
            onClick={() => setError('')}
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="board-columns">
        {columns.map(column => (
          <Column
            key={column._id}
            column={column}
            onAddTask={() => handleOpenCreateTask(column._id)}
            onTaskMove={handleTaskMove}
            socket={socket}
            boardId={id}
          />
        ))}
        
        {columns.length === 0 && (
          <div className="card text-center p-4">
            <h3>No columns yet</h3>
            <p>Create your first column to get started!</p>
            <button 
              className="btn btn-primary mt-2"
              onClick={() => setShowCreateColumn(true)}
            >
              Create Column
            </button>
          </div>
        )}
      </div>

      {showCreateTask && (
        <CreateTaskModal
          onClose={() => {
            setShowCreateTask(false)
            setSelectedColumn(null)
          }}
          onSubmit={handleTaskCreate}
          columnId={selectedColumn}
        />
      )}

      {showCreateColumn && (
        <CreateColumnModal
          onClose={() => setShowCreateColumn(false)}
          onSubmit={handleColumnCreate}
        />
      )}
    </div>
  )
}

export default Board