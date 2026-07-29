import app from "./app.ts";
import { env } from "./config/env.config.ts";

app.listen(env.PORT, () => {
  console.info(`Server running on PORT ${env.PORT}`);
});
