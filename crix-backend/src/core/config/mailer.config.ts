import type { MailerOptions } from '@nestjs-modules/mailer'
import { ConfigService } from '@nestjs/config'

export function getMailerConfig(configService: ConfigService): MailerOptions {
  return {
    transport: {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, 
      auth: {
        user: configService.getOrThrow<string>('EMAIL_USER'),
        pass: configService.getOrThrow<string>('EMAIL_PASS'),
      },
    },
    defaults: {
      from: `"Crix" <${configService.getOrThrow<string>('EMAIL_USER')}>`,
    },
  }
}
