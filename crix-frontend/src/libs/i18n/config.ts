export const COOKIE_NAME = 'language'
export const languages = ['en','az','ru'] as const
export const defaultLanguage: Language = 'en'

export type Language = (typeof languages)[number]
