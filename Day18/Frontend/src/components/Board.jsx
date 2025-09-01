import { useState, useEffect } from 'react'
import { useDrop } from 'react-dnd'
import Column from './Column'
import TaskModal from './TaskModal'
import BoardModal from './BoardModal'
import axios from 'axios'
import './Board.css'

const Board = ({ socket }) => {
  const [boards, setBoards] = useState([])
  const [selectedBoard, setSelectedBoard] = useState(null)
  const [columns, setColumns] = useState([])
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showBoardModal, setShowBoardModal] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBoards()
  }, [])

  useEffect(() => {
    if (selectedBoard) {
      fetchColumns()
      if (socket) {
        socket.emit('join-board', selectedBoard._id)
      }
    }

    return () => {
      if (socket && selectedBoard) {
        socket.emit('leave-board', selectedBoard._id)
      }
    }
  }, [selectedBoard, socket])

  useEffect(() => {
    if (!socket) return

    const handleTaskUpdated = (data) => {
      setColumns(prev => prev.map(col => 
        col._id === data.column 
          ? { ...col, tasks: col.tasks.map(t => t._id === data._id ? data : t) }
          : col
      ))
    }

    const handleTaskCreated = (data) => {
      setColumns(prev => prev.map(col => 
        col._id === data.column 
          ? { ...col, tasks: [...col.tasks, data] }
          : col
      ))
    }

    const handleTaskDeleted = (data) => {
      setColumns(prev => prev.map(col => ({
        ...col,
        tasks: col.tasks.filter(t => t._id !== data.id)
      })))
    }

    socket.on('task-updated', handleTaskUpdated)
    socket.on('task-created', handleTaskCreated)
    socket.on('task-deleted', handleTaskDeleted)

    return () => {
      socket.off('task-updated', handleTaskUpdated)
      socket.off('task-created', handleTaskCreated)
      socket.off('task-deleted', handleTaskDeleted)
    }
  }, [socket])

  const fetchBoards = async () => {
    try {
      const response = await axios.get('/api/boards')
      setBoards(response.data)
      if (response.data.length > 0 && !selectedBoard) {
        setSelectedBoard(response.data[0])
      }
    } catch (error) {
      console.error('Failed to fetch boards:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchColumns = async () => {
    if (!selectedBoard) return
    
    try {
      const response = await axios.get(`/api/columns/board/${selectedBoard._id}`)
      setColumns(response.data)
    } catch (error) {
      console.error('Failed to fetch columns:', error)
    }
  }

  const handleCreateBoard = async (boardData) => {
    try {
      const response = await axios.post('/api/boards', boardData)
      setBoards(prev => [...prev, response.data])
      setSelectedBoard(response.data)
      setShowBoardModal(false)
    } catch (error) {
      console.error('Failed to create board:', error)
    }
  }

  const handleCreateTask = async (taskData) => {
    try {
      const response = await axios.post('/api/tasks', {
        ...taskData,
        columnId: columns[0]?._id // Add to first column by default
      })
      setShowTaskModal(false)
    } catch (error) {
      console.error('Failed to create task:', error)
    }
  }

  const moveTask = async (taskId, sourceColId, targetColId) => {
    if (sourceColId === targetColId) return

    try {
      await axios.put(`/api/tasks/${taskId}`, {
        columnId: targetColId
      })
    } catch (error) {
      console.error('Failed to move task:', error)
      // Revert UI on error
      fetchColumns()
    }
  }

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item) => moveTask(item.id, item.columnId, columns[columns.length - 1]?._id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }), [columns])

  if (loading) {
    return <div className="loading">Loading boards...</div>
  }

  if (boards.length === 0) {
    return (
      <div className="board-container">
        <div className="empty-state">
          <h2>No boards yet</h2>
          <p>Create your first board to get started</p>
          <button 
            className="btn btn-primary"
            onClick={() => setShowBoardModal(true)}
          >
            Create Board
          </button>
        </div>

        {showBoardModal && (
          <BoardModal
            onClose={() => setShowBoardModal(false)}
            onSubmit={handleCreateBoard}
          />
        )}
      </div>
    )
  }

  return (
    <div className="board-container">
      <div className="board-header">
        <div className="board-selector">
          <select 
            value={selectedBoard?._id} 
            onChange={(e) => setSelectedBoard(boards.find(b => b._id === e.target.value))}
          >
            {boards.map(board => (
              <option key={board._id} value={board._id}>
                {board.title}
              </option>
            ))}
          </select>
          <button 
            className="btn btn-secondary"
            onClick={() => setShowBoardModal(true)}
          >
            New Board
          </button>
        </div>
        
        <button 
          className="btn btn-primary"
          onClick={() => setShowTaskModal(true)}
        >
          Add Task
        </button>
      </div>

      <div className="columns-container" ref={drop}>
        {columns.map(column => (
          <Column
            key={column._id}
            column={column}
            onMoveTask={moveTask}
          />
        ))}
        
        {columns.length === 0 && (
          <div className="empty-columns">
            <p>No columns yet. Tasks will appear here.</p>
          </div>
        )}
      </div>

      {showTaskModal && (
        <TaskModal
          onClose={() => setShowTaskModal(false)}
          onSubmit={handleCreateTask}
          board={selectedBoard}
        />
      )}

      {showBoardModal && (
        <BoardModal
          onClose={() => setShowBoardModal(false)}
          onSubmit={handleCreateBoard}
        />
      )}
    </div>
  )
}

export default Board