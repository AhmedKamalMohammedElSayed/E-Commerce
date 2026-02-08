const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
// const ApiError = require("../utils/apiError");

const User = require("../models/userModel");
const ApiError = require("../utils/apiError");
const sendEmail = require("../utils/sendEmail");



const createToken = (payload) =>
  jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });

exports.signup = asyncHandler(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET_KEY,
    process.env.JWT_EXPIRE_TIME,
  );

  res.status(201).json({ data: user, token });
});

exports.login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Incorrect email or password", 401));
  }
  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET_KEY,
    process.env.JWT_EXPIRE_TIME,
  );

  res.status(201).json({ data: user, token });
});

exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new ApiError("you are not login", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  console.log(decoded);

  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(new ApiError("No User"), 401);
  }

  if (currentUser.passwordChangeAt) {
    const passChangedTimestamp = parseInt(
      currentUser.passwordChangeAt.getTime() / 1000,
      10,
    );
    if (passChangedTimestamp > decoded.iat) {
      return next(new ApiError("User Changed password", 401));
    }
  }
  req.user = currentUser;
  next();
});

exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You are not allowed to access this route", 404),
      );
    }
    next();
  });

exports.forgetpassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("There is no user with this email", 404));
  }

  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  user.passwordResetCode = hashedResetCode;
  user.passwordResetExpires = Date.now() + 600 * 1000;
  user.passwordResetVerified = false;

  await user.save();

  const msg =
    "We received a request to reset the password associated with this email address.If you made this request, please follow the instructions below.If you did not request to have your password reset you can safely ignore this email. Be assured your account is safe.";

  try {
    await sendEmail({
      email: user.email,
      subject: "Your Password Reset Code (valid for 10 min)",
      message: msg,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();
    return next(new ApiError("There is an error in sending email", 500));
  }

  res.status(200).json({ status: "Success", message: "Reset code" });
});

exports.verifyPassResetCode = asyncHandler(async (req, res, next) => {
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gte: Date.now() },
  });

  if (!user) {
    return next(new ApiError("Reset code invalid"));
  }

  user.passwordResetVerified = true;
  await user.save();

  res.status(200).json({
    status: "success",
  });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`There is no user with email ${req.body.email}`, 404),
    );
  }

  if (!user.passwordResetCode) {
    return next(new ApiError("Reset code not verified", 400));
  }

  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save();

  const token = createToken(user._id);
  res.status(200).json({ token });
});
