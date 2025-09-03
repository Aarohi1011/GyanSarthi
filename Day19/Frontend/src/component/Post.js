import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Post = ({ post, onUpdate }) => {
  const [comment, setComment] = useState('');
  const { user } = useAuth();

  const handleLike = async () => {
    try {
      const response = await axios.post(`/api/posts/${post._id}/like`);
      onUpdate(response.data);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    try {
      const response = await axios.post(`/api/posts/${post._id}/comment`, {
        content: comment
      });
      
      onUpdate(response.data);
      setComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  // Safe check for likes array
  const isLiked = post.likes && user && post.likes.includes(user.id);

  return (
    <div className="post fade-in">
      <div className="post-header">
        <img 
          src={post.user?.profilePicture ? `http://localhost:5000/${post.user.profilePicture}` : '/default-avatar.png'} 
          alt={post.user?.username || 'User'}
          className="post-avatar"
          onError={(e) => {
            e.target.src = '/default-avatar.png';
          }}
        />
        <div className="post-user-info">
          <h4>{post.user?.username || 'Unknown User'}</h4>
          <p className="post-time">
            {new Date(post.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
      
      <div className="post-content">
        <p>{post.content}</p>
        {post.image && (
          <img 
            src={`http://localhost:5000/${post.image}`} 
            alt="Post" 
            className="post-image"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        )}
      </div>
      
      <div className="post-actions">
        <button 
          onClick={handleLike} 
          className={`like-btn ${isLiked ? 'liked' : ''}`}
        >
          {isLiked ? '❤️' : '🤍'} {post.likes ? post.likes.length : 0} likes
        </button>
      </div>
      
      <div className="post-comments">
        <h4>Comments ({post.comments ? post.comments.length : 0})</h4>
        
        {post.comments && post.comments.map(comment => (
          <div key={comment._id} className="comment">
            <img 
              src={comment.user?.profilePicture ? `http://localhost:5000/${comment.user.profilePicture}` : '/default-avatar.png'} 
              alt={comment.user?.username || 'User'}
              className="comment-avatar"
              onError={(e) => {
                e.target.src = '/default-avatar.png';
              }}
            />
            <div className="comment-content">
              <strong>{comment.user?.username || 'Unknown User'}</strong>
              <p>{comment.content}</p>
              <span className="comment-time">
                {new Date(comment.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
        
        <form onSubmit={handleComment} className="comment-form">
          <input
            type="text"
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button type="submit">Post</button>
        </form>
      </div>
    </div>
  );
};

export default Post;