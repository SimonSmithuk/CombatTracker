# D&D Combat Tracker

A real-time web application designed to help Dungeon Masters (DMs) manage Dungeons & Dragons combat encounters. DMs can create games, and players can join using a unique code to manage their character stats like HP, AC, and status effects. The DM has a complete overview and control over the battlefield, with all changes synchronized in real-time across all connected devices.

## Features

- **DM View**:
    - Create a unique, 6-character game room code.
    - View and manage all characters in the encounter.
    - Adjust character Hit Points (HP), Temporary HP, and add/remove status conditions.
    - Control the flow of combat: start/end combat, advance turns, and sort participants by initiative.
    - Manually re-order characters via drag-and-drop.
- **Player View**:
    - Join an existing game using a game code.
    - Create a character with a name, armor class, HP, and initiative.
    - View their own character sheet with real-time updates from the DM.
    - Edit their character's core stats (AC, Max HP, Initiative).
- **Real-Time Synchronization**:
    - All changes are instantly broadcast to the DM and relevant players using WebSockets, ensuring everyone sees the same game state.
- **Configurable Backend**:
    - The application prompts for a server URL on startup, allowing users to host the backend on any server and connect to it easily.

## Technology Stack

- **Frontend**:
    - **React**: For building the user interface.
    - **TypeScript**: For type safety and improved developer experience.
    - **Tailwind CSS**: For rapid, utility-first styling.
- **Backend**:
    - **Node.js**: As the JavaScript runtime environment.
    - **Express**: For creating the simple REST API endpoints (`/create`, `/game/:id`).
    - **ws (WebSockets)**: For enabling real-time, bidirectional communication between the server and clients.

## Getting Started

To run this application, you need to start both the backend server and the frontend client.

### Prerequisites

- [Node.js](https://nodejs.org/) and npm (which comes with Node.js) installed on your machine.

### 1. Backend Setup

The backend server handles game state and WebSocket connections.

1.  **Save the Server Code**: Make sure the code from `server.ts` is saved in your project directory.

2.  **Install Dependencies**: Open your terminal in the project directory and run the following command to install the necessary Node.js packages:
    ```bash
    npm install express ws typescript ts-node @types/express @types/ws
    ```

3.  **Start the Server**: Run the following command in the same terminal:
    ```bash
    ts-node server.ts
    ```

4.  **Confirmation**: If successful, you should see a message indicating the server is running, typically:
    ```
    Server is listening on http://localhost:8080
    ```
    The server is now ready and waiting for connections.

### 2. Frontend Setup

The frontend is a React application that runs in the browser.

1.  **Open the Application**: Simply open the `index.html` file in a modern web browser (like Chrome, Firefox, or Edge).

2.  **Connect to the Server**:
    - The first screen you see will be the "Connect to Server" page.
    - In the "Server URL" input field, enter the address of the backend server you started in the previous step. If you are running it on the same machine, the default URL is:
      ```
      http://localhost:8080
      ```
    - Click **Connect**.

### 3. How to Play

1.  **DM Creates a Game**: On the home screen, the DM clicks "Create New Game". This will take them to the DM View and display a unique 6-character game code.

2.  **Players Join**: Players open the app, connect to the same server, and use the "Join an Existing Game" form. They enter the game code provided by the DM and click "Join Game".

3.  **Players Create Characters**: Each player will be prompted to create their character. Once created, the character will appear on both the player's screen and the DM's screen.

4.  **Start Combat**: The DM can now manage the encounter, and all changes will be reflected in real-time for the players.
