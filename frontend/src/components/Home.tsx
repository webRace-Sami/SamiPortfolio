import SamiImg from './images/sami.png'

function Home () {
  return (
   <section id="home" className="home-section">
    <div className="home-container">
    <div className="home-content">
        <h1>Hi, I'm SAMI ULLAH</h1>
        <h2>Full Stack Developer</h2>
        <p className="tagline">
          Building <strong>fast and modern</strong> web applications using <strong>MERN stack</strong>,
          <strong>TypeScript</strong> and powered by <strong>Vite</strong> for lightening-fast development.
        </p>

        <div className="cta-buttons">
          <a href="#projects" className="btn btn-primary">View Projects</a>
          <a href="#contact" className="btn btn-secondary">Contact Me</a>
        </div>

        <div className="teck-stack-icons">
          <span>MongoDB</span>
          <span>Express</span>
          <span>React</span>
          <span>Node.js</span>
          <span>TypeScript</span>
          <span>Vite</span>
        </div>

        <div className="social-links">
          <a href="https://github.com/yourusername" className="social-btn" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://linkedin.com/in/yourusername" className="social-btn" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
        </div>

        <div className="home-image">
          <img src={SamiImg} alt="Sami Ullah" />
        </div>
    </div>
   </section>
  )
}

export default Home;