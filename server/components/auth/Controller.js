const client = new (require('google-auth-library')).OAuth2Client(process.env.CLIENT_ID);
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../../models/User');

const {code200, code201, code401, code501} = require('../../helpers/httpRequestCode');
const msg = require('../../helpers/msg');
const salt = process.env.JWT_SECRET;

class AuthController {
  static async verify({body}, res, next) {
    var id_token = body.id_token;
    try {
      var decode = jwt.verify(id_token, salt);
      if (decode.id_token) {
        id_token = decode.id_token
      }
    } catch (e) {
    }

    client
      .verifyIdToken({
        idToken: id_token,
        audience: process.env.CLIENT_ID,
      })
      .then(async function (prop) {
        try {
          const profileData = Object.assign({}, prop.getPayload(), {token: id_token});
          const token = jwt.sign({
            email: profileData.email || '',
            id_token
          }, salt);

          var profile = await User.findOneAndUpdate({
            $or: [
              {email: profileData.email},
              {token: id_token}
            ]
          }, {$set: profileData})
            .exec();

          if (!profile) {
            await (new User(Object.assign(profileData, {
              password: bcrypt.hashSync(bcrypt.genSaltSync(8), bcrypt.genSaltSync(8))
            }))).save()
          }

          const {email, name, picture} = profileData;

          res
            .json({
              email,
              name,
              picture,
              token
            })
        } catch (e) {
          console.log(e);
          next('Internal server error')
        }
      })
      .catch(async (err) => {
        const profile = await User.findOne({email: decode.email});
        if (profile) {
          return res
            .json({
              email: profile.email,
              name: profile.name || '',
              picture: profile.picture || '',
              token: jwt.sign({
                email: profile.email || '',
                id_token
              }, salt)
            })
        }
        res.status(401);
        next('Unauthorized')
      })
  }

  static login({body}, res, next) {
    User
      .findOne({email: body.email})
      .then((prop) => {
        if (prop) {
          if (bcrypt.compareSync(body.password, prop.password)) {
            msg
              .json(res, code200, {
                token: jwt.sign({email: prop.email}, process.env.JWT_SECRET)
              })
          } else {
            msg
              .json(res, code401, {email: body.email}, msg.error.login)
          }
        } else {
          msg
            .json(res, code401, {email: body.email}, msg.error.login)
        }
      })
      .catch((err) => {
        msg
          .json(res, code401, {email: body.email}, null, err)
      })
  }

  static register({body}, res) {
    delete body['_id'];
    (new User(body))
      .save((errSave, resSave) => {
        if (errSave) {
          msg.json(res, code501, body, errSave.errors, errSave)
        } else {
          msg.json(res, code201, resSave)
        }
      })
  }
}

module.exports = AuthController;