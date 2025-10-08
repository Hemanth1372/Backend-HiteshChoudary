// implementing this using try and catch block

// advanced way of writing function , using
// function as a param for to execute inside of it
const asyncHandler = (func) => async (req, res, next) => {
  try {
    await func(req, res, next);
  } catch (err) {
    res.status(err.code || 400).json({
      success: false,
      message: err.message,
    });
  }
};

export { asyncHandler };

// implementing it using Promises

// const asyncHandle = (func) => {
//   (req, res, next) => {
//     Promise.resolve(func(req, res, next)).catch((err) => next(err));
//   };
// };

// these are the two differnet ways of writing the code
