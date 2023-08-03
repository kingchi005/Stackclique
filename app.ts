import env from "./env";
import app from "./src/server";
const PORT = +env.PORT;

app.listen(PORT, async () => {
	console.log(`Server running on port ${PORT}`);
	// await prisma.$connect();
});
