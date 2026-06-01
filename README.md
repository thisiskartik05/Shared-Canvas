SyncBoard
SyncBoard is a full-stack, real-time collaborative whiteboard and communication platform built on a WebSocket infrastructure. Designed for seamless brainstorming and remote teamwork, it enables multiple authenticated users to draw, chat, and manage shared canvas states instantly in isolated room sessions.

🚀 Live Demo
Experience the live application deployed on Render: syncboard-ualb.onrender.com

(Note: Free-tier instances spin down during periods of inactivity; the initial link load may take 30–50 seconds to wake up the server).

✨ Features
Collaborative Whiteboard: A low-latency shared virtual canvas allowing concurrent users to draw, annotate, and customize brush color/thickness simultaneously.

Multiplayer Undo Protocol: A stack-based canvas history manager supporting Ctrl + Z shortcuts that safely removes local actions without impacting concurrent peers.

Global State Synchronization: An automated fallback protocol that captures localized base64 canvas snapshots and broadcasts force-sync state updates to eliminate multi-client drawing drift.

Real-Time Room Chat: An integrated sidebar messaging panel driving instant group communication right alongside the canvas layout.

Secure Authentication: Complete user onboarding flow featuring passport-driven registration, hashed credential logins, and secure express-session management.

🛠️ Tech Stack
Frontend: EJS (Embedded JavaScript templates), CSS3, Vanilla JavaScript, Bootstrap 4

Backend: Node.js, Express.js, Socket.io (WebSockets Architecture)

Database: MongoDB (Mongoose ODM)

Deployment: Render Cloud Platform

📦 Getting Started
1. Clone the Repository
Bash
git clone https://github.com/thisiskartik05/SyncBoard.git
cd SyncBoard
2. Install Dependencies
Bash
npm install
3. Set Up Environment Variables
Create a file named .env in the root of the project directory and supply your connection strings:

Code snippet
MONGO_URI=your_mongodb_atlas_connection_string
SESSION_SECRET=your_random_express_session_secret
PORT=3000
4. Launch the Application
To boot up the production-ready server instance local pipeline:

Bash
npm start
Open http://localhost:3000 in your browser to interact with the environment.

🤝 Contributing
Contributions, issue reports, and feature requests are welcome! Feel free to fork this repository, make adjustments, and submit a pull request.
