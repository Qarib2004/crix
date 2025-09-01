import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { VerificationService } from './verification.service';
import { AuthModel } from '../account/models/auth.model';
import type { GqlContext } from '@/src/shared/types/gql-context.types';
import { VerificationInput } from './inputs/verification.input';
import { UserAgent } from '@/src/shared/decorators/user-agent.decorator';

@Resolver('Verification')
export class VerificationResolver {
  public constructor(private readonly verificationService: VerificationService) {}

  @Mutation(() => AuthModel,{name:'verifyAccount'})
  public async verify(@Context() {req}: GqlContext, @Args('data') input:VerificationInput,@UserAgent() userAgent:string){
    return this.verificationService.verify(req,input,userAgent)
  }


}
