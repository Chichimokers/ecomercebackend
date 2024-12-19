import { registerDecorator, ValidationOptions } from "class-validator";

/**
 * Decorator to validate the date entry for the case of offers, only for DTO
 */
export function IsFutureDate(validationOptions?: ValidationOptions){
    return function (object: Object, propertyName: string): void {
        registerDecorator({
            name: 'isFutureDate',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any): boolean{
                    return value > new Date();
                },
                defaultMessage(): string {
                    return 'Date must be in the future';
                }
            },
        });
    };
}