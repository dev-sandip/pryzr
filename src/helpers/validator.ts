import { ClassConstructor, plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

export const validateDto = async (
  dtoClass: ClassConstructor<object>,
  plainObject: object,
) => {
  const dtoInstance = plainToClass(dtoClass, plainObject);
  const errors = await validate(dtoInstance);

  if (errors.length > 0) {
    throw new Error(
      errors.map((err) => Object.values(err.constraints)).join(', '),
    );
  }

  return dtoInstance;
};
