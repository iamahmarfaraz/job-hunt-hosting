

# Job Hunt Hosting

Job Hunt Hosting is a full-stack job portal application that allows recruiters to post jobs and manage companies while students can search, apply, and interact with job posts and blogs. The application features robust user authentication, company management, job posting and application features, a blog section with contribution tracking, and real-time caching using Redis.

---

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Folder Structure](#folder-structure)
- [API Routes](#api-routes)
  - [User Routes](#user-routes)
  - [Job Routes](#job-routes)
  - [Company Routes](#company-routes)
  - [Blog Routes](#blog-routes)
  - [Application Routes](#application-routes)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Additional Notes](#additional-notes)
- [License](#license)

---

## Features

- **User Authentication:** Registration, login, logout, profile update (with file upload for profile picture and resume) and account deletion.
- **Job Posting & Applications:** Recruiters can post, update, and delete jobs. Students can view jobs and apply. Jobs and applications are cached using Redis.
- **Company Management:** Recruiters can register, update, and delete companies. Deleting a company also removes all associated jobs and job applications.
- **Blog Section:** Users can create, update, delete, like/unlike blogs. Top contributors are displayed.
- **Admin Panel:** Admin views to manage jobs, companies, and blog contributions.
- **Redis Caching:** Frequently accessed data such as job details, companies, and blogs are cached for improved performance.
- **Responsive UI:** The frontend is built with React and Tailwind CSS ensuring a responsive design across devices.

---

## Technologies Used

- **Frontend:** React, Vite, Tailwind CSS, Framer Motion, React Router DOM
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, Redis (ioredis), Multer (for file uploads)
- **Authentication:** JWT, bcrypt
- **Email Service:** Nodemailer with custom email templates
- **Deployment:** Render (or your chosen hosting provider)

---

## Folder Structure

```
job-hunt-hosting/
│
├── server/                     # Express backend
│   ├── controllers/            # Controllers for handling business logic
│   │   ├── user.controller.js
│   │   ├── job.controller.js
│   │   ├── company.controller.js
│   │   ├── blog.controller.js
│   │   └── application.controller.js
│   │
│   ├── models/                 # Mongoose models
│   │   ├── user.model.js
│   │   ├── job.model.js
│   │   ├── company.model.js
│   │   ├── blog.model.js
│   │   └── application.model.js
│   │
│   ├── middlewares/            # Custom middlewares (authentication, multer, etc.)
│   │   ├── isAuthenticated.js
│   │   ├── mutler.js
│   │   └── ...
│   │
│   ├── routes/                 # API route definitions
│   │   ├── user.route.js
│   │   ├── job.route.js
│   │   ├── company.route.js
│   │   ├── blog.route.js
│   │   └── application.route.js
│   │
│   ├── config/                 # Configuration files (DB, Redis, Cloudinary)
│   │   ├── db.js
│   │   ├── redis.js
│   │   └── cloudinary.js
│   │
│   ├── utils/                  # Utility functions (data URI conversion, mailSender, etc.)
│   │   ├── datauri.js
│   │   └── mailSender.js
│   │
│   ├── mail/                   # Email templates
│   │   └── singupTemp.js
│   │
│   └── index.js                # Backend server entry point
│
├── src/                        # Frontend code (React)
│   ├── assets/                 # Static assets (images, logos)
│   ├── components/             # React components (Navbar, JobDescription, Profile, etc.)
│   ├── hooks/                  # Custom React hooks
│   ├── redux/                  # Redux slices and store configuration
│   ├── ui/                     # Reusable UI components (Input, Button, Table, etc.)
│   ├── App.jsx                 # Main app component
│   └── index.jsx               # Frontend entry point
│
├── .env                        # Environment variables for development (and server-specific .env if needed)
├── package.json                # NPM package configuration
├── README.md                   # This file
└── ...                         # Additional configuration files (Vite, ESLint, etc.)
```

---

## API Routes

### User Routes

- **POST** `/api/v1/users/register`  
  - Registers a new user with file upload support (profile picture/resume).  
  - _Middleware: `singleUpload`_

- **POST** `/api/v1/users/login`  
  - Authenticates a user and returns a JWT token.

- **GET** `/api/v1/users/logout`  
  - Logs out the user by clearing the JWT cookie.

- **POST** `/api/v1/users/profile/update`  
  - Updates the user's profile information (bio, skills, etc.) and resume.  
  - _Middleware: `isAuthenticated`, `singleUpload`_

- **POST** `/api/v1/users/profile/updatepfp`  
  - Updates the user's profile picture.  
  - _Middleware: `isAuthenticated`, `singleUpload`_

- **DELETE** `/api/v1/users/delete-account`  
  - Deletes the user account along with all associated data.

### Job Routes

- **POST** `/api/v1/jobs/post`  
  - Creates a new job posting (only accessible by recruiters).  
  - _Middleware: `isAuthenticated`, `isRecruiter`_

- **GET** `/api/v1/jobs/get`  
  - Retrieves all job postings.

- **GET** `/api/v1/jobs/getadminjobs`  
  - Retrieves jobs posted by the logged-in recruiter (admin view).  
  - _Middleware: `isAuthenticated`, `isRecruiter`_

- **GET** `/api/v1/jobs/get/:id`  
  - Retrieves job details by ID.  
  - _Middleware: `isAuthenticated`_

- **PUT** `/api/v1/jobs/update-job/:id`  
  - Updates an existing job posting.  
  - _Middleware: `isAuthenticated`, `isRecruiter`_

### Company Routes

- **POST** `/api/v1/companies/register`  
  - Registers a new company (only accessible by recruiters).  
  - _Middleware: `isAuthenticated`, `isRecruiter`_

- **GET** `/api/v1/companies/get`  
  - Retrieves companies for the logged-in recruiter.  
  - _Middleware: `isAuthenticated`, `isRecruiter`_

- **GET** `/api/v1/companies/get/:id`  
  - Retrieves a single company by ID.  
  - _Middleware: `isAuthenticated`_

- **PUT** `/api/v1/companies/update/:id`  
  - Updates company details (supports file upload for logo).  
  - _Middleware: `isAuthenticated`, `isRecruiter`, `singleUpload`_

- **DELETE** `/api/v1/companies/company/:companyId`  
  - Deletes a company and all associated jobs and applications.  
  - _Middleware: `isAuthenticated`, `isRecruiter`_

### Blog Routes

- **POST** `/api/v1/blogs/createBlog`  
  - Creates a new blog post.  
  - _Middleware: `isAuthenticated`, `singleUpload`_

- **GET** `/api/v1/blogs/allBlog`  
  - Retrieves all blog posts.  
  - _Middleware: `isAuthenticated`_

- **POST** `/api/v1/blogs/likeBlog`  
  - Likes a blog post.  
  - _Middleware: `isAuthenticated`_

- **POST** `/api/v1/blogs/unlikeBlog`  
  - Unlikes a blog post.  
  - _Middleware: `isAuthenticated`_

- **PUT** `/api/v1/blogs/updateBlog`  
  - Updates an existing blog post.  
  - _Middleware: `isAuthenticated`, `singleUpload`_

- **DELETE** `/api/v1/blogs/deleteBlog`  
  - Deletes a blog post.  
  - _Middleware: `isAuthenticated`_

- **GET** `/api/v1/blogs/top-contributors`  
  - Retrieves the top 5 blog contributors.  
  - _Middleware: `isAuthenticated`_

### Application Routes

- **GET** `/api/v1/applications/apply/:id`  
  - Allows a student to apply for a job.  
  - _Middleware: `isAuthenticated`, `isStudent`_

- **GET** `/api/v1/applications/get`  
  - Retrieves jobs applied by the logged-in student.  
  - _Middleware: `isAuthenticated`, `isStudent`_

- **GET** `/api/v1/applications/:id/applicants`  
  - Retrieves applicants for a specific job (for recruiters).  
  - _Middleware: `isAuthenticated`, `isRecruiter`_

- **POST** `/api/v1/applications/status/:id/update`  
  - Updates the status of a job application (e.g., shortlisting).  
  - _Middleware: `isAuthenticated`, `isRecruiter`_

---

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/iamahmarfaraz/job-hunt-hosting.git
   cd job-hunt-hosting
   ```

2. **Install backend dependencies:**

   ```bash
   npm install
   cd server
   npm install
   ```

3. **Install frontend dependencies:**

   ```bash
   cd ../src
   npm install
   ```

4. **Set up environment variables:**

   Create a `.env` file in the root (and in the `server` folder if needed) with the following variables:

   ```env
   PORT=8000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   REDIS_HOST=your_redis_host             # e.g., redis-12345.c12.us-east-1-2.ec2.cloud.redislabs.com (if using a managed Redis service)
   REDIS_PORT=your_redis_port             # e.g., 12345
   REDIS_PASSWORD=your_redis_password
   ```

5. **Run the development servers:**

   For the backend:

   ```bash
   cd server
   npm run dev
   ```

   For the frontend:

   ```bash
   cd ../src
   npm run dev
   ```

---

## Deployment

This project is deployed on Render (or your preferred hosting platform). Ensure that your environment variables are correctly set on your hosting provider.

---

## Additional Notes

- **Redis Caching:** The backend uses Redis for caching frequently accessed data (jobs, companies, blogs). Update your Redis connection details in the environment variables.
- **File Uploads:** File uploads (for profile pictures, resumes, logos, etc.) are handled using Multer with memory storage.
- **Responsive UI:** The frontend is built with React and Tailwind CSS to provide a responsive experience across various devices.
- **Security:** Authentication and role-based access control (using JWT, bcrypt, and Express middlewares) secure the API routes.

---

## License

This project is licensed under the MIT License.

---

## GitHub Repository

For more details, source code, and contributions, please visit our [GitHub Repository](https://github.com/iamahmarfaraz/job-hunt-hosting).

Happy coding and good luck with your job hunt!



