import { BadRequestException, NotFoundException, ParseUUIDPipe } from "@nestjs/common";

export function captureNotFoundException(element: any[] | any, varName: string | string[]): void {
    if (!Array.isArray(varName)) {
        const responseError = `${varName} not found`;

        if(captureNotFound(element)) throw new NotFoundException(responseError);
    } else {
        let names: string = '';
        let notFound: boolean = false;

        for (let i: number = 0; i < element.length; i++) {
            if(captureNotFound(element[i])) {
                names += varName[i] + ' ';
                notFound = true;
            }
        }

        if(notFound) throw new NotFoundException(names + 'not found');
    }
}

function captureNotFound(element: any[] | any) {
    if(!Array.isArray(element)){
        if(!element) return true;
    } else {
        if(element.length === 0) return true;
    }

    return false;
}

export function captureBadRequestException(param: any, varName: string): void {
    const responseError = `${varName} is required`;

    if(!Array.isArray(param)){
        if(!param) throw new BadRequestException(responseError);
    } else {
        if(param.length === 0) throw new BadRequestException(responseError);
    }
}

export function validateUUID(value: string) {
    try {
        return new ParseUUIDPipe().transform(value, { type: 'query' });
    } catch (error) {
        throw new BadRequestException(`El valor '${value}' no es un UUID válido`);
    }
}