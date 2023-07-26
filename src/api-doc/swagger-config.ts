import swaggerConfigJson from "./swaggerConfig.json";
import env from "../../env";

swaggerConfigJson.servers[0].url = env.BASE_URL;

export default swaggerConfigJson;
