import { GeistSans } from 'geist/font/sans'
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import { Geist, Geist_Mono, Inter } from 'next/font/google'

import { ApolloClientProvider } from '@/providers/AppoloClientProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'
import {
	SITE_DESCRIPTION,
	SITE_KEYWORDS,
	SITE_NAME
} from '@/libs/constants/seo.constants'
import '@/styles/globals.css'
import '@/styles/themes.css'
import { ToastProvider } from '@/providers/ToastProvider'
import { ColorSwitcher } from '@/components/ui/elements/ColorSwitcher'
import { APP_URL } from '@/libs/constants/url.constants'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: {
		absolute: SITE_NAME,
		template: `%s - ${SITE_NAME}`
	},
	description: SITE_DESCRIPTION,
	metadataBase: new URL(APP_URL),
	applicationName: SITE_NAME,
	authors: [
		{
			name: 'Crix',
			url: new URL('https://github.com/crix')
		}
	],
	keywords: SITE_KEYWORDS,
	generator: 'Next.js',
	creator: 'Qarib',
	publisher: 'Crix',
	icons: {
		icon: '/images/logo.svg',
		shortcut: '/images/logo.svg',
		apple: '/images/logo.svg',
		other: {
			rel: 'images',
			url: '/images/logo.svg',
			sizes: '256x256',
			type: 'image/png'
		}
	},
	openGraph: {
		title: SITE_NAME,
		description: SITE_DESCRIPTION,
		type: 'website',
		emails: ['help@crix.az'],
		locale: 'az_AZ',
		images: [
			{
				url: '/images/logo.svg',
				width: 512,
				height: 512,
				alt: SITE_NAME
			}
		],
		url: new URL(APP_URL)
	},
	twitter: {
		title: SITE_NAME,
		description: SITE_DESCRIPTION,
		images: [
			{
				url: '/images/logo.svg',
				width: 512,
				height: 512,
				alt: SITE_NAME
			}
		]
	}
}

export default async function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	const locale = await getLocale()
	const messages = await getMessages()

	return (
		<html lang={locale} suppressHydrationWarning>
			<body className={GeistSans.variable}>
				<ColorSwitcher />
				<ApolloClientProvider>
					<NextIntlClientProvider messages={messages}>
						<ThemeProvider
							attribute='class'
							defaultTheme='dark'
							disableTransitionOnChange
						>
							<ToastProvider />
							{children}
						</ThemeProvider>
					</NextIntlClientProvider>
				</ApolloClientProvider>
			</body>
		</html>
	)
}
