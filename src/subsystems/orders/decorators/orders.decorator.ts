import { registerDecorator, ValidationOptions } from "class-validator";

export function IsValidCI(validationOptions?: ValidationOptions){
    return function (object: Object, propertyName: string): void {
        registerDecorator({
            name: 'isValidCI',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: string): boolean {
                    if(value.length !== 11) {
                        return false;
                    }

                    const months: number = parseInt(value.substring(2, 4));
                    const days: number = parseInt(value.substring(4, 6));

                    if(months < 1 || months > 12) {
                        return false;
                    }

                    return !(days < 1 || days > 31);
                },
                defaultMessage(): string {
                    return 'CI is incorrect';
                }
            },
        });
    };
}