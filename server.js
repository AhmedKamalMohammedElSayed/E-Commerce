const path = require("path");

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const dbConnection = require("./config/database");
const categoryRoute = require("./routes/categoryroute");
const subCategoryRoute = require("./routes/subCategoryRoute");
const brandRoute = require("./routes/brandRoute");
const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");
const ApiError = require("./utils/apiError");
const globalError = require("./MiddleWare/ErrorHandlingMiddleWares");

dotenv.config({ path: "config.env" });
dbConnection();

const app = express();

//MiddleWares
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`Mode: ${process.env.NODE_ENV}`);
}

//Mount Routes
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/subCategories", subCategoryRoute);
app.use("/api/v1/brands", brandRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/auth", authRoute);

// Catch non Existing Route
app.use((req, res, next) => {
  next(new ApiError(`Can't find this route ${req.originalUrl}`, 400));
});


//Error Handling MiddleWare
app.use(globalError);

const { PORT } = process.env;
const server = app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});

//Catch Anything that outside Nodejs --Async --promises
process.on("unhandledRejection", (err) => {
  console.error(`unhandledRejection Error: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error("Shutting down ....");
    process.exit(1);
  });
});
