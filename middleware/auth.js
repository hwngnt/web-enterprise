exports.isAdmin = function(req, res, next) {
    if (req.session && req.session.admin)
      return next();
    else
      return res.sendStatus(401);
};

exports.isStaff = function(req, res, next) {
    if (req.session && req.session.staff)
      return next();
    else
      return res.sendStatus(401);
};


exports.isTrainer = function(req, res, next) {
    if (req.session && req.session.trainer)
      return next();
    else
      return res.sendStatus(401);
};

exports.isTrainee = function(req, res, next) {
    if (req.session && req.session.trainee)
      return next();
    else
      return res.sendStatus(401);
};