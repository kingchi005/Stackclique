"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../../prisma"));
const inputSchema_1 = require("../zodSchema/inputSchema");
const router = (0, express_1.Router)();
// GET /user
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const { id } = req.params;
    try {
        const users = yield prisma_1.default.user.findMany({
            where: {},
            select: { id: true, username: true, email: true },
        });
        res
            .status(200)
            .json({ ok: true, data: users });
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}));
// GET /user/:id
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = inputSchema_1.userInputSchema.safeParse(+req.params.id);
    // return console.log(JSON.stringify(data, null, 2));
    if (!data.success)
        return res.status(201).json({
            ok: false,
            error: { message: data.error.issues[0].message, details: data.error },
        });
    try {
        const user = yield prisma_1.default.user.findUnique({
            where: { id: data.data },
            select: { id: true, username: true, email: true },
        });
        if (!user) {
            res.status(404).json({
                ok: false,
                error: { message: "User not found" },
            });
        }
        else {
            res
                .status(200)
                .json({ ok: true, data: user });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            error: { message: "An error occoured" },
        });
    }
}));
// POST /user
// router.post("/", async (req: Request, res: Response) => {
// 	const safe = createUserSchema.safeParse(req.body);
// 	if (!safe.success)
// 		return res.status(201).json(<ErrorResponse<any>>{
// 			ok: false,
// 			error: { message: safe.error.issues[0].message, details: safe.error },
// 		});
// 	const { username, email } = safe.data;
// 	try {
// 		const user = await prisma.user.create({
// 			data: {
// 				username,
// 				email,
// 			},
// 		});
// 		res.status(201).json(<SuccessResponse<typeof safe.data>>{
// 			ok: true,
// 			message: "user created successfully",
// 			data: user,
// 		});
// 	} catch (error) {
// 		console.error(error);
// 		res.status(500).json(<ErrorResponse<typeof error>>{
// 			ok: true,
// 			error: { message: "An error occoured", details: error },
// 		});
// 	}
// });
// PUT /user/:id
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { username, email } = req.body;
    try {
        const user = yield prisma_1.default.user.update({
            where: {
                id: id,
            },
            data: {
                username,
                email,
            },
        });
        res.status(200).json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}));
// DELETE /user/:id
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma_1.default.user.delete({
            where: {
                id: id,
            },
        });
        res.status(204).send();
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}));
exports.default = router;
//# sourceMappingURL=user.js.map