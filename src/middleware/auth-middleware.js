const jwt = require('jsonwebtoken');

module.exports = () => {
  return (req, res, next) => {
    console.log('authorization middleware running...');
    console.log(req.headers);

    const token = req.headers['authorization'];
    if (!token)
      return res
        .status(401)
        .json({ auth: false, message: 'No token provided.' });

    const tokenBody = token.slice(7);
    console.log(tokenBody);
    jwt.verify(tokenBody, process.env.JWT_SECRET, function (err, decoded) {
      console.log(err);
      if (err) {
        console.log('Failed to authenticate token. Seu Token Expirou', err);
        return res.status(403)
                  .json({ auth: false, message: 'Failed to authenticate token.' });
      }
      req.userId = decoded.tokenId;
      next();
    });
  };
};
