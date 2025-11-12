# Gazeta CNVA

Gazeta CNVA is a web platform built for publishing and managing online articles, texts, and updates for "Vasile Alecsandri" National College, Galati magazine.  
The project is implemented as a **React.js single-page application**, using **Firebase** for backend services and hosted on **Cloudflare Pages** with a custom `.ro` domain.

**Live site:** [https://gazetacnva.ro](https://gazetacnva.ro)

---

## Overview

Gazeta CNVA is designed as a modern, fast, and scalable website that allows dynamic content updates and user authentication.  
It provides a responsive layout and integrates Firebase for real-time content management.

### Main site sections:
- **Home** – Landing page and latest content highlights  
- **About Us** – Information about the project and contributors  
- **Texts** – Collection of articles, stories, and poems stored in Firebase  
- **Contact** – Contact form and submission functionality  

---

## Technologies Used

### Frontend
- **React.js** – Component-based UI framework for building fast and dynamic interfaces  
- **HTML5 / CSS3 / JavaScript (ES6)** – Core web technologies  
- **Node.js & npm** – Used for dependency management and local development environment  

### Backend & Database
- **Firebase Realtime Database** – Stores and retrieves dynamic content such as articles, text entries, and metadata in real time  
- **Firebase Authentication** – Handles secure admin login for content management and publishing  

### Deployment
- **Cloudflare Pages** – Used for static site deployment and global CDN distribution  
- **RoTLD (.ro)** – Domain registrar for the live domain [gazetacnva.ro](https://gazetacnva.ro)  

---

## Installation and Setup

Follow the steps below to set up and run the project locally.

### 1. Clone the repository
```bash
git clone https://github.com/imm1h01/gazeta-cnva.git
```

### 2. Navigate to the project directory
```bash
cd gazeta-cnva
```

### 3. Install dependencies
```bash
npm install
```

### 4. Configure Firebase
Create a `.env` file in the project root directory and add your Firebase credentials:

```bash
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_DATABASE_URL=your_database_url
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

> Make sure not to expose your Firebase credentials publicly.

### 5. Run the development server
```bash
npm start
```
The app will run locally at [http://localhost:3000](http://localhost:3000).
After running the development server (npm start), the app will be accessible at http://localhost:3000. You can navigate the site to read articles, and any changes you make to the source code will live-reload in the browser.

### 6. Build the production version
```bash
npm run build
```
This command creates an optimized production build in the `build/` folder, ready for deployment.

---

## Deployment

The production build is deployed via **Cloudflare Pages**.

**Deployment configuration:**
- **Build command:** `npm run build`  
- **Output directory:** `build`  

DNS management and the live domain **gazetacnva.ro** are handled via **RoTLD**.

The live site is available at:  
[https://gazetacnva.ro](https://gazetacnva.ro)

---

## Project Structure

```
gazeta-cnva/
├── public/                # Static assets and HTML template
├── src/
│   ├── components/        # Reusable React components
│   ├── pages/             # Main site pages (Home, About, Texts, Contact)
│   ├── firebase.js        # Firebase configuration and initialization
│   ├── App.js             # Main React app entry point
│   └── index.js           # Root render file
├── .env.example           # Example environment variables (Firebase config)
├── package.json           # Project metadata and dependencies
└── README.md              # Documentation
```

---

## Firebase Integration

This project uses **Firebase Realtime Database** to dynamically store and serve text content.  
Each article or text entry is saved as a JSON object and retrieved in real time when the page loads.

Firebase Authentication is used for secure admin access. Only verified users can log in to the admin dashboard and perform create/update/delete actions on the database.

**Firebase services used:**
- Realtime Database  
- Authentication  
- Hosting (optional for testing)  

---

## License

All rights reserved © 2025.  
This project is developed and maintained by Mihai Condrici in partnership with the Gazeta CNVA management team.

---
