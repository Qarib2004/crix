import type { MetadataRoute } from 'next'

import { SITE_DESCRIPTION, SITE_NAME } from '@/libs/constants/seo.constants'

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: SITE_NAME,
		description: SITE_DESCRIPTION,
		start_url: '/account/login',
		display: 'standalone',
		orientation: 'portrait',
		background_color: '#1F2128',
		theme_color: '#18b9AE',
		icons: [
			{
				src: '/images/logo.svg',
				sizes: '256x256',
				type: 'image/svg'
			}
		]
	}
}
