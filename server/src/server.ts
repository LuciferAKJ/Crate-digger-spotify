import { createApp } from './infrastructure/http/createApp.js';
import { env } from './infrastructure/config/env.js';

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`Crate Digger API listening on http://localhost:${env.PORT} [${env.NODE_ENV}]`);
});
