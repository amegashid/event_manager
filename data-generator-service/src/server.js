import 'dotenv/config';

import app from './app.js'; 

SERVER_PORT = process.env.SERVER_PORT || 3000;

app.listen(SERVER_PORT, () => {
  console.log(`Data generator service is running on port ${SERVER_PORT}`);
});