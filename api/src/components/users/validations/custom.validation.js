const password = (value, helpers) => {
  if (value.length < 8)
    return helpers.message('password must be at least 8 characters');

  if (!value.match(/^(?=.*[a-z])/))
    return helpers.message(
      'password must contain at least one lowercase letter',
    );

  if (!value.match(/^(?=.*[A-Z])/))
    return helpers.message(
      'password must contain at least one uppercase letter',
    );

  if (!value.match(/^(?=.*\d)/))
    return helpers.message('password must contain at least one number');

  return value;
};

export { password };
