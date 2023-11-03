import {
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

type IsFileOptions = ('image/jpg' | 'image/png' | 'image/jpeg')[];

export function IsFileValidator(
  options: IsFileOptions = ['image/jpg', 'image/png', 'image/jpeg'],
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    return registerDecorator({
      name: 'isFile',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (value?.mimetype && (options ?? []).includes(value?.mimetype)) {
            return true;
          }
          return false;
        },
      },
    });
  };
}
