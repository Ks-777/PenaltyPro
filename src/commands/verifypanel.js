const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRow, ActionRowBuilder} = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB({ filePath: './db/db.sqlite' });


module.exports = {
    data: new SlashCommandBuilder()
        .setName('verifypanel')
        .setDescription('VerifyPanelの設定を行います')
        .addRoleOption(option =>
            option.setName('role_add')
                .setDescription('認証後付けるロールを選択 / verify add role')
                .setRequired(true)
        )
        .addRoleOption(option =>
            option.setName('role_remove')
                .setDescription('認証後外すロールを選択 / verify remove role')
        ),
    execute: async function(interaction) {
        await interaction.deferReply({ ephemeral: true }); 
        const roleAdd = interaction.options.getRole('role_add');
        const roleRemove = interaction.options.getRole('role_remove');
        const setup = await db.get(`settings.${interaction.guild.id}.verifypanel.setup`);
        if (setup) {
            await db.set(`settings.${interaction.guild.id}.verifypanel.setup`, false);
            await db.delete(`settings.${interaction.guild.id}.verifypanel.role_add`);
            await db.delete(`settings.${interaction.guild.id}.verifypanel.role_remove`);
        };
        if (roleRemove) {
            await db.set(`settings.${interaction.guild.id}.verifypanel.role_remove`, roleRemove.id);
        } else {
            try {
                await db.delete(`settings.${interaction.guild.id}.verifypanel.role_remove`);
            } catch (error) {
                console.log('role_remove is not set / ロールが設定されていません。');
            }
        } 
        await db.set(`settings.${interaction.guild.id}.verifypanel.role_add`, roleAdd.id);
        const verifypanel_embed = new EmbedBuilder()
            .setColor('Green')
            .setTitle('/verifypanel')
            .setAuthor({ name: 'Create By KS | verifyer' })
            .setDescription('CLICK TO VERIFY / 認証するにはクリックしてください')
            .addFields(
                { name: '安全性について(JP ONLY)', value: `ご質問ありがとうございます！\n当Botは日本のプログラマーにより作成された国産Botで、\n実績が多数ある信頼できるサーバーにて運営しています。\nさらに、ログには個人情報や皆様のアカウントにログインできる情報は一切取得していません。\nまた、このBotのプロフにある通りこのBotは完全オープンソースです。\n詳細はプロフからプライバシーポリシーをご確認ください。` },
                { name: 'How to verify / 認証方法', value: `ボタンを押し、リダイレクトしたWEBサイトにアクセスし、案内に従ってください。\nbutton to access the redirected website and follow the instructions. `, inline: true },
            )
        const verifyButton = new ButtonBuilder()
            .setCustomId('verify')
            .setLabel('Verify / 認証')
            .setStyle('Success')
            .setEmoji('✅')
        const verifyButtonRow = new ActionRowBuilder()
            .addComponents(verifyButton);
        const setupEmbed_after = new EmbedBuilder()
            .setColor('Green')
            .setTitle('/verifypanel | 認証パネル設定完了')
            .setAuthor({ name: 'Create By KS' })
            .setDescription('**STATUS:** SUCCESS! / 設定完了')
            .addFields(
                { name: '注意' , value: '前回のロール設定は破棄されました。' },
                { name: 'Verify Add Role', value: `ID:${roleAdd.id}` },
                { name: 'Verify Remove Role', value: `ID:${roleRemove ? roleRemove.id : 'なし'}` },
            )
            .setTimestamp(new Date());
        interaction.channel.send({ embeds: [verifypanel_embed], components: [verifyButtonRow] });
        await interaction.editReply({ embeds: [setupEmbed_after] });
    }
};