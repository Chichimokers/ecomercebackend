import { BadRequestException, NotFoundException } from '@nestjs/common';

export function notFoundException(element: any[] | any, varName: string): void {
    const responseError = `${varName} not found`;

    if(!Array.isArray(element)){
        if(!element) throw new NotFoundException(responseError);
    } else {
        if(element.length === 0) throw new NotFoundException(responseError);
    }
}

export function badRequestException(param: any, varName: string): void {
    if(!param) {
        throw new BadRequestException(`${varName} is required!`);
    }
}