-- CreateTable
CREATE TABLE "_CourseModuleToUser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_CourseModuleToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "CourseModule" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CourseModuleToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_CourseModuleToUser_AB_unique" ON "_CourseModuleToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_CourseModuleToUser_B_index" ON "_CourseModuleToUser"("B");
