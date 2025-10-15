function Education() {
  const education = [
    {
      degree: "Bachelor of Computer Science",
      school: "Virtual University of Pakistan",
      year: "2022 - 2026",
      description: "Specialized in Web Development",
      grade: "CGPA: 2.37/4.0"
    },
    {
      degree: "Intermediate (FSC)",
      school: "Govt. Post Graduate College HafizAbad",
      year: "2018 - 2020",
      description: "Pre-Engineering",
      grade: "Grade: A+"
    },
    {
      degree: "Matriculation",
      school: "School Name", 
      year: "2016 - 2018",
      description: "Science Group with Computer",
      grade: "Grade: A+"
    }
  ];

  return (
    <section id="education" className="education-section">
      <div className="education-container">
        <h2>My Journey</h2>
        <p className="education-intro">
          My academic background and qualifications:
        </p>
        
        <div className="education-timeline">
          {education.map((edu, index) => (
            <div key={index} className="education-item">
              <div className="education-content">
                <h3 className="degree">{edu.degree}</h3>
                <p className="school">{edu.school}</p>
                <p className="year">{edu.year}</p>
                <p className="description">{edu.description}</p>
                <span className="grade">{edu.grade}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Education;