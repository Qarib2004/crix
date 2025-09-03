import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { StreamService } from './stream.service';
import { Query } from '@nestjs/graphql';
import { StreamModel } from './models/stream.model';
import { FiltersInput } from './inputs/filters.input';
import { Authorization } from '@/src/shared/decorators/auth.decorator';
import { Authorized } from '@/src/shared/decorators/authorized.decorator';
import type { User } from '@/generated';
import { ChangeStreamInfoInput } from './inputs/change-stream-info-input.input';
import { StorageService } from '../libs/storage/storage.service';
import { FileValidationPipe } from '@/src/shared/pipes/file-validation.pipe';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js'
import * as Upload from 'graphql-upload/Upload.js'
import { GenerateStreamTokenModel } from './models/generate-streamTokenModel.model';
import { GenerateStreamTokenInput } from './inputs/generate-stream-token.input';

@Resolver('Stream')
export class StreamResolver {
   public constructor(private readonly streamService: StreamService,
    private readonly storageService:StorageService
   ) {}



   @Query(() => [StreamModel],{name:'findAllStream'})
   public async findAll(@Args('filters') input:FiltersInput){
     return this.streamService.findAll(input)
   }


   
	@Query(() => [StreamModel], { name: 'findRandomStreams' })
	public async findRandom() {
		return this.streamService.findRandom()
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'changeStreamInfo' })
	public async changeInfo(
		@Authorized() user: User,
		@Args('data') input: ChangeStreamInfoInput
	) {
		return this.streamService.changeInfo(user, input)
	}


  
	@Authorization()
	@Mutation(() => Boolean, { name: 'changeStreamThumbnail' })
	public async changeThumbnail(
		@Authorized() user: User,
		@Args('thumbnail', { type: () => GraphQLUpload }, FileValidationPipe)
		thumbnail: Upload
	) {
		return this.streamService.changeThumbnail(user, thumbnail)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'removeStreamThumbnail' })
	public async removeThumbnail(@Authorized() user: User) {
		return this.streamService.removeThumbnail(user)
	}

	
	@Mutation(() => GenerateStreamTokenModel, { name: 'generateStreamToken' })
	public async generateToken(@Args('data') input: GenerateStreamTokenInput) {
		return this.streamService.generateToken(input)
	}


}
