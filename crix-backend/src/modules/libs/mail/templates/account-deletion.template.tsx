import {
	Body,
	Head,
	Heading,
	Html,
	Link,
	Preview,
	Section,
	Tailwind,
	Text
} from '@react-email/components';
import * as React from 'react';

interface AccountDeletionTemplateProps {
	domain: string
}

export function AccountDeletionTemplate({ domain }:AccountDeletionTemplateProps) {
	const registerLink = `${domain}/account/create`

	return (
		<Html>
		    <Head />
	        <Preview>The account is deleted</Preview>
	        <Tailwind>
		        <Body className='max-w-2xl mx-auto p-6 bg-slate-50'>
					<Section className="text-center">
						<Heading className="text-3xl text-black font-bold">
							Your account was completely deleted
						</Heading>
						<Text className="text-base text-black mt-2">
							Your account was completely erased from the Teastream database.All your data and information were deleted irrevocably.
						</Text>
					</Section>

					<Section className="bg-white text-black text-center rounded-lg shadow-md p-6 mb-4">
						<Text>
							You will no longer receive notifications in Telegram and mail.
						</Text>
						<Text>
							If you want to return to the platform, you can register at the following link:
						</Text>
						<Link
							href={registerLink}
							className="inline-flex justify-center items-center rounded-md mt-2 text-sm font-medium text-white bg-[#18B9AE] px-5 py-2 rounded-full"
						>
							Register for Crix
						</Link>
					</Section>

					<Section className="text-center text-black">
						<Text>
							Thank you for being with us!We will always be happy to see you on the platform.
						</Text>
					</Section>
		        </Body>
	        </Tailwind>
        </Html>
	)
}
