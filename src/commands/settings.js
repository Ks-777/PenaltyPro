const { SlashCommandBuilder, EmbedBuilder,  } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB({ filePath: './db/db.sqlite' });

module.exports = {
    data: new SlashCommandBuilder()
        .setName('settings')
        .setDescription('Botの設定を行います')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('設定する項目を選択してください')
                .addChoices(
                    { name: 'Wick Support', value: 'wicksupport' },
                    { name: 'Wick Support Channel', value: 'wicksupport_ch' },
                    { name: 'Automod Support', value: 'automodsupport' },
                    { name: 'Automod Support Channel', value: 'automodsupport_ch' },
                    { name: 'Default Score', value: 'defalt_score' },
                    { name: 'Language', value: 'language' },
                    { name: 'Score(difficulty)', value: 'score' },
                )
                .setRequired(true)),
    execute: async function(interaction) {
        const type = interaction.options.getString('type');
        switch (type) {
            case 'wicksupport':
                await interaction.deferReply({ ephemeral: true });
                const wickSupport = await db.get(`wickSupport_${interaction.guild.id}`);
                if (wickSupport) {
                    db.set(`wickSupport_${interaction.guild.id}`, false);
                    const wickSupportEmbed_befor = new EmbedBuilder()
                        .setColor('Green')
                        .setTitle('Wick Supportの設定')
                        .setDescription('Wick Supportを無効にしました')
                        .setTimestamp()
                        .setFooter({ text: 'Wick Supportの設定', iconURL: interaction.user.displayAvatarURL() });
                    await interaction.reply({ embeds: [wickSupportEmbed_befor], ephemeral: true });
                    return; 
                } else if (!wickSupport) {
                    db.set(`wickSupport_${interaction.guild.id}`, true);
                    const wickSupportEmbed_after = new EmbedBuilder()
                        .setColor('Green')
                        .setTitle('Wick Supportの設定')
                        .setDescription('Wick Supportを有効にしました')
                        .setTimestamp()
                        .setFooter({ text: 'Wick Supportの設定', iconURL: interaction.user.displayAvatarURL() });
                    await interaction.reply({ embeds: [wickSupportEmbed_after], ephemeral: true });
                    return; 
                }
                break;
            case 'wicksupport_ch':
                await interaction.reply({ content: 'Wick Support Channelの設定を行います。', ephemeral: true });
                break;
            case 'automodsupport':
                await interaction.reply({ content: 'Automod Supportの設定を行います。', ephemeral: true });
                break;
            case 'automodsupport_ch':
                await interaction.reply({ content: 'Automod Support Channelの設定を行います。', ephemeral: true });
                break;
            case 'defalt_score':
                await interaction.reply({ content: 'Default Scoreの設定を行います。', ephemeral: true });
                break;
            case 'language':
                const language_embed = new EmbedBuilder()
                    .setColor('Red')
                    .setTitle('お詫び | Language')
                    .setDescription('現在多言語機能は開発中です。 その間は言語設定を変更できません。')
                    .setTimestamp()
                    .setFooter({ text: 'Languageの設定', iconURL: interaction.user.displayAvatarURL() });
                await interaction.reply({ embeds: [language_embed], ephemeral: true });
                break;
            case 'score':
                await interaction.reply({ content: 'Score(difficulty)の設定を行います。', ephemeral: true });
                break;
        }
    }
};