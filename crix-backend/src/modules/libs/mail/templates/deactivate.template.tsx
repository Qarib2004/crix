import { SessionMetadata } from '@/src/shared/types/session-metadata'
import { Body, Head, Heading, Link, Preview, Section, Tailwind, Text } from '@react-email/components'
import { Html } from '@react-email/html'
import * as React from 'react'

interface DeactivateTemplateProps {
	token: string
	metadata: SessionMetadata
}

export function DeactivateTemplate({ token, metadata }: DeactivateTemplateProps) {
	return (
		<Html>
			<Head />
			<Preview>Deactivation of an account</Preview>
			<Tailwind>
				<Body className='max-w-2xl mx-auto p-6 bg-slate-50'>
					<Section className='text-center mb-8'>
						<Heading className='text-3xl text-black font-bold'>
							Request to deactivation of the account
						</Heading>
						<Text className="text-black text-base mt-2">
							You initiated the process of deactivation of your account on the platform<b>Crix</b>.
						</Text>
					</Section>

					<Section className='bg-gray-100 rounded-lg p-6 text-center mb-6'>
						<Heading className='text-2xl text-black font-semibold'>
							Confirmation code:
						</Heading>
						<Heading className='text-3xl text-black font-semibold'>
							{token}
						</Heading>
						<Text className='text-black'>
							This code is valid within 5 minutes.
						</Text>
					</Section>

					<Section className='bg-gray-100 rounded-lg p-6 mb-6'>
						<Heading 
							className='text-xl font-semibold text-[#18B9AE]'
						>
						Request Information:
						</Heading>
						<ul className="list-disc list-inside text-black mt-2">
							<li>🌍 Mood: {metadata.location.country}, {metadata.location.city}</li>
							<li>📱 operating system: {metadata.device.os}</li>
							<li>🌐 Browser: {metadata.device.browser}</li>
							<li>💻 IP address: {metadata.ip}</li>
						</ul>
						<Text className='text-gray-600 mt-2'>
							If you have not initiated this request, please ignore this message.
						</Text>
					</Section>

					<Section className='text-center mt-8'>
						<Text className='text-gray-600'>
							If you have questions or you are faced with difficulties, do not hesitate to contact our support at the address{' '}
							<Link 
								href="mailto:help@crix.az" 
								className="text-[#18b9ae] underline"
							>
								help@crix.az
							</Link>.
						</Text>
					</Section>
				</Body>
			</Tailwind>
		</Html>
	)
}
