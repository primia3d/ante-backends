-- CreateTable
CREATE TABLE "Notifications" (
    "id" SERIAL NOT NULL,
    "content" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskProjectNotifications" (
    "id" SERIAL NOT NULL,
    "notificationsId" INTEGER,
    "receiverId" TEXT,
    "projectId" INTEGER,
    "taskId" INTEGER,
    "hasRead" BOOLEAN NOT NULL,
    "isDeleted" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaskProjectNotifications_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TaskProjectNotifications" ADD CONSTRAINT "TaskProjectNotifications_notificationsId_fkey" FOREIGN KEY ("notificationsId") REFERENCES "Notifications"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskProjectNotifications" ADD CONSTRAINT "TaskProjectNotifications_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskProjectNotifications" ADD CONSTRAINT "TaskProjectNotifications_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskProjectNotifications" ADD CONSTRAINT "TaskProjectNotifications_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE SET NULL ON UPDATE CASCADE;
