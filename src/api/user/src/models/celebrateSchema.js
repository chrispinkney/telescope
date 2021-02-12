const { celebrate, Joi, Segments } = require('celebrate');

const get = () =>
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
  });

const post = () =>
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      id: Joi.number().required(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      displayName: Joi.string().default(''),
      isAdmin: Joi.boolean().default(false),
      isFlagged: Joi.boolean().default(false),
      feeds: Joi.array().items(Joi.string()).required(),
      github: Joi.object({
        username: Joi.string(),
        avatarUrl: Joi.string(),
      }).default({ username: '', avatarUrl: '' }),
      created: Joi.string(),
      updated: Joi.string(),
    }),
  });

exports.post = post;
exports.get = get;
exports.update = post;
exports.delete = get;
