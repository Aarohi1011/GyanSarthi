import ProfileCard from "./Component/ProfileCard";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <ProfileCard 
        name="Aarohi Saxena" 
        age={21} 
        bio="React learner, loves coding 🚀" 
        image="https://via.placeholder.com/150" 
      />
      <ProfileCard 
        name="Rahul Verma" 
        age={25} 
        bio="Frontend Developer & Designer 🎨" 
        image="https://via.placeholder.com/150" 
      />
    </div>
  );
}

export default App;
