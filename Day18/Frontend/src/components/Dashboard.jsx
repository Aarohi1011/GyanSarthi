import { useState, useEffect } from 'react'
import axios from 'axios'
import BoardCard from './BoardCard'
import CreateBoardModal from './CreateBoardModal'

const Dashboard = ({ socket }) => {
  const [boards, setBoards] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    fetchBoards()
  }, [])

  const fetchBoards = async () => {
    try {
      const response = await axios.get('/api/boards')
      setBoards(response.data)
    } catch (error) {
      console.error('Failed to fetch boards:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBoardCreated = async (boardData) => {
    try {
      const response = await axios.post('/api/boards', boardData)
      setBoards([...boards, response.data])
      setShowCreateModal(false)
    } catch (error) {
      console.error('Failed to create board:', error)
      throw error // This will be caught by the modal's error handling
    }
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="flex-between mb-4">
        <h1>My Boards</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          Create Board
        </button>
      </div>

      {boards.length === 0 ? (
        <div className="card text-center p-4">
          <h3>No boards yet</h3>
          <p>Create your first board to get started!</p>
          <button 
            className="btn btn-primary mt-2"
            onClick={() => setShowCreateModal(true)}
          >
            Create Board
          </button>
        </div>
      ) : (
        <div className="grid grid-3">
          {boards.map(board => (
            <BoardCard key={board._id} board={board} />
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateBoardModal 
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleBoardCreated}
        />
      )}
    </div>
  )
}

export default Dashboard