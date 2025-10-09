import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { fileUploader } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js ";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = User.findById(userId);
    const accessToken = user.generateAccessTokens();
    const refreshToken = user.generateRefreshTokens();
    // if (!accessToken && !refreshToken)
    //   throw new ApiError(500, "Error occured in generating of tokens");

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong whuile generating the refresh and access tokens"
    );
  }
};

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

  if (
    [username, email, fullname, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const checkUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (checkUser) {
    throw new ApiError(409, "User already exist with username or email");
  }

  const avatarLocalPath = req.files?.avatar[0].path;
  // const coverImageLocalPath = req.files?.coverImage[0].path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0]?.path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is a required field");
  }

  const avatar = await fileUploader(avatarLocalPath);
  const coverImage = await fileUploader(coverImageLocalPath);

  const user = await User.create({
    fullname,
    avatar: avatar.secure_url,
    coverImage: coverImage?.secure_url,
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

const userLogin = asyncHandler(async (req, res) => {
  // get the info from the user
  // validate them
  // check if user existing with the email or username
  // check the password
  // generate the refresh and access tokens
  // generate the cookies
  // return res

  const [username, password, email] = req.body;
  if ([username, email].some((field) => field?.trim() === ""))
    throw new ApiError(400, "Required credentials need to enter");

  const user = await User.find({
    $or: [{ email }, { username }],
  });

  if (!user) throw new ApiError(400, "Either username or email incorrect!");

  const validPassword = await bcrypt.compare(this.password, password);

  if (!validPassword)
    throw new ApiError(400, "Either email or password is incorrect");

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedUser = await User.find(user._id);

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedUser,
          accessToken,
          refreshToken,
        },
        "User logged in succedfully"
      )
    );
});

const userLogout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: undefined },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logout Succesfully"));
});

export { userRegister, userLogin, userLogout };
