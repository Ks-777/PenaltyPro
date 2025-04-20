// commandsと書いてありますが全てのインタラクション処理がここを経由します
const help = require('./help.js');

const userCommandTimestamps = {};
const userLastCommand = {};

async function handleInteraction(interaction) {
    try {
        if (interaction.isChatInputCommand()) {
            const userId = interaction.user.id;
            const now = Date.now();

            // 過去60秒以内の記録を更新
            if (!userCommandTimestamps[userId]) userCommandTimestamps[userId] = [];
            userCommandTimestamps[userId] = userCommandTimestamps[userId].filter(ts => now - ts < 60000);

            // 1分間に20回以上の実行チェック
            if (userCommandTimestamps[userId].length >= 20) {
                return interaction.reply({ content: '1分間に20回以上の実行があったため、クールタイム中です。', ephemeral: true });
            }

            // 直前実行チェック（全コマンド共通: 3秒以内）
            if (userLastCommand[userId] && (now - userLastCommand[userId].timestamp < 3000)) {
                return interaction.reply({ content: 'コマンドの連続実行は3秒間隔以上空けてください。', ephemeral: true });
            }

            // 同じコマンドの直前実行チェック: 5秒以内は実行しない
            if (userLastCommand[userId] && userLastCommand[userId].command === interaction.commandName && (now - userLastCommand[userId].timestamp < 5000)) {
                return interaction.reply({ content: '同じコマンドは5秒以内に再実行できません。', ephemeral: true });
            }

            // 記録更新
            userCommandTimestamps[userId].push(now);
            userLastCommand[userId] = { timestamp: now, command: interaction.commandName };

            // !コマンド処理!
            if (interaction.commandName === help.data.name) {
                await help.execute(interaction);
            }
        }
    } catch (error) {
        console.error('インタラクション処理中にエラーが発生しました:', error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'エラーが発生しました。', ephemeral: true });
        } else {
            await interaction.reply({ content: 'エラーが発生しました。', ephemeral: true });
        }
    }
}

module.exports = { handleInteraction };
