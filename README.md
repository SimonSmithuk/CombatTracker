# D&D Combat Tracker

A real-time web application designed to help Dungeon Masters (DMs) manage Dungeons & Dragons combat encounters. DMs can create games, and players can join using a unique code to manage their character stats like HP, AC, and status effects. The DM has a complete overview and control over the battlefield, with all changes synchronized in real-time across all connected devices.

## Features

- **DM View**:
    - Create a unique, 6-character game room code.
    - View and manage all characters in the encounter.
    - Adjust character Hit Points (HP), Temporary HP, and add/remove status conditions.
    - Control the flow of combat: start/end combat, advance turns, and sort participants by initiative.
    - Manually re-order characters via drag-and-drop.
    - Configure the real-time sync interval for the game session.
- **Player View**:
    - Join an existing game using a game code.
    - Create a character with a name, armor class, HP, and initiative.
    - View their own character sheet with real-time updates from the DM.
    - Edit their character's core stats (AC, Max HP, Initiative).
- **Real-Time Synchronization**:
    - All changes are broadcast to the DM and players using WebSockets, ensuring everyone sees the same game state. The server also periodically pushes the full game state to ensure consistency.

## Technology Stack

- **Frontend**:
    - **React**: For building the user interface.
    - **TypeScript**: For type safety and improved developer experience.
    - **Tailwind CSS**: For rapid, utility-first styling.
    - **React Router**: For client-side navigation.
- **Backend**:
    - **Node.js**: As the JavaScript runtime environment.
    - **Express**: For the API and serving the frontend application.
    - **ws (WebSockets)**: For enabling real-time, bidirectional communication between the server and clients.

## Getting Started

To run this application, you only need to run the server, which handles both the backend logic and serves the frontend client.

### Prerequisites

- [Node.js](https://nodejs.org/) and npm (which comes with Node.js) installed on your machine.

### Installation and Running the App

1.  **Install Dependencies**: Open your terminal in the project's root directory and run the following command to install the necessary Node.js packages:
    ```bash
    npm install express ws typescript ts-node @types/express @types/ws
    ```

2.  **Start the Server**: Run the following command in the same terminal. This will compile and run the server, which also serves all the necessary frontend files.
    ```bash
    ts-node server.ts
    ```

3.  **Confirmation**: If successful, you should see a message indicating the server is running:
    ```
    Server is listening on http://localhost:8080
    ```
    The application is now running.

4.  **Access the Application**: Open a web browser (like Chrome, Firefox, or Edge) and navigate to the server's address. If you're running it locally, the URL is:
    ```
    http://localhost:8080
    ```

5.  **Connect the Client**:
    - The first screen you see will be the "Connect to Server" page.
    - The input field will be pre-filled with `http://localhost:8080`. Keep this value if you're running the server locally. Otherwise, enter the URL where your server is hosted.
    - Click **Connect**.

You will now be on the application's home screen, ready to create or join a game.

### How to Play

1.  **DM Creates a Game**: On the home screen, the DM clicks "Create New Game". This will take them to the DM View and display a unique 6-character game code.

2.  **Players Join**: Players navigate to the same URL, connect to the server, and use the "Join an Existing Game" form. They enter the game code provided by the DM and click "Join Game".

3.  **Players Create Characters**: Each player will be prompted to create their character. Once created, the character will appear on both the player's screen and the DM's screen.

4.  **Start Combat**: The DM can now manage the encounter, and all changes will be reflected in real-time for the players.
