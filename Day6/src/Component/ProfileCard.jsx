import "./ProfileCard.css";

function ProfileCard({ name, age, bio, image }) {
  return (
    <div className="profile-card">
      <div className="card-inner">
        <div className="card-front">
          <div className="image-container">
            <img src={image} alt={name} className="profile-img" />
            <div className="decoration-dots"></div>
          </div>
          <h2>{name}</h2>
          <p className="age">Age: {age}</p>
          <p className="bio">{bio}</p>
          <div className="divider"></div>
          <button className="view-profile-btn">View Profile</button>
        </div>
        
        <div className="card-back">
          <h3>About Me</h3>
          <p className="detailed-bio">Passionate developer with expertise in modern web technologies. Love creating beautiful and functional user experiences.</p>
          <div className="skills">
            <span className="skill-tag">React</span>
            <span className="skill-tag">JavaScript</span>
            <span className="skill-tag">CSS</span>
          </div>
          <div className="social-links">
            <a href="#" className="social-link">LinkedIn</a>
            <a href="#" className="social-link">GitHub</a>
            <a href="#" className="social-link">Twitter</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;