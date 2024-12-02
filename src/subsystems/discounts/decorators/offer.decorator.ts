import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";

/**
 * Decorator to validate the date entry for the case of offers, only for DTO
 */
export function IsFutureDate(validationOptions?: ValidationOptions){
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isFutureDate',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments){
                    return value > new Date();
                },
                defaultMessage(args: ValidationArguments) {
                    return 'Date must be in the future';
                }
            },
        });
    };
}