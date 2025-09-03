import { Markup } from 'telegraf'

export const BUTTONS = {
	authSuccess: Markup.inlineKeyboard([
		[
			Markup.button.callback('📜My subscriptions', 'follows'),
			Markup.button.callback('👤 View profile ', 'me')
		],
		[Markup.button.url('🌐 According toт', 'https://cirx.az')]
	]),
	profile: Markup.inlineKeyboard([
		Markup.button.url(
			'⚙️ Account settings',
			'https://crix.az/dashboard/settings'
		)
	])
}
