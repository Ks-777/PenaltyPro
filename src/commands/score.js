const { SlashCommandBuilder, EmbedBuilder,  } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB({ filePath: './db/db.sqlite' });

module.exports = {
    data: new SlashCommandBuilder()
        .setName('score')
        .setDescription('(処罰に関する)スコアを確認します'),
    execute: async function(interaction) {
        const startEmbed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle('/score | 確認中...')
            .setAuthor({ name: 'Create By KS' })
            .setDescription('**STATUS:** CHECKING... / スコアを確認中...')
            .setTimestamp(new Date());
        await interaction.reply({ embeds: [startEmbed] });
        let msg = await interaction.fetchReply();
        const user_id = interaction.user.id;
        // db内にsettings.{guild.id}がtrueであるか確認
        const score = await db.get(`users.${user_id}.score`);
        if (score != null && score != undefined) {
            const scoreEmbed_befor = new EmbedBuilder()
                .setColor('Green')
                .setTitle('/score | スコア確認完了')
                .setAuthor({ name: 'Create By KS' })
                .setDescription('**STATUS:** SUCCESS! / スコア確認完了')
                .addFields(
                    { name: 'Score', value: `${score}` },
                    { name: '違反履歴/logs', value: `` },
                )
                .setTimestamp(new Date());
            await interaction.editReply({ embeds: [scoreEmbed_befor] });
        } else {
            const guild_id = interaction.guild.id;
            const d_score = await db.get(`settings.${guild_id}.defalt_score`);
            await db.set(`users.${user_id}.score`, d_score);
            const scoreEmbed_befor = new EmbedBuilder()
                .setColor('Blue')
                .setTitle('/score | スコア確認完了')
                .setAuthor({ name: 'Create By KS' })
                .setDescription('**STATUS:** SUCCESS! / スコア確認完了 - 初期化されました。')
                .addFields(
                    { name: 'Score', value: `${d_score}` },
                )
                .setTimestamp(new Date());
            await interaction.followUp({ embeds: [scoreEmbed_befor] });
        }

    }
};
