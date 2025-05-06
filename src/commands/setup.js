const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB({ filePath: './db/db.sqlite' });

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('セットアップまたはユーザーinit処理を開始'),
    execute: async function(interaction) {
        const startEmbed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle('/setup | 確認中...')
            .setAuthor({ name: 'Create By KS' })
            .setDescription('**STATUS:** CHECKING... / セットアップに関する情報を取得中...')
            .setTimestamp(new Date());
        await interaction.reply({ embeds: [startEmbed] });
        let msg = await interaction.fetchReply();
        const guild_id = interaction.guild.id;
        // db内にsettings.{guild.id}がtrueであるか確認
        const setup = await db.get(`settings.${guild_id}.setup`);
        if (setup) {
            const setupEmbed_befor = new EmbedBuilder()
            .setColor('Blue')
            .setTitle('/setup | セットアップは完了しています')
            .setAuthor({ name: 'Create By KS' })
            .setDescription('**STATUS:** SUCCESS! / セットアップ完了')
            .setTimestamp(new Date());
            await interaction.editReply({ embeds: [setupEmbed_befor] });
        } else {
            const setupEmbed_befor = new EmbedBuilder()
                .setColor('Blue')
                .setTitle('/setup | セットアップ進行中...')
                .setAuthor({ name: 'Create By KS' })
                .setDescription('**STATUS:** IN PROGRESS / セットアップ中...')
                .setTimestamp(new Date());
            await interaction.editReply({ embeds: [setupEmbed_befor] });
            // defalt settings
            await db.set(`settings.${guild_id}.setup`, true);
            await db.set(`settings.${guild_id}.wicksupport`, true);
            await db.set(`settings.${guild_id}.wicksupport_ch`, 'none');
            await db.set(`settings.${guild_id}.automodsupport`, true);
            await db.set(`settings.${guild_id}.automodsupport_ch`, 'none');
            await db.set(`settings.${guild_id}.defalt_score`, 100);
            await db.set(`settings.${guild_id}.language`, 'ja');
            // hell/hard/normal/easy
            await db.set(`settings.${guild_id}.score`, 'hard');
            const setupEmbed_after = new EmbedBuilder()
                .setColor('Green')
                .setTitle('/setup | セットアップ完了')
                .setAuthor({ name: 'Create By KS' })
                .setDescription('**STATUS:** SUCCESS! / セットアップ完了')
                .setFields(
                    { name: 'Wick Support', value: 'TRUE\n/settings', inline: true },
                    { name: 'Automod Support', value: 'TRUE\n/settings', inline: true },
                    { name: 'Defalt Score', value: '100\n/settings', inline: true },
                    { name: 'Language', value: '**【変更不可】**\nJapanese(ja)\n/settings', inline: true },
                    { name: 'Score', value: 'HARD\n/settings', inline: true },
                )
                .setTimestamp(new Date());
            await interaction.editReply({ embeds: [setupEmbed_after] }); 
        }
    }
};