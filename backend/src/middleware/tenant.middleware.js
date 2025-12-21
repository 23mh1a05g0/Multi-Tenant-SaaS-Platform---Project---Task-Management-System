module.exports = (req, res, next) => {
  if (req.user.role === 'super_admin') {
    return next();
  }

  if (!req.user.tenant_id) {
    return res.status(403).json({
      success: false,
      message: 'Tenant access required'
    });
  }

  req.tenant_id = req.user.tenant_id;
  next();
};
