# Sami Ullah — Developer Portfolio

# Portfolio
# MERN app 
# MongoDB | Express JS | React JS(Vite) | Node JS | Typescript | CSS 


# Goal: Portfolio App 

Steps: 

Phase 1: 
1.  Create Project Folder

In main folder create two folder with terminal: mkdir ‘folder-name’ frontend and backend 

2. Then cd backend
3. In terminal “npm init -y” (keep in mind nodeJs must be installed if not then search on browser to install) This will create package.json file in backend folder.
4. Dependencies : Now in terminal “npm install express mongoose cors dotenv”.  Express : web server framework Mongoose: to connect to your mongoDB database cors: allows frontend to talk to the backend. Dotenv: to hide your database password
5. “npm install -D nodemon typescript @types/node @types/express ts-node”
6. Create server.ts file in backend then import all dependencies
7. Create .env file in backend to connect with MongoDB
8. SMTP added and Resend integration (replaced Nodemailer)

10. Npm create vite@latest frontend — —template react-ts    “this will create frontend and react project with Typescript”
11. Install dependencies in frontend by “npm install”
12. Npm run dev in frontend.
13. Npm start for backend
14. Create Component folder in src and then create component files like:Home.tsx, about, skills, education and contact etc. in tsx
15. Then call them in App.tsx in src in this way <Home /> and so on… 
16. All Components are created and called in App.tsx
17. Contact.tsx “Contact Form ” is active to receive the Mail on gmail

Problems: 
I faced problems when created contact form active for mail. 
Here is used Resend and install by “npm install resend" (set RESEND_API_KEY in env)

