const { SlashCommandBuilder, EmbedBuilder, Client, Colors } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('BOTのコマンド一覧を送信'),
    execute: async function(interaction) {
        const ping = await interaction.client.ws.ping;
        const pingEmbed = new EmbedBuilder()
            .setColor('Green')
            .setTitle('/ping | BOTのPingを取得')
            .setAuthor({ name: 'Create By KS' })
            .setDescription('EndpointPingを取得中...')
            .addFields(
                { name: 'ClientPing', value: `${ping} ms` },
                { name: 'EndpointPing', value: `wait...` },
            )
            .setTimestamp(new Date());
        await interaction.reply({ embeds: [pingEmbed] });
        // コマンド実行時に送信したPingメッセージを定義
        let msg = await interaction.fetchReply();
        // APIEndpointのPingを取得したかった
        const apiPing = await msg.createdTimestamp - interaction.createdTimestamp;
        const n_pingEmbed = new EmbedBuilder()
            .setColor('Green')
            .setTitle('/ping | BOTのPingを取得')
            .setAuthor({ name: 'Create By KS' })
            .setDescription('EndpointPingを正常に取得しました。/Successfully fetched APIEndpointPing')
            .addFields(
                { name: 'ClientPing', value: `${ping} ms` },
                { name: 'APIEndpointPing', value: `${apiPing} ms` },
            )
            .setTimestamp(new Date());
        await interaction.editReply({ embeds: [n_pingEmbed] });
    },
};