import { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5001/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Check if response is OK first
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Then try to parse JSON
      const result = await response.json();
      
      if (result.success) {
        alert('Message sent successfully!');
        // Clear form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        alert(result.message || 'Failed to send message.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to send message. Please check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        <h2>Contact Me</h2>
        <p className="contact-intro">
          Get in touch with me for opportunities or just to say hello!
        </p>
        
        <div className="contact-content">
          <div className="contact-info">
            <h3>Let's Connect</h3>
            <div className="contact-item">
              <strong>Email:</strong>
              <span>your.email@example.com</span>
            </div>
            <div className="contact-item">
              <strong>Phone:</strong>
              <span>+123 456 7890</span>
            </div>
            <div className="contact-item">
              <strong>Location:</strong>
              <span>Your City, Country</span>
            </div>
            
            <div className="social-links">
              <a href="#" className="social-link">GitHub</a>
              <a href="#" className="social-link">LinkedIn</a>
              <a href="#" className="social-link">Twitter</a>
            </div>
          </div>
          
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name" 
                className="form-input"
                required 
              />
            </div>
            <div className="form-group">
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email" 
                className="form-input"
                required 
              />
            </div>
            <div className="form-group">
              <input 
                type="text" 
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject" 
                className="form-input"
                required 
              />
            </div>
            <div className="form-group">
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message" 
                className="form-textarea"
                rows={5}
                required
              ></textarea>
            </div>
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;