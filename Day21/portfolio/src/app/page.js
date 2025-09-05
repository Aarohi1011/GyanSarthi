"use client"
import Head from 'next/head';
import { useState, useEffect } from 'react';

export default function Portfolio() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const projects = [
    {
      id: 1,
      title: "Aadhar 2.0",
      description: "A collage website of inter collage level hackathon",
      tech: ["React", "Node.js", "MongoDB"],
      category: "UI/UX"
    },
    {
      id: 2,
      title: "Pathshala Platform",
      description: "ERP platform with interactive learning modules",
      tech: ["HTML", "CSS", "JavaScript"],
      category: "frontend"
    },
    {
      id: 3,
      title: "Karmanishth Platform",
      description: "Community-focused website for social initiatives",
      tech: ["React", "Bootstrap", "Firebase"],
      category: "frontend"
    }
  ];

  const skills = {
    technical: [
      { name: "HTML/CSS", level: 90 },
      { name: "JavaScript", level: 85 },
      { name: "React", level: 80 },
      { name: "Node.js", level: 75 },
      { name: "MongoDB", level: 70 },
      { name: "UI/UX Design", level: 85 }
    ],
    soft: [
      "Good Communication Skills",
      "Leadership Quality",
      "Time & Project Management",
      "Quick Learner",
      "Teamwork & Collaboration"
    ]
  };

  // Parallax effect for background elements
  const parallaxStyle = {
    transform: `translateY(${scrollPosition * 0.5}px)`
  };

  return (
    <div className="container">
      <Head>
        <title>Aarohi Saxena | Luxury Portfolio</title>
        <meta name="description" content="Aarohi Saxena - CS Student & Developer Portfolio" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Animated Background Elements */}
      <div className="bg-elements">
        <div className="bg-element-1" style={parallaxStyle}></div>
        <div className="bg-element-2" style={parallaxStyle}></div>
        <div className="bg-element-3" style={parallaxStyle}></div>
      </div>

      {/* Navigation */}
      <nav className={`navbar ${scrollPosition > 50 ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <div className="logo">
            <span className="logo-text">AS</span>
            <div className="logo-shine"></div>
          </div>
          <ul className={`nav-menu ${menuOpen ? 'active' : ''}`}>
            <li className="nav-item">
              <a href="#home" className="nav-link" onClick={() => setMenuOpen(false)}>Home</a>
            </li>
            <li className="nav-item">
              <a href="#about" className="nav-link" onClick={() => setMenuOpen(false)}>About</a>
            </li>
            <li className="nav-item">
              <a href="#projects" className="nav-link" onClick={() => setMenuOpen(false)}>Projects</a>
            </li>
            <li className="nav-item">
              <a href="#achievements" className="nav-link" onClick={() => setMenuOpen(false)}>Achievements</a>
            </li>
            <li className="nav-item">
              <a href="#contact" className="nav-link" onClick={() => setMenuOpen(false)}>Contact</a>
            </li>
          </ul>
          <div 
            className={`hamburger ${menuOpen ? 'active' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="greeting">Hello, I'm</span>
              <span className="name">Aarohi Saxena</span>
            </h1>
            <div className="hero-tags">
              <span className="hero-tag">CS Student</span>
              <span className="hero-tag">UI/UX Designer</span>
              <span className="hero-tag">Frontend Developer</span>
            </div>
            <p className="hero-description">B.Tech in Computer Science with specialization in IT</p>
            <div className="hero-badges">
              <div className="badge">
                <span className="badge-icon">🥇</span>
                <span>Branch Topper</span>
              </div>
              <div className="badge">
                <span className="badge-icon">🚀</span>
                <span>SIH Participant</span>
              </div>
            </div>
          </div>
          <div className="hero-buttons">
            <a href="#projects" className="btn btn-primary">
              <span>View My Work</span>
              <div className="btn-shine"></div>
            </a>
            <a href="#contact" className="btn btn-secondary">
              <span>Get In Touch</span>
            </a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-card">
            <div className="card-shine"></div>
            <div className="achievement-spotlight">
              <div className="spotlight-item">SIH Selected</div>
              <div className="spotlight-item">Branch Topper</div>
              <div className="spotlight-item">Frontend Developer</div>
            </div>
            <div className="floating-particles">
              {[...Array(15)].map((_, i) => (
                <div key={i} className="particle" style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.2}s`,
                  width: `${5 + Math.random() * 5}px`,
                  height: `${5 + Math.random() * 5}px`
                }}></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="section-header">
          <h2>About Me</h2>
          <div className="underline"></div>
        </div>
        <div className="about-content">
          <div className="about-text">
            <p>
              I'm a passionate developer currently pursuing <strong>B.Tech in Computer Science</strong> with 
              a specialization in <strong>Information Technology</strong>. I have a strong interest in 
              <strong> UI/UX Design</strong>, <strong>Full Stack Development</strong>, and problem-solving with 
              <strong> Data Structures & Algorithms</strong>.
            </p>
            <p>
              As a <strong>Branch Topper in my 1st Semester</strong>, I've demonstrated my dedication to excellence 
              in academics. I'm actively involved in projects and hackathons, with my project <strong>Aadhar 2.0</strong> 
              being selected at the <strong>Smart India Hackathon</strong> college level.
            </p>
            
            <div className="skills-section">
              <h3>Technical Skills</h3>
              <div className="skills-container">
                {skills.technical.map((skill, index) => (
                  <div key={index} className="skill-item">
                    <div className="skill-info">
                      <span className="skill-name">{skill.name}</span>
                      <span className="skill-percentage">{skill.level}%</span>
                    </div>
                    <div className="skill-bar">
                      <div 
                        className="skill-progress" 
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="soft-skills">
              <h3>Soft Skills</h3>
              <div className="soft-skills-container">
                {skills.soft.map((skill, index) => (
                  <div key={index} className="soft-skill-item">
                    <span className="soft-skill-icon">✓</span>
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="projects">
        <div className="section-header">
          <h2>My Projects</h2>
          <div className="underline"></div>
        </div>
        <div className="projects-grid">
          {projects.map(project => (
            <div key={project.id} className="project-card">
              <div className="project-header">
                <h3>{project.title}</h3>
                <span className="project-category">{project.category}</span>
              </div>
              <p className="project-description">{project.description}</p>
              <div className="project-tech">
                {project.tech.map((tech, index) => (
                  <span key={index} className="tech-tag">{tech}</span>
                ))}
              </div>
              <div className="project-links">
                <a href="#" className="project-link">View Details</a>
              </div>
              <div className="project-hover-effect"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Achievements Section */}
      <section id="achievements" className="achievements">
        <div className="section-header">
          <h2>Achievements</h2>
          <div className="underline"></div>
        </div>
        <div className="achievements-container">
          <div className="achievement-card">
            <div className="achievement-icon">🥇</div>
            <h3>Branch Topper</h3>
            <p>Secured first position in Computer Science (IT Specialization) during 1st Semester</p>
            <div className="achievement-glow"></div>
          </div>
          <div className="achievement-card">
            <div className="achievement-icon">🚀</div>
            <h3>SIH Selection</h3>
            <p>Selected at college level for Smart India Hackathon with Aadhar 2.0 project</p>
            <div className="achievement-glow"></div>
          </div>
          <div className="achievement-card">
            <div className="achievement-icon">🏆</div>
            <h3>Maths Marathon Winner</h3>
            <p>Won 1st prize in Maths Marathon competition</p>
            <div className="achievement-glow"></div>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="education">
        <div className="section-header">
          <h2>Education</h2>
          <div className="underline"></div>
        </div>
        <div className="education-timeline">
          <div className="timeline-item">
            <div className="timeline-date">2023 - Present</div>
            <div className="timeline-content">
              <h3>B.Tech in Computer Science</h3>
              <p>Specialization in Information Technology</p>
              <span className="timeline-badge">Current GPA: 3.8/4.0</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="section-header">
          <h2>Get In Touch</h2>
          <div className="underline"></div>
        </div>
        <div className="contact-content">
          <div className="contact-info">
            <h3>Let's collaborate on something amazing!</h3>
            <p>
              I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
            </p>
            <div className="contact-details">
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <span>aarohi.saxena@example.com</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <span>India</span>
              </div>
            </div>
            <div className="social-links">
              <a href="#" className="social-link">GitHub</a>
              <a href="#" className="social-link">LinkedIn</a>
              <a href="#" className="social-link">Twitter</a>
            </div>
          </div>
          <div className="contact-form">
            {formSubmitted ? (
              <div className="form-success">
                <div className="success-icon">✓</div>
                <h3>Thank you for your message!</h3>
                <p>I'll get back to you as soon as possible.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <textarea
                    name="message"
                    placeholder="Your Message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary">
                  <span>Send Message</span>
                  <div className="btn-shine"></div>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p className="copyright">
            © {new Date().getFullYear()} Aarohi Saxena. All rights reserved.
          </p>
        </div>
      </footer>

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        :root {
          --royal-gold: #D4AF37;
          --emerald-green: #50C878;
          --sapphire-blue: #0F52BA;
          --ruby-red: #9B111E;
          --amethyst-purple: #9966CC;
          --dark-bg: #0A0A0A;
          --dark-card: #121212;
          --text-primary: #FFFFFF;
          --text-secondary: #B0B0B0;
          --platinum: #E5E4E2;
          --silver: #C0C0C0;
          --deep-navy: #0A1428;
        }

        body {
          background-color: var(--dark-bg);
          color: var(--text-primary);
          font-family: 'Cormorant Garamond', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          line-height: 1.6;
          overflow-x: hidden;
          background: linear-gradient(135deg, var(--deep-navy) 0%, var(--dark-bg) 50%, #1a1a2e 100%);
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          position: relative;
          overflow: hidden;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        /* Animated Background Elements */
        .bg-elements {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          overflow: hidden;
        }

        .bg-element-1, .bg-element-2, .bg-element-3 {
          position: absolute;
          border-radius: 50%;
          opacity: 0.1;
          filter: blur(40px);
        }

        .bg-element-1 {
          width: 500px;
          height: 500px;
          background: var(--royal-gold);
          top: -250px;
          right: -100px;
        }

        .bg-element-2 {
          width: 400px;
          height: 400px;
          background: var(--sapphire-blue);
          bottom: -200px;
          left: -100px;
        }

        .bg-element-3 {
          width: 300px;
          height: 300px;
          background: var(--amethyst-purple);
          top: 50%;
          right: 20%;
        }

        /* Navigation */
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: rgba(10, 10, 10, 0.5);
          backdrop-filter: blur(10px);
          padding: 1rem 0;
          transition: all 0.3s ease;
        }

        .navbar.scrolled {
          background: rgba(10, 10, 10, 0.9);
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          width: 60px;
          height: 60px;
          background: linear-gradient(145deg, var(--royal-gold), var(--sapphire-blue));
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          box-shadow: 0 0 30px rgba(212, 175, 55, 0.3);
        }

        .logo-shine {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            to bottom right,
            rgba(255, 255, 255, 0.3),
            rgba(255, 255, 255, 0)
          );
          transform: rotate(45deg);
          animation: shine 3s infinite;
        }

        @keyframes shine {
          0% {
            left: -50%;
          }
          100% {
            left: 100%;
          }
        }

        .logo-text {
          font-weight: bold;
          font-size: 1.5rem;
          z-index: 1;
          color: var(--platinum);
        }

        .nav-menu {
          display: flex;
          list-style: none;
          gap: 2rem;
        }

        .nav-link {
          position: relative;
          padding: 0.5rem 0;
          transition: color 0.3s;
          font-weight: 500;
        }

        .nav-link:hover {
          color: var(--royal-gold);
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(to right, var(--royal-gold), var(--sapphire-blue));
          transition: width 0.3s;
        }

        .nav-link:hover::after {
          width: 100%;
        }

        .hamburger {
          display: none;
          flex-direction: column;
          cursor: pointer;
        }

        .bar {
          width: 25px;
          height: 3px;
          background-color: var(--text-primary);
          margin: 2px 0;
          transition: 0.3s;
        }

        /* Hero Section */
        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: 100px 0 50px;
          position: relative;
        }

        .hero-content {
          display: flex;
          width: 100%;
          align-items: center;
          justify-content: space-between;
        }

        .hero-text {
          flex: 1;
          padding-right: 2rem;
        }

        .hero-title {
          margin-bottom: 1.5rem;
          display: flex;
          flex-direction: column;
        }

        .greeting {
          font-size: 1.8rem;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
          font-weight: 300;
        }

        .name {
          font-size: 4.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, var(--royal-gold) 0%, var(--sapphire-blue) 50%, var(--amethyst-purple) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }

        .hero-tags {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .hero-tag {
          padding: 0.5rem 1.2rem;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(15, 82, 186, 0.15));
          border: 1px solid;
          border-image: linear-gradient(135deg, var(--royal-gold), var(--sapphire-blue)) 1;
          border-radius: 50px;
          color: var(--platinum);
          font-size: 0.9rem;
          backdrop-filter: blur(5px);
        }

        .hero-description {
          font-size: 1.3rem;
          color: var(--silver);
          margin-bottom: 1.5rem;
          font-weight: 300;
        }

        .hero-badges {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.7rem 1.2rem;
          background: linear-gradient(135deg, rgba(15, 82, 186, 0.2), rgba(80, 200, 120, 0.2));
          border: 1px solid;
          border-image: linear-gradient(135deg, var(--sapphire-blue), var(--emerald-green)) 1;
          border-radius: 50px;
          backdrop-filter: blur(5px);
        }

        .badge-icon {
          font-size: 1.3rem;
        }

        .hero-buttons {
          display: flex;
          gap: 1.5rem;
        }

        .btn {
          padding: 1rem 2rem;
          border-radius: 50px;
          font-weight: 600;
          transition: all 0.3s;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          font-size: 1rem;
        }

        .btn-primary {
          background: linear-gradient(135deg, var(--royal-gold), var(--sapphire-blue));
          color: white;
          border: none;
          box-shadow: 0 5px 15px rgba(15, 82, 186, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(15, 82, 186, 0.5);
        }

        .btn-secondary {
          background: transparent;
          color: var(--text-primary);
          border: 2px solid var(--sapphire-blue);
          backdrop-filter: blur(5px);
        }

        .btn-secondary:hover {
          background: var(--sapphire-blue);
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(15, 82, 186, 0.3);
        }

        .btn-shine {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            to bottom right,
            rgba(255, 255, 255, 0.3),
            rgba(255, 255, 255, 0)
          );
          transform: rotate(45deg);
          animation: shine 3s infinite;
        }

        .hero-visual {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .floating-card {
          width: 320px;
          height: 380px;
          background: linear-gradient(145deg, rgba(25, 25, 35, 0.7), rgba(18, 18, 28, 0.7));
          border-radius: 20px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
          transform: perspective(1000px) rotateY(15deg) rotateX(10deg);
          transition: transform 0.5s;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 2rem;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .floating-card:hover {
          transform: perspective(1000px) rotateY(0) rotateX(0);
        }

        .card-shine {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            to bottom right,
            rgba(255, 255, 255, 0.1),
            rgba(255, 255, 255, 0)
          );
          transform: rotate(45deg);
          animation: shine 3s infinite;
        }

        .achievement-spotlight {
          position: relative;
          z-index: 2;
          text-align: center;
          width: 100%;
        }

        .spotlight-item {
          padding: 1rem;
          margin: 0.8rem 0;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(15, 82, 186, 0.15));
          border: 1px solid;
          border-image: linear-gradient(135deg, var(--royal-gold), var(--sapphire-blue)) 1;
          border-radius: 10px;
          color: var(--platinum);
          font-weight: 600;
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(5px);
        }

        .spotlight-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          animation: spotlight 2s infinite;
        }

        @keyframes spotlight {
          0% {
            left: -100%;
          }
          100% {
            left: 100%;
          }
        }

        .floating-particles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .particle {
          position: absolute;
          background: linear-gradient(135deg, var(--royal-gold), var(--sapphire-blue));
          border-radius: 50%;
          opacity: 0.6;
          animation: float 5s infinite ease-in-out;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        /* Sections */
        section {
          padding: 120px 0;
          position: relative;
        }

        .section-header {
          text-align: center;
          margin-bottom: 5rem;
        }

        .section-header h2 {
          font-size: 3rem;
          margin-bottom: 1.5rem;
          background: linear-gradient(135deg, var(--royal-gold) 0%, var(--sapphire-blue) 50%, var(--amethyst-purple) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
          font-weight: 700;
        }

        .underline {
          height: 5px;
          width: 100px;
          background: linear-gradient(to right, var(--royal-gold), var(--sapphire-blue));
          margin: 0 auto;
          border-radius: 3px;
          box-shadow: 0 2px 10px rgba(212, 175, 55, 0.3);
        }

        /* About Section */
        .about-content {
          display: flex;
          flex-direction: column;
          gap: 4rem;
        }

        .about-text p {
          margin-bottom: 2rem;
          color: var(--silver);
          font-size: 1.2rem;
          line-height: 1.8;
          text-align: center;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        .about-text strong {
          color: var(--royal-gold);
          font-weight: 600;
        }

        .skills-section {
          margin: 3rem 0;
        }

        .skills-section h3 {
          margin-bottom: 2rem;
          color: var(--platinum);
          font-size: 1.8rem;
          text-align: center;
          font-weight: 600;
        }

        .skills-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 700px;
          margin: 0 auto;
        }

        .skill-item {
          margin-bottom: 1.5rem;
        }

        .skill-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.8rem;
        }

        .skill-name {
          color: var(--platinum);
          font-weight: 500;
          font-size: 1.1rem;
        }

        .skill-percentage {
          color: var(--royal-gold);
          font-weight: 600;
        }

        .skill-bar {
          height: 10px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 5px;
          overflow: hidden;
          position: relative;
        }

        .skill-progress {
          height: 100%;
          background: linear-gradient(90deg, var(--royal-gold), var(--sapphire-blue));
          border-radius: 5px;
          position: relative;
          transition: width 1s ease-in-out;
          box-shadow: 0 0 10px rgba(15, 82, 186, 0.3);
        }

        .skill-progress::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          animation: skillShine 2s infinite;
        }

        @keyframes skillShine {
          0% {
            left: -100%;
          }
          100% {
            left: 100%;
          }
        }

        .soft-skills {
          margin: 3rem 0;
        }

        .soft-skills h3 {
          margin-bottom: 2rem;
          color: var(--platinum);
          font-size: 1.8rem;
          text-align: center;
          font-weight: 600;
        }

        .soft-skills-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          max-width: 900px;
          margin: 0 auto;
        }

        .soft-skill-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.2rem;
          background: linear-gradient(135deg, rgba(15, 82, 186, 0.15), rgba(80, 200, 120, 0.15));
          border: 1px solid;
          border-image: linear-gradient(135deg, var(--sapphire-blue), var(--emerald-green)) 1;
          border-radius: 10px;
          backdrop-filter: blur(5px);
          transition: transform 0.3s;
        }

        .soft-skill-item:hover {
          transform: translateY(-5px);
        }

        .soft-skill-icon {
          color: var(--emerald-green);
          font-weight: bold;
          font-size: 1.2rem;
        }

        /* Projects Section */
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: 2.5rem;
        }

        .project-card {
          background: linear-gradient(145deg, rgba(25, 25, 35, 0.7), rgba(18, 18, 28, 0.7));
          border-radius: 20px;
          padding: 2.5rem;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .project-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 5px;
          background: linear-gradient(to right, var(--royal-gold), var(--sapphire-blue));
        }

        .project-card:hover {
          transform: translateY(-15px);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
        }

        .project-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .project-header h3 {
          color: var(--platinum);
          font-size: 1.5rem;
          font-weight: 600;
        }

        .project-category {
          padding: 0.4rem 1rem;
          background: linear-gradient(135deg, rgba(80, 200, 120, 0.2), rgba(153, 102, 204, 0.2));
          border: 1px solid;
          border-image: linear-gradient(135deg, var(--emerald-green), var(--amethyst-purple)) 1;
          border-radius: 50px;
          color: var(--emerald-green);
          font-size: 0.9rem;
          font-weight: 500;
        }

        .project-description {
          color: var(--silver);
          margin-bottom: 2rem;
          line-height: 1.7;
          font-size: 1.1rem;
        }

        .project-tech {
          display: flex;
          flex-wrap: wrap;
          gap: 0.8rem;
          margin-bottom: 2rem;
        }

        .tech-tag {
          padding: 0.5rem 1rem;
          background: linear-gradient(135deg, rgba(15, 82, 186, 0.2), rgba(212, 175, 55, 0.2));
          border: 1px solid;
          border-image: linear-gradient(135deg, var(--sapphire-blue), var(--royal-gold)) 1;
          border-radius: 50px;
          color: var(--sapphire-blue);
          font-size: 0.9rem;
          font-weight: 500;
        }

        .project-links {
          display: flex;
          gap: 1.2rem;
        }

        .project-link {
          padding: 0.7rem 1.5rem;
          background: linear-gradient(135deg, var(--royal-gold), var(--sapphire-blue));
          color: white;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.3s;
          font-size: 0.9rem;
          position: relative;
          overflow: hidden;
        }

        .project-link:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(15, 82, 186, 0.4);
        }

        .project-hover-effect {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(15, 82, 186, 0.1));
          opacity: 0;
          transition: opacity 0.3s;
          z-index: -1;
        }

        .project-card:hover .project-hover-effect {
          opacity: 1;
        }

        /* Achievements Section */
        .achievements-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(330px, 1fr));
          gap: 2.5rem;
        }

        .achievement-card {
          background: linear-gradient(145deg, rgba(25, 25, 35, 0.7), rgba(18, 18, 28, 0.7));
          border-radius: 20px;
          padding: 2.5rem;
          text-align: center;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .achievement-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 5px;
          background: linear-gradient(to right, var(--amethyst-purple), var(--royal-gold));
        }

        .achievement-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .achievement-icon {
          font-size: 3.5rem;
          margin-bottom: 1.5rem;
          filter: drop-shadow(0 5px 10px rgba(0, 0, 0, 0.3));
        }

        .achievement-card h3 {
          color: var(--platinum);
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .achievement-card p {
          color: var(--silver);
          line-height: 1.7;
          font-size: 1.1rem;
        }

        .achievement-glow {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(153, 102, 204, 0.1), rgba(212, 175, 55, 0.1));
          opacity: 0;
          transition: opacity 0.3s;
          z-index: -1;
        }

        .achievement-card:hover .achievement-glow {
          opacity: 1;
        }

        /* Education Section */
        .education-timeline {
          position: relative;
          max-width: 900px;
          margin: 0 auto;
        }

        .education-timeline::before {
          content: '';
          position: absolute;
          left: 40px;
          top: 0;
          height: 100%;
          width: 3px;
          background: linear-gradient(to bottom, var(--royal-gold), var(--sapphire-blue));
          box-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
        }

        .timeline-item {
          display: flex;
          margin-bottom: 3rem;
          position: relative;
        }

        .timeline-date {
          min-width: 140px;
          padding: 0.8rem 1.2rem;
          background: linear-gradient(135deg, var(--royal-gold), var(--sapphire-blue));
          color: white;
          border-radius: 25px;
          font-weight: 600;
          text-align: center;
          margin-right: 2.5rem;
          height: fit-content;
          box-shadow: 0 5px 15px rgba(15, 82, 186, 0.3);
        }

        .timeline-content {
          background: linear-gradient(145deg, rgba(25, 25, 35, 0.7), rgba(18, 18, 28, 0.7));
          border-radius: 20px;
          padding: 2rem;
          flex: 1;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .timeline-content h3 {
          color: var(--platinum);
          margin-bottom: 0.8rem;
          font-size: 1.4rem;
          font-weight: 600;
        }

        .timeline-content p {
          color: var(--silver);
          margin-bottom: 0.8rem;
          font-size: 1.1rem;
        }

        .timeline-badge {
          padding: 0.5rem 1rem;
          background: linear-gradient(135deg, rgba(80, 200, 120, 0.2), rgba(153, 102, 204, 0.2));
          border: 1px solid;
          border-image: linear-gradient(135deg, var(--emerald-green), var(--amethyst-purple)) 1;
          border-radius: 50px;
          color: var(--emerald-green);
          font-size: 0.9rem;
          font-weight: 500;
        }

        /* Contact Section */
        .contact-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
        }

        .contact-info h3 {
          margin-bottom: 2rem;
          color: var(--platinum);
          font-size: 1.8rem;
          font-weight: 600;
        }

        .contact-info p {
          color: var(--silver);
          margin-bottom: 2.5rem;
          line-height: 1.7;
          font-size: 1.1rem;
        }

        .contact-details {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 1.2rem;
          padding: 1rem;
          background: linear-gradient(135deg, rgba(15, 82, 186, 0.1), rgba(212, 175, 55, 0.1));
          border-radius: 10px;
          backdrop-filter: blur(5px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .contact-icon {
          font-size: 1.5rem;
          color: var(--royal-gold);
        }

        .social-links {
          display: flex;
          gap: 2rem;
        }

        .social-link {
          padding: 0.7rem 0;
          position: relative;
          transition: all 0.3s;
          font-weight: 500;
        }

        .social-link:hover {
          color: var(--royal-gold);
        }

        .social-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--royal-gold);
          transition: width 0.3s;
        }

        .social-link:hover::after {
          width: 100%;
        }

        .form-group {
          margin-bottom: 2rem;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 1.2rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: var(--text-primary);
          font-family: inherit;
          transition: all 0.3s;
          backdrop-filter: blur(5px);
          font-size: 1rem;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--royal-gold);
          box-shadow: 0 0 15px rgba(212, 175, 55, 0.2);
        }

        .form-success {
          text-align: center;
          padding: 3rem 2rem;
          background: linear-gradient(135deg, rgba(80, 200, 120, 0.15), rgba(153, 102, 204, 0.15));
          border: 1px solid;
          border-image: linear-gradient(135deg, var(--emerald-green), var(--amethyst-purple)) 1;
          border-radius: 20px;
          backdrop-filter: blur(10px);
        }

        .success-icon {
          font-size: 3rem;
          color: var(--emerald-green);
          margin-bottom: 1.5rem;
          font-weight: bold;
        }

        .form-success h3 {
          color: var(--emerald-green);
          margin-bottom: 1rem;
          font-size: 1.5rem;
        }

        .form-success p {
          color: var(--silver);
          font-size: 1.1rem;
        }

        /* Footer */
        .footer {
          background: linear-gradient(135deg, rgba(10, 10, 10, 0.8), rgba(20, 20, 30, 0.8));
          padding: 3rem 0;
          text-align: center;
          backdrop-filter: blur(10px);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .copyright {
          color: var(--silver);
          font-size: 1rem;
        }

        /* Responsive Design */
        @media (max-width: 1100px) {
          .hero-content {
            flex-direction: column;
            text-align: center;
            gap: 4rem;
          }

          .hero-text {
            padding-right: 0;
          }

          .hero-tags, .hero-badges, .hero-buttons {
            justify-content: center;
          }

          .name {
            font-size: 3.8rem;
          }
        }

        @media (max-width: 900px) {
          .contact-content {
            grid-template-columns: 1fr;
            gap: 3rem;
          }

          .projects-grid {
            grid-template-columns: 1fr;
          }

          .achievements-container {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .hamburger {
            display: flex;
          }

          .nav-menu {
            position: fixed;
            left: -100%;
            top: 80px;
            flex-direction: column;
            background: linear-gradient(135deg, rgba(10, 10, 10, 0.95), rgba(20, 20, 30, 0.95));
            width: 100%;
            text-align: center;
            transition: 0.3s;
            box-shadow: 0 10px 27px rgba(0, 0, 0, 0.05);
            padding: 2.5rem 0;
            backdrop-filter: blur(10px);
          }

          .nav-menu.active {
            left: 0;
          }

          .nav-item {
            margin: 1.8rem 0;
          }

          .hamburger.active .bar:nth-child(2) {
            opacity: 0;
          }

          .hamburger.active .bar:nth-child(1) {
            transform: translateY(8px) rotate(45deg);
          }

          .hamburger.active .bar:nth-child(3) {
            transform: translateY(-8px) rotate(-45deg);
          }

          .name {
            font-size: 3.2rem;
          }

          .section-header h2 {
            font-size: 2.5rem;
          }

          .education-timeline::before {
            left: 30px;
          }

          .timeline-date {
            min-width: 120px;
            margin-right: 2rem;
          }
        }

        @media (max-width: 480px) {
          .hero-buttons {
            flex-direction: column;
          }

          .name {
            font-size: 2.8rem;
          }

          .floating-card {
            width: 280px;
            height: 340px;
          }

          .section-header h2 {
            font-size: 2.2rem;
          }

          .timeline-item {
            flex-direction: column;
            gap: 1rem;
          }

          .timeline-date {
            align-self: flex-start;
          }

          .education-timeline::before {
            left: 20px;
          }
        }
      `}</style>
    </div>
  );
}