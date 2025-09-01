import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'

import { UserAgent } from '@/src/shared/decorators/user-agent.decorator'
import { GqlContext } from '@/src/shared/types/gql-context.types'

import { UserModel } from '../account/models/user.model'

import { LoginInput } from './inputs/login.input'
import { SessionsService } from './sessions.service'
import { Authorization } from '@/src/shared/decorators/auth.decorator'
import { SessionModel } from './models/session.module'
import { AuthModel } from '../account/models/auth.model'

@Resolver('Session')
export class SessionsResolver {
	constructor(private readonly sessionsService: SessionsService) {}


  @Authorization()
  @Query(() => [SessionModel],{name:'findSessionByUser'})
  public async findByUser(@Context() {req}:GqlContext){
    return this.sessionsService.findByUser(req)
  } 


  @Authorization()
	@Query(() => SessionModel, { name: 'findCurrentSession' })
	public async findCurrent(@Context() { req }: GqlContext) {
		return this.sessionsService.findCurrent(req)
	}



	@Mutation(() => AuthModel, { name: 'loginUser' })
	public async login(
		@Context() { req }: GqlContext,
		@Args('data') input: LoginInput,
		@UserAgent() userAgent: string
	) {
		return this.sessionsService.login(req, input, userAgent)
	}


  @Authorization()
	@Mutation(() => Boolean, { name: 'logoutUser' })
	public async logout(@Context() { req }: GqlContext) {
		return this.sessionsService.logout(req)
	}

	@Mutation(() => Boolean, { name: 'clearSessionCookie' })
	public async clearSession(@Context() { req }: GqlContext) {
		return this.sessionsService.clearSession(req)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'removeSession' })
	public async remove(
		@Context() { req }: GqlContext,
		@Args('id') id: string
	) {
		return this.sessionsService.remove(req, id)
	}


}
