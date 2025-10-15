function Skills () {
    const skills = [
        { name : 'MongoDB', level: 60},
        { name : 'Exoress', level: 50},
        { name : 'React', level: 70},
        { name : 'Node.js', level: 55},
        { name : 'Typescript', level: 65},
        { name : 'CSS', level: 75}


    ];

   return (
    <section id="skills" className="skills-section">
      <div className="skills-container">
        <h2>My Skills</h2>
        <p className="skills-intro">
          Here are the technologies I work with:
        </p>
        
        <div className="skills-grid">
          {skills.map((skill, index) => (
            <div key={index} className="skill-item">
              <span className="skill-name">{skill.name}</span>
              <div className="skill-bar">
                <div 
                  className="skill-progress" 
                  style={{ width: `${skill.level}%` }}
                >
                  <span className="skill-percentage">{skill.level}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;