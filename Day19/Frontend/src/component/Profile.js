import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Post from './Post';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  
  const { id } = useParams();
  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetchUser();
    fetchUserPosts();
  }, [id]);

  const fetchUser = async () => {
    try {
      setUserLoading(true);
      const response = await axios.get(`/api/user/${id}`);
      setUser(response.data);
      setBio(response.data.bio || '');
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setUserLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await axios.get('/api/posts');
      const userPosts = response.data.filter(post => post.user._id === id);
      setPosts(userPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      await axios.post(`/api/user/${id}/follow`);
      fetchUser(); // Refresh user data
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('bio', bio);
    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }
    
    try {
      const response = await axios.put(`/api/user/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setUser(response.data);
      setEditing(false);
      setProfilePicture(null);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  // Safe check for current user and following status
  const isCurrentUser = currentUser && currentUser.id === id;
  const isFollowing = user && currentUser && currentUser.following && currentUser.following.includes(user._id);

  if (userLoading) {
    return <div className="loading">Loading user profile...</div>;
  }

  if (loading) {
    return <div className="loading">Loading posts...</div>;
  }

  if (!user) {
    return <div className="error-message">User not found</div>;
  }

  return (
    <div className="profile">
      <div className="profile-header fade-in">
        <div className="profile-info">
          <img 
            src={user.profilePicture ? `http://localhost:5000/${user.profilePicture}` : '/default-avatar.png'} 
            alt={user.username}
            className="profile-avatar"
            onError={(e) => {
              e.target.src = '/default-avatar.png';
            }}
          />
          
          <div className="profile-details">
            <h2>{user.username}</h2>
            <p className="profile-bio">{user.bio || 'No bio yet. Share something about yourself!'}</p>
            
            <div className="profile-stats">
              <span>{posts.length} Posts</span>
              <span>{user.followers ? user.followers.length : 0} Followers</span>
              <span>{user.following ? user.following.length : 0} Following</span>
            </div>
            
            {!isCurrentUser ? (
              <button onClick={handleFollow} className="follow-btn">
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            ) : (
              <button onClick={() => setEditing(true)} className="follow-btn">
                Edit Profile
              </button>
            )}
          </div>
        </div>
        
        {editing && (
          <div className="edit-profile">
            <h3>Edit Your Profile</h3>
            
            <div className="form-group">
              <label>Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows="3"
                placeholder="Tell us about yourself..."
              />
            </div>
            
            <div className="form-group">
              <label>Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfilePicture(e.target.files[0])}
              />
            </div>
            
            {profilePicture && (
              <div className="image-preview">
                <img src={URL.createObjectURL(profilePicture)} alt="Preview" />
                <button onClick={() => setProfilePicture(null)}>×</button>
              </div>
            )}
            
            <div className="edit-actions">
              <button onClick={handleSave}>Save Changes</button>
              <button onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
      
      <div className="profile-posts">
        <h3>{user.username}'s Posts</h3>
        
        {posts.length === 0 ? (
          <div className="empty-state">
            <h3>No posts yet</h3>
            <p>{isCurrentUser ? 'Share your first post with the community!' : 'This user hasn\'t posted anything yet.'}</p>
          </div>
        ) : (
          posts.map(post => (
            <Post key={post._id} post={post} />
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;