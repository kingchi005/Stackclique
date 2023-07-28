import swaggerConfigJson from "./swaggerConfig.json";
import env from "../../env";

swaggerConfigJson.servers[0].url = env.BASE_URL;

// Susspending the user sign up with phone function routes

swaggerConfigJson.paths["/auth/get-sms-otp/{phone_numebr}"] =
	{} as (typeof swaggerConfigJson.paths)["/auth/get-sms-otp/{phone_numebr}"];

swaggerConfigJson.paths["/auth/signup-phone"] =
	{} as (typeof swaggerConfigJson.paths)["/auth/signup-phone"];

export default swaggerConfigJson;
