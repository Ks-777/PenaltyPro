// 注意:コマンドの登録は自動で行いません。各自で node deploy_commands.js などで実行してください。
//      また、.envにtoken=(disocrdbotのトークン)とBotのUserID(BotID)をappid=(BotID)として指定してください。
require('dotenv').config();
const { QuickDB} = require('quick.db');
const db = new QuickDB({ filePath: './db/db.sqlite' });
const version = '1.0.0-alpha.03';
const token = process.env.token;
const { Client, GatewayIntentBits, Events, ChannelType, EmbedBuilder } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildExpressions,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.MessageContent,
        Object.values(GatewayIntentBits).reduce((a, b) => a | b)
    ]
});

client.on('ready', () => {
    console.log(`Ready ${client.user.tag}`);
    const members = memberCount();
    const servers = serverCount();
    // ステータスの定期更新
    setInterval(() => {
        client.user.setActivity({
            name: `${client.ws.ping}ms|v${version}|M:${members},S:${servers}|/help`
        });
    }, 5000);

    // get ip (tor,proxy)
    
});

// 各処理の読み込み
// messageCreate
const messageHandler = require('./message/_master_message.js');
// intractionCreate(commands)
const commandHandler = require('./commands/_master_commands.js');
client.on(Events.InteractionCreate, async (interaction) => {
    try {
        await commandHandler.handleInteraction(interaction);
    } catch (error) {
        console.error('Error handling interaction:', error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'Error executing command.', ephemeral: true });
        } else {
            await interaction.reply({ content: 'Error executing command.', ephemeral: true });
        }
    }
});

// 汎用関数
function memberCount() {
    let totalMembers = 0;
    client.guilds.cache.forEach(guild => {
        totalMembers += guild.members.cache.filter(member => !member.user.bot).size;
    });
    return totalMembers;
}

function serverCount() {
    return client.guilds.cache.size;
}
// ログイン(起動)
client.login(token);