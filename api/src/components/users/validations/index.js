import Joi from 'joi';

import { password } from './custom.validation';

const createUser = (userObject) => {
  const schema = Joi.object({
    phoneNumber: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
  });

  return schema.validate(userObject);
};

const authUser = (authObject) => {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  });

  return schema.validate(authObject);
};

export { createUser, authUser };
