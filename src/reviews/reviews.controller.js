const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function reviewExists(req, res, next) {
    const review = await service.read(req.params.reviewId);
    if (review) {
      res.locals.review = review;
      return next();
    }
    next({ status: 404, message: `Review cannot be found.` });
  }

  async function list(req, res) {
    const data = await service.list(req.params.movieId);
    res.json({ data });
  }

  async function update(req, res) {
    const updatedReview = {
      ...res.locals.review,
      ...req.body.data,
      review_id: res.locals.review.review_id,
    };
    const data = await service.update(updatedReview);
    res.json({ data });
  }

  async function destroy(req, res) {
    await service.destroy(res.locals.review.review_id);
    res.sendStatus(204);
  }

  module.exports = {
    update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
    delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
    list: [asyncErrorBoundary(list)],
  };