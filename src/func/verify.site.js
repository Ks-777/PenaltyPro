const { QuickDB } = require('quick.db');
const { ButtonBuilder, ActionRowBuilder } = require('discord.js');
const db = new QuickDB({ filePath: './db/db.sqlite' });
const crypto = require('crypto');

module.exports = {
	data: { /* ...existing code... */ },
	async execute(interaction) {
		// state を生成して保存
		const state = crypto.randomBytes(16).toString('hex');
		await db.set(`verify_state_${state}`, interaction.user.id);

		const redirectUri = encodeURIComponent('https://verifyer.discloud.app');
		const scope = 'identify email dm_channels.messages.write guilds';

		const clientId = process.env.APPID;
		const url = `https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${encodeURIComponent(scope)}&state=${state}`;
		const button = new ButtonBuilder()
			.setLabel('認証画面を開く')
			.setStyle('Link')
			.setURL(url);
		const row = new ActionRowBuilder().addComponents(button);
		await interaction.reply({ components: [row], ephemeral: true });
	}
};