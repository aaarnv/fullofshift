/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Shift` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Shift` table. All the data in the column will be lost.
  - You are about to alter the column `class` on the `Shift` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `grade` on the `Shift` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `Shift` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `parent_id` INTEGER NULL,
    MODIFY `class` VARCHAR(191) NOT NULL,
    MODIFY `grade` VARCHAR(191) NOT NULL,
    MODIFY `status` ENUM('UPCOMING', 'PENDING', 'LOGGED', 'REQUESTED', 'PAID') NOT NULL DEFAULT 'UPCOMING',
    MODIFY `startTime` VARCHAR(191) NOT NULL,
    MODIFY `endTime` VARCHAR(191) NOT NULL,
    MODIFY `recurring` BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE `Shift` ADD CONSTRAINT `Shift_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `Shift`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
