import "./ProfileCard.css";

function ProfileCard({ name, age, bio, image }) {
  return (
    <div className="profile-card">
      <img src={image} alt={name} className="profile-img" />
      <h2>{name}</h2>
      <p className="age">Age: {age}</p>
      <p className="bio">{bio}</p>
    </div>
  );
}

export default ProfileCard;
