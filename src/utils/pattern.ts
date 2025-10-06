export const sortPattern: RegExp = /^([a-zA-Z0-9_]+:(asc|desc))(,([a-zA-Z0-9_]+:(asc|desc)))*$/;

export const emailPattern: RegExp =
  /^(?!.*@.*@)(?!.*\.\.)[a-zA-Z0-9][a-zA-Z0-9._%+-]{0,63}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const passwordPattern: RegExp = /^(?=.*\d)(?=.*[a-zA-Z])[^\s]+$/;

export const phonePattern: RegExp = /^\d{1,14}$/;

export const timePattern: RegExp = /^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;

export const imageTypePattern = /^(image\/jpeg|image\/png)$/;
