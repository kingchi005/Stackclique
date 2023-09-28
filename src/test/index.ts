import bcrypt from "bcrypt";
import test1 from "./inputSchema.test";
import test2 from "./prismaQuery.test";
// test1();
// test2();
(async () => {
	const salt = bcrypt.genSaltSync(10);
	const hashedPassword = await bcrypt.hashSync("password", salt);
	console.log(hashedPassword);
})();
