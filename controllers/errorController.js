
exports.errorGet = (req, res, next) => {
  res.status(400).render("error");
}