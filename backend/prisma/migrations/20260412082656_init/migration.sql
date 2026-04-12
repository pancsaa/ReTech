-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    `recoin_balance` INTEGER NOT NULL DEFAULT 0,
    `register_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `profile_image` VARCHAR(191) NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `seller_id` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `condition` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `brand` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `price_recoin` INTEGER NOT NULL,
    `status` ENUM('PENDING', 'AVAILABLE', 'SOLD', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `upload_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `image_url` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Recycle` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `product_type` VARCHAR(191) NOT NULL,
    `condition` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NULL,
    `brand` VARCHAR(191) NULL,
    `model` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `note` VARCHAR(191) NULL,
    `image_url` VARCHAR(191) NULL,
    `recoin_reward` INTEGER NOT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `buyer_id` INTEGER NOT NULL,
    `product_id` INTEGER NOT NULL,
    `amount` INTEGER NOT NULL,
    `shipping_address` VARCHAR(191) NOT NULL,
    `transaction_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `delivered_confirmed` BOOLEAN NOT NULL DEFAULT false,
    `delivered_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_seller_id_fkey` FOREIGN KEY (`seller_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Recycle` ADD CONSTRAINT `Recycle_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_buyer_id_fkey` FOREIGN KEY (`buyer_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
