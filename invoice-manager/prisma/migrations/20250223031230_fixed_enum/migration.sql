/*
  Warnings:

  - You are about to alter the column `status` on the `Shift` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `Shift` MODIFY `status` ENUM('UPCOMING', 'LOGGED', 'REQUESTED', 'PAID') NOT NULL DEFAULT 'UPCOMING';
