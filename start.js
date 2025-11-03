// start.js
// This script allows running the TypeScript server directly with Node.js
// by registering ts-node's runtime transpiler.
console.log("Starting D&D Combat Tracker server...");

try {
  // Ensure local dependencies are installed by checking if ts-node is available
  require.resolve('ts-node');
} catch (error) {
  console.error("Dependencies are not installed. Please run 'npm install' first.");
  process.exit(1);
}

try {
  require('ts-node').register();
  require('./server.ts');
} catch (error) {
  console.error("\nAn error occurred while starting the server:");
  console.error(error);
  process.exit(1);
}
