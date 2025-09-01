import { Link } from 'react-router-dom'

const BoardCard = ({ board }) => {
  return (
    <div className="card">
      <h3>{board.title}</h3>
      <p>{board.description || 'No description'}</p>
      <div className="flex-between mt-2">
        <span>{board.isPublic ? 'Public' : 'Private'}</span>
        <Link to={`/board/${board._id}`} className="btn btn-primary">
          Open
        </Link>
      </div>
    </div>
  )
}

export default BoardCard