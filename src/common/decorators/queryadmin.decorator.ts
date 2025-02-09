import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RefineQuery = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const query = request.query;

        return {
            _start: query._start ? Number(query._start) : undefined,
            _end: query._end ? Number(query._end): undefined,
            _sort: query._sort ? query._sort: undefined,
            _order: query._order ? query._order: undefined,
        };
    },
);