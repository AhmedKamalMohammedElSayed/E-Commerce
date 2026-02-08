const express = require("express");
const authService = require("../controller/authService");

const router = express.Router();

const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
} = require("../utils/validators/userValidator");

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  updateUserPassword,
  resizeImage,
} = require("../controller/userService");

router.route(
  "/changePassword/:id",
  changeUserPasswordValidator,
  updateUserPassword,
);

router
  .route("/")
  .get(authService.protect, authService.allowedTo("admin"), getUsers)
  .post(
    authService.protect,
    authService.allowedTo("admin"),
    uploadUserImage,
    resizeImage,
    createUserValidator,
    createUser,
  );

router
  .route("/:id")
  .get(
    authService.protect,
    authService.allowedTo("admin"),
    getUserValidator,
    getUser,
  )
  .put(
    authService.protect,
    authService.allowedTo("admin"),
    uploadUserImage,
    resizeImage,
    updateUserValidator,
    updateUser,
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    deleteUserValidator,
    deleteUser,
  );

module.exports = router;
