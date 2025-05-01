const { SlashCommandBuilder, EmbedBuilder, Colors, ButtonBuilder, ActionRow, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('BOTのコマンド一覧を送信'),
    execute: async function(interaction) {
		const helpEmbed = new EmbedBuilder()
			.setColor('Blue')
			.setTitle('/help | BOT機能/コマンドリスト')
			.setAuthor({ name: 'Create By KS' })
			.setDescription('コマンドは基本的にスラッシュコマンドです。')
			.addFields(
			{ name: '/help', value: '(これ)BOTのコマンドの一覧を表示します。' },
			{ name: '/space', value: 'すべての文字の間にスペースを入れて主張します' },
            )
            .setTimestamp(new Date());
        const morehelp_button = new ButtonBuilder()
            .setLabel('詳しい説明 / MoreHelp')
            .setStyle('Link')
            .setURL('')
        const server_button = new ButtonBuilder()
            .setLabel('SupportServer')
            .setStyle('Link')
            .setURL('https://discord.gg/qJJfTpJz8T')
        const github_button = new ButtonBuilder()
            .setLabel('GitHub')
            .setStyle('Link')
            .setURL('https://github.com/Ks-777/PenaltyPro')
        const comp = new ActionRowBuilder()
            .addComponents(server_button, github_button);
        await interaction.reply({ embeds: [helpEmbed], components: [comp] });
    },
};