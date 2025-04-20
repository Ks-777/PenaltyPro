const version = '1.0.0-alpha';
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
    msgCounter.initMsgCounter(client);
    // ステータスの定期更新
    setInterval(() => {
        client.user.setActivity({
            name: `${client.ws.ping}ms|v${version}|/help`
        });
    }, 5000);
});

// 汎用関数
function memberCount() {
    const guild = client.guilds.cache.get('1250416661522153553');
    
    const members = guild.members.cache;
    const memberSize = members.filter(member => !member.user.bot).size;
    
    return memberSize;
}

function botCount() {
    const guild = client.guilds.cache.get('1250416661522153553');

    const members = guild.members.cache;
    const botSize = members.filter(member => member.user.bot).size;

    return botSize;
}
// ログイン(起動)
client.login(token);
console.log(`start bot ${client.user.tag}`);