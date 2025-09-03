import type { SponsorshipPlan, User } from '@/generated'
import type { SessionMetadata } from '@/src/shared/types/session-metadata'

export const MESSAGES = {
	welcome:
		`<b>👋 Welcome to Crix Bot!</b>\n\n` +
		`To receive notifications and improve your experience on the platform, let's link your Telegram account with Crix.\n\n` +
		`Click the button below and go to the <b>Notifications</b> section to complete the setup.`,
	authSuccess: `🎉 You have successfully logged in, and your Telegram account is now linked with Crix!\n\n`,
	invalidToken: '❌ Invalid or expired token.',
	profile: (user: User, followersCount: number) =>
		`<b>👤 User Profile:</b>\n\n` +
		`👤 Username: <b>${user.username}</b>\n` +
		`📧 Email: <b>${user.email}</b>\n` +
		`👥 Followers: <b>${followersCount}</b>\n` +
		`📝 Bio: <b>${user.bio || 'Not provided'}</b>\n\n` +
		`🔧 Click the button below to go to your profile settings.`,
	follows: (user: User) =>
		`📺 <a href="https://crix.az/${user.username}">${user.username}</a>`,
	resetPassword: (token: string, metadata: SessionMetadata) =>
		`<b>🔒 Password Reset</b>\n\n` +
		`You requested a password reset for your Crix account.\n\n` +
		`To create a new password, please click the following link:\n\n` +
		`<b><a href="https://crix.az/account/recovery/${token}">Reset Password</a></b>\n\n` +
		`📅 <b>Request Date:</b> ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}\n\n` +
		`🖥️ <b>Request Info:</b>\n` +
		`🌍 <b>Location:</b> ${metadata.location.country}, ${metadata.location.city}\n` +
		`📱 <b>OS:</b> ${metadata.device.os}\n` +
		`🌐 <b>Browser:</b> ${metadata.device.browser}\n` +
		`💻 <b>IP Address:</b> ${metadata.ip}\n\n` +
		`If you did not make this request, please ignore this message.\n\n` +
		`Thank you for using <b>Crix</b>! 🚀`,
	deactivate: (token: string, metadata: SessionMetadata) =>
		`<b>⚠️ Account Deactivation Request</b>\n\n` +
		`You initiated the process to deactivate your Crix account.\n\n` +
		`To complete this process, please confirm your request by entering the following confirmation code:\n\n` +
		`<b>Confirmation Code: ${token}</b>\n\n` +
		`📅 <b>Request Date:</b> ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}\n\n` +
		`🖥️ <b>Request Info:</b>\n` +
		`• 🌍 <b>Location:</b> ${metadata.location.country}, ${metadata.location.city}\n` +
		`• 📱 <b>OS:</b> ${metadata.device.os}\n` +
		`• 🌐 <b>Browser:</b> ${metadata.device.browser}\n` +
		`• 💻 <b>IP Address:</b> ${metadata.ip}\n\n` +
		`<b>What happens after deactivation?</b>\n\n` +
		`1. You will be automatically logged out and lose access to your account.\n` +
		`2. If you do not cancel deactivation within 7 days, your account will be <b>permanently deleted</b> along with all data and subscriptions.\n\n` +
		`<b>⏳ Note:</b> If you change your mind within 7 days, you can contact support to restore access before full deletion.\n\n` +
		`After deletion, your account cannot be restored, and all data will be permanently lost.\n\n` +
		`If you decide not to deactivate, simply ignore this message. Your account will remain active.\n\n` +
		`Thank you for using <b>Crix</b>! We hope you continue enjoying our platform. 🚀\n\n` +
		`Sincerely,\n` +
		`The Crix Team`,
	accountDeleted:
		`<b>⚠️ Your account has been permanently deleted.</b>\n\n` +
		`All your data has been removed from Crix and cannot be recovered. ❌\n\n` +
		`🔒 You will no longer receive notifications via Telegram or email.\n\n` +
		`If you wish to return, you can register again here:\n` +
		`<b><a href="https://crix.az/account/create">Register on Crix</a></b>\n\n` +
		`Thank you for being with us! We hope to see you again on the platform. 🚀\n\n` +
		`Sincerely,\n` +
		`The Crix Team`,
	streamStart: (channel: User) =>
		`<b>📡 ${channel.displayName} has started a live stream!</b>\n\n` +
		`Watch here: <a href="https://crix.az/${channel.username}">Go to Stream</a>`,
	newFollowing: (follower: User, followersCount: number) =>
		`<b>You have a new follower!</b>\n\nThis is user <a href="https://crix.az/${follower.username}">${follower.displayName}</a>\n\nTotal followers on your channel: ${followersCount}`,
	newSponsorship: (plan: SponsorshipPlan, sponsor: User) =>
		`<b>🎉 New Sponsorship!</b>\n\n` +
		`You have received a new sponsorship on the <b>${plan.title}</b> plan.\n` +
		`💰 Amount: <b>${plan.price} ₽</b>\n` +
		`👤 Sponsor: <a href="https://crix.az/${sponsor.username}">${sponsor.displayName}</a>\n` +
		`📅 Date: <b>${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</b>`,
	enableTwoFactor:
		`🔐 Secure your account!\n\n` +
		`Enable two-factor authentication in <a href="https://crix.az/dashboard/settings">your account settings</a>.`,
	verifyChannel:
		`<b>🎉 Congratulations! Your channel is verified</b>\n\n` +
		`We are happy to inform you that your channel is now verified and has received an official badge.\n\n` +
		`The verification badge confirms your channel’s authenticity and improves viewer trust.\n\n` +
		`Thank you for being with us and continuing to grow your channel on Crix!`
}
