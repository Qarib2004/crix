import { MEDIA_URL } from '@/libs/constants/url.constants'

export function getMediaSource(path?: string | null) {
	if (!path) return ''  // или fallback URL, например '/placeholder.webp'
	return `${MEDIA_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
}
