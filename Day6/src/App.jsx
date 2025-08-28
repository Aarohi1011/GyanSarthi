import ProfileCard from "./Component/ProfileCard";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <div className="content-wrapper">
        <h1 className="app-title">Our Creative Team</h1>
        <p className="app-subtitle">Meet the talented individuals behind our success</p>
        <div className="cards-container">
          <ProfileCard 
            name="Aarohi Saxena" 
            age={21} 
            bio="React learner, loves coding 🚀"
            image="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
          />
          <ProfileCard 
            name="Deepansh Sharma" 
            age={25} 
            bio="Frontend Developer & Designer 🎨"
            image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
          />
        </div>
      </div>
    </div>
  );
}

export default App;