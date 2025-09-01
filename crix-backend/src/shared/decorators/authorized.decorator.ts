import { createParamDecorator,type ExecutionContext } from "@nestjs/common";
import type { User } from '@/generated'
import { GqlExecutionContext } from "@nestjs/graphql";





export const Authorized = createParamDecorator(
    (data:keyof User,ctx:ExecutionContext) => {
        let user:User 

        if(ctx.getType() === 'http'){
            user = ctx.switchToHttp().getResponse().user
        } else {
			const context = GqlExecutionContext.create(ctx)
			user = context.getContext().req.user
		}

		return data ? user[data] : user
    }
)