function Projects () {
    const projects = [
        {
            title: "Portfolio Website",
            description: "Full-stack e-commerce plateform with MERN stack",
            // image: "src/components/sami.png",
            technologies: ["React", "Node.js", "MongoDB", "Express", "TypeScript", "Vite"],
            github: "https://github.com/webRace-Sami/SamiPortfolio",
            live: "https://sami-portfolio-nine.vercel.app"
        },
        {
            title: "Portfolio Website",
            description: "Full-stack e-commerce plateform with MERN stack",
            // image: "src/components/sami.png",
            technologies: ["React", "Node.js", "MongoDB", "Express", "TypeScript", "Vite"],
            github: "https://github.com/webRace-Sami/SamiPortfolio",
            live: "https://sami-portfolio-nine.vercel.app"
        },
        {
            title: "Portfolio Website",
            description: "Full-stack e-commerce plateform with MERN stack",
            // image: "src/components/sami.png",
            technologies: ["React", "Node.js", "MongoDB", "Express", "TypeScript", "Vite"],
            github: "https://github.com/webRace-Sami/SamiPortfolio",
            live: "https://sami-portfolio-nine.vercel.app"
        }
    ];

    return (
        <section id="projects" className="projects-section">
            <div className="projects-container">
                <h2>My Projects</h2>
                <p className="projects-intro">
                    Here are some of my recent works:
                </p>

                <div className="projects grid">
                    {projects.map((project, index) => (
                        <div key={index} className="project-card-wrapper">
                            <div className="project-content">
                                <h3 className="project-title">{project.title}</h3>
                                <p className="project-description">{project.description}</p>

                                <div className="project-links">
                                    <a href={project.github} className="project-link github" target="_blank" rel="noopener noreferrer">
                                        GitHub
                                    </a>
                                    <a href={project.live} className="project-link live" target="_blank" rel="noopener noreferrer">
                                        Live Demo
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Projects;