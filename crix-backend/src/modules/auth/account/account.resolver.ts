import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AccountService } from './account.service';
import { UserModel } from './models/user.model';
import { CreateUserInput } from './inputs/create-user.input';
import { Authorization } from '@/src/shared/decorators/auth.decorator';
import { Authorized } from '@/src/shared/decorators/authorized.decorator';
import type { User } from '@/generated';
import { ChangeEmailInput } from './inputs/change-email.input';
import { ChangePasswordInput } from './inputs/change-password.input';

@Resolver('Account')
export class AccountResolver {
  constructor(private readonly accountService: AccountService) {}


  @Authorization()
  @Query(() => UserModel, {name:'findProfile'})
  public async me(@Authorized('id') id:string){
    return this.accountService.me(id)
  }


  @Query(() => [UserModel],{name:'findAllUsers'})
  public async findAll(){
    return this.accountService.findAll()
  }


  @Mutation(() => Boolean,{name:'createUser'})
  public async create(@Args('data') input:CreateUserInput){
    return this.accountService.create(input)
  }


  
	@Authorization()
	@Mutation(() => Boolean, { name: 'changeEmail' })
	public async changeEmail(
		@Authorized() user: User,
		@Args('data') input: ChangeEmailInput
	) {
		return this.accountService.changeEmail(user, input)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'changePassword' })
	public async changePassword(
		@Authorized() user: User,
		@Args('data') input: ChangePasswordInput
	) {
		return this.accountService.changePassword(user, input)
	}
}
