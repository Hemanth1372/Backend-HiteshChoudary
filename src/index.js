// Even we write this it runs absolutely fine but
// it makes the code inconsistent since it is require
/*
require("dotenv").config({ path: `./env` });
*/

import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";

dotenv.config({
  path: `./env`,
});

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Error: ", error);
      throw error;
    });

    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection Error !!!", err);
  });

// import express from "express";

// const app = express();
// async () => {
//   try {
//     await mongoose.connect(`${process.env.DATABASE_UR}/${DB_NAME}`);
//     app.on("error", (error) => {
//       console.log("Error: ", error);
//       throw error;
//     });

//     app.listen(process.env.PORT, () => {
//       console.log(`Server is listening on port ${process.env.PORT}`);
//     });
//   } catch (error) {
//     console.log("ERROR : ", error);
//     throw error;
//   }
// };
