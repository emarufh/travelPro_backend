const errorHandler = (req, res, next) => {
  return res
    .status(500)
    .json({ status: true, message: "Something went wrong" });
};

module.exports = errorHandler;
