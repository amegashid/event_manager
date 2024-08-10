import app from './app.js';
import './models/event/event.js'

const EVENT_MANAGER_SERVICE_PORT = process.env.EVENT_MANAGER_SERVICE_PORT || 4000;
app.listen(EVENT_MANAGER_SERVICE_PORT, () => {
  console.log(`Event manager server is running on port ${EVENT_MANAGER_SERVICE_PORT}`);
});