import { useState } from 'react'
import './BoardModal.css'

const BoardModal = ({ onClose, onSubmit, board = null }) => {
  const [title, setTitle] = useState(board?.title || '')
  const [description, setDescription] = useState(board?.description || '')
  const [isPublic, setIsPublic] = useState(board?.isPublic || false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    
    if (!title.trim()) {
      newErrors.title = 'Title is required'
    } else if (title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters'
    }
    
    if (description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        isPublic
      })
    } catch (error) {
      console.error('Failed to save board:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{board ? 'Edit Board' : 'Create New Board'}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="title">Board Title *</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter board title"
              className={errors.title ? 'error' : ''}
              disabled={loading}
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter board description (optional)"
              rows="3"
              className={errors.description ? 'error' : ''}
              disabled={loading}
            />
            {errors.description && (
              <span className="error-text">{errors.description}</span>
            )}
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                disabled={loading}
              />
              <span className="checkmark"></span>
              Public Board (visible to everyone)
            </label>
            <p className="helper-text">
              When enabled, anyone with the link can view this board
            </p>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : (board ? 'Update Board' : 'Create Board')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BoardModal