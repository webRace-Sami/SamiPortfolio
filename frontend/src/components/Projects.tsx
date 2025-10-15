function Projects () {
    const projects = [
        {
            title: "E-Commerce Website",
            description: "Full-stack e-commerce plateform with MERN stack",
            // image: "src/components/images/sami.png",
            technologies: ["React", "Node.js", "MongoDB", "Express"],
            github: "",
            live: ""
        },
        {
            title: "Task Management App",
            description: "Full-stack e-commerce plateform with MERN stack",
            // image: "src/components/sami.png",
            technologies: ["React", "Node.js", "MongoDB", "Express"],
            github: "",
            live: ""
        },
        {
            title: "Portfolio Website",
            description: "Full-stack e-commerce plateform with MERN stack",
            // image: "src/components/sami.png",
            technologies: ["React", "Node.js", "MongoDB", "Express"],
            github: "",
            live: ""
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