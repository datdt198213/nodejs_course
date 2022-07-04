const Course = require("../models/Course");
const { multipleMongooseToObject } = require("../../util/mongoosse");

class MeController {
  // [GET] /me/stored/courses
  storedCourses(req, res, next) {

    Promise.all([Course.find({}), Course.countDocumentsDeleted()])
      .then(([courses, deletedCount]) =>
        res.render("me/stored-courses", {
          deletedCount,
          courses: multipleMongooseToObject(courses),
        })
      )
      .catch(next);
  }

  // [GET] /me/stored/news
  storedNews(req, res, next) {
    res.render("me/stored-news");
  }

  // [GET] /me/trash/courses
  trashCourses(req, res, next) {
    Course.findDeleted({})
      .then((courses) =>
        res.render("me/trash-courses", {
          courses: multipleMongooseToObject(courses),
        })
      )
      .catch(next);
  }
}

module.exports = new MeController();