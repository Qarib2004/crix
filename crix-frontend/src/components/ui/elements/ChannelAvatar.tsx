import { type VariantProps, cva } from 'class-variance-authority'

import { FindProfileQuery } from '@/graphql/generated/output'
import { getMediaSource } from '@/utils/get-media-source'
import { cn } from '@/utils/tw-merge'

import { Avatar, AvatarFallback, AvatarImage } from '../common/Avatar'

const avatarSizes = cva('', {
  variants: {
    size: {
      sm: 'size-7',
      default: 'size-9',
      lg: 'size-14',
      xl: 'size-32'
    }
  },
  defaultVariants: {
    size: 'default'
  }
})

type Profile = NonNullable<FindProfileQuery['findProfile']>

interface ChannelAvatarProps extends VariantProps<typeof avatarSizes> {
  channel: Pick<Profile, 'username' | 'avatar'>
  isLive?: boolean
}

export function ChannelAvatar({ size, channel, isLive }: ChannelAvatarProps) {
  return (
    <div className='relative'>
      <Avatar
        className={cn(
          avatarSizes({ size }),
          isLive && 'ring-2 ring-rose-500'
        )}
      >
        <AvatarImage
          src={getMediaSource(channel.avatar) as string | undefined}
          className='object-cover'
        />
        <AvatarFallback
          className={cn(
            size === 'xl' && 'text-4xl',
            size === 'lg' && 'text-2xl'
          )}
        >
          {channel?.username?.[0] ?? "?"}
        </AvatarFallback>
      </Avatar>
    </div>
  )
}
