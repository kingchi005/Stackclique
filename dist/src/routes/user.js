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
const router = (0, express_1.Router)();
// GET /user
// router.get("/", async (req: Request, res: Response) => {
// 	// const { id } = req.params;
// 	try {
// 		const users = {
// 			name: "Theodore King",
// 			email: "rem@se.ua",
// 			phoneId: "08107721911",
// 			address: "U6FFAGTEgp2xu5Ik0P",
// 		};
// 		res.status(200).json({ ok: true, data: users } as SuccessResponse<any>);
// 	} catch (error) {
// 		console.error(error);
// 		res.status(500).send("Internal Server Error");
// 	}
// });
// GET /user/:id
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield prisma_1.default.user.findUnique({ where: { id: Number(id) } });
        if (!user) {
            res.status(404).json({
                ok: false,
                error: { message: "User not found" },
            });
        }
        else {
            res
                .status(200)
                .json({ ok: true, message: "ready to go" });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}));
// POST /user
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email } = req.body;
    try {
        const user = yield prisma_1.default.user.create({
            data: {
                name,
                email,
            },
        });
        res.status(201).json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}));
// PUT /user/:id
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, email } = req.body;
    try {
        const user = yield prisma_1.default.user.update({
            where: {
                id: Number(id),
            },
            data: {
                name,
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
                id: Number(id),
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