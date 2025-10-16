import SamiImg from './images/sami.png'

function About () {
    return (
        <section id="about" className="about-section">
            <div className="about-container">
                <div className="about-content">
                    <h2>About Me</h2>

                    <div className="about-image">
                        <img src={SamiImg} alt="About Me" />
                    </div>

                    <p className="about-text">
                        I'm a passionate Full Stack Developer specializing in the MERN stack 
                        with Typescript.
                        I love creating efficient, scalable and user-friendly web applications.
                    </p>

                    <p className="about-passion">
                        I'm constantly learning new technologies and improving my skills.
                        I'm contributing to open source, or working on personal projects.
                    </p>
                </div>
                
            </div>
        </section>
    );
}

export default About;