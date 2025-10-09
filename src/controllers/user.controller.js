import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { fileUploader } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js ";
import { ApiResponse } from "../utils/ApiResponse.js";

const userRegister = asyncHandler(async (req, res) => {
  // get the inout fields from the user from the frontend
  // validate the user credentials
  // check for the user existence
  // check for the file types -- avater
  // upload them in cloudinary and get the url
  // create the user object entry for the db
  // remove the password and refresh token for the response
  // check for the user creation
  // return res

  const { username, email, fullname, password } = req.body;
  console.log(req.body);

  if (
    [username, email, fullname, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const checkUser = User.findOne({
    $or: [{ username }, { email }],
  });

  if (checkUser) {
    throw new ApiError(409, "User already exist with username or email");
  }

  const avatarLocalPath = req.files?.avatar[0].path;
  const coverImageLocalPath = req.files?.coverImage[0].path;

  const avatar = await fileUploader(avatarLocalPath);
  const coverImage = await fileUploader(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar is a required field");
  }

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url,
    email,
    username: username.toLowerCase(),
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "User creation is unsuccesful");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Succesfully Created"));
});

export { userRegister };
