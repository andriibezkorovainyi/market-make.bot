export const REGEX = {
  characters: /^[a-zA-Z ,'-]+$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
  email:
    // eslint-disable-next-line no-useless-escape
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  code: /^\d{4}$/,
}

export const MESSAGE = {
  characters: "Can only include a-z or A-Z and the following special characters ( - ,  , ')",
  password:
    'Must contain at least 1 uppercase character, 1 lowercase character, 1 digit, 1 special character',
  email: 'Invalid email',
  code: 'Can only include numbers',
}

export const OTP_LENGTH = 6
