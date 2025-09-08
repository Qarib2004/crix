'use client'

import { useCurrent } from '@/hooks/useCurrent'

export default function HomePage() {
	const { user, isLoadingProfile } = useCurrent()

	if (isLoadingProfile) {
		return <div className="text-4xl font-bold">Loading...</div>
	}

	if (!user) {
		return <div className="text-4xl font-bold">No user</div>
	}

	return (
		<div className="text-4xl font-bold">
			{JSON.stringify(user, null, 2)}
		</div>
	)
}
