require('dotenv').config();
// .envで指定してください！！！
const token = process.env.token;
const appid = process.env.appid;
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST, Routes } = require('discord.js');
const rest = new REST({ version: '10' }).setToken(token);
const commands = [
    new SlashCommandBuilder()
    .setName('help')
    .setDescription('Send a list of BOT functions/BOTの機能一覧を送信')
    .toJSON(),
    new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!/Pingを取得します')
    .toJSON(),
    new SlashCommandBuilder()
    .setName('setup')
    .setDescription('セットアップまたはユーザーinit処理を開始')
    .toJSON(),
    new SlashCommandBuilder()
    .setName('score')
    .setDescription('(処罰に関する)スコアを確認します')
    .toJSON(),
    /* normal command registration template

    new SlashCommandBuilder()
    .setName('command_name')
    .setDescription('command description')
    (option)
    .toJSON(),  

    */
];
async function main() {
    try {
        await rest.put(
            Routes.applicationCommands(appid),
            { body: commands }
        );
        console.log('コマンドを登録しました。/Successfully registered application commands.');
    } catch (error) {
        console.error('Error registering application commands:', error);
    }
}

main();