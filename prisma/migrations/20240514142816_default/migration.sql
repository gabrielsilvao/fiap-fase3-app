/*
  Warnings:

  - Added the required column `cpf` to the `account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `account` ADD COLUMN `cpf` VARCHAR(191) NOT NULL;
