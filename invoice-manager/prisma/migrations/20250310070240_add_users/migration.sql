/*
  Warnings:

  - You are about to drop the column `parent_id` on the `Shift` table. All the data in the column will be lost.
  - You are about to alter the column `startTime` on the `Shift` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(5)`.
  - You are about to alter the column `endTime` on the `Shift` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(5)`.
  - Added the required column `updatedAt` to the `Shift` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Shift` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Shift` DROP FOREIGN KEY `Shift_parent_id_fkey`;

-- DropIndex
DROP INDEX `Shift_parent_id_fkey` ON `Shift`;

-- AlterTable
ALTER TABLE `Shift` DROP COLUMN `parent_id`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `invoiceId` INTEGER NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `userId` VARCHAR(191) NOT NULL,
    MODIFY `class` VARCHAR(255) NOT NULL,
    MODIFY `grade` VARCHAR(255) NOT NULL,
    MODIFY `startTime` VARCHAR(5) NOT NULL,
    MODIFY `endTime` VARCHAR(5) NOT NULL,
    MODIFY `recurring` BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NULL,
    `role` ENUM('EMPLOYEE', 'MANAGER') NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Invoice` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Shift` ADD CONSTRAINT `Shift_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Shift` ADD CONSTRAINT `Shift_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `Invoice`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
