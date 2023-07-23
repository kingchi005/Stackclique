"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const seedb_1 = require("./seed/seedb");
const prisma = new client_1.PrismaClient();
// test/
(0, seedb_1.seedDatabase)()
    .then(() => {
    console.log("Database seeded successfully");
    prisma.$disconnect();
})
    .catch((error) => {
    console.error(`Error seeding database: ${error}`);
    prisma.$disconnect();
});
exports.default = prisma;
//# sourceMappingURL=index.js.map