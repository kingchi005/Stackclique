"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const details = {
    email: "wrong",
    name: "required",
    password: "incorrect",
};
const err = {
    ok: false,
    error: {
        message: "test error",
        details,
    },
};
const data = {
    name: "Theodore King",
    email: "rem@se.ua",
    phoneId: "f847f89d-3742-5344-a3cc-44e7312178e5",
    address: "U6FFAGTEgp2xu5Ik0P",
};
const res = {
    ok: true,
    data,
};
const AvailableChatEvents = Object.values(constants_1.ChatEventEnum);
//# sourceMappingURL=types.js.map