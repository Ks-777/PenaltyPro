const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const { QuickDB } = require('quick.db');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');

const app = express();
const db = new QuickDB({ filePath: './db/db.sqlite' });
app.use(bodyParser.urlencoded({ extended: true }));

const hcaptchaSecret = process.env.HCAPTCHA_SECRET;
const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

// 認証ページ表示
app.get('/verify', (req, res) => {
	const { state } = req.query;
	res.send(`
		<html>
		<head><script src="https://hcaptcha.com/1/api.js" async defer></script></head>
		<body>
			<form action="/verify" method="POST">
				<input type="hidden" name="state" value="${state}">
				<div class="h-captcha" data-sitekey="${process.env.HCAPTCHA_SITEKEY}"></div>
				<button type="submit">認証</button>
			</form>
		</body>
		</html>
	`);
});


// hCaptcha検証 → IP/失敗回数チェック → ロール付与
app.post('/verify', async (req, res) => {
	const token = req.body['h-captcha-response'];
	const state = req.body.state;
	const ip = req.ip;

	// IPブロック判定
	if (await db.get(`block_ip_${ip}`)) {
		return res.status(403).send('IPブロックされています');
	}

	// hCaptcha 検証
	const result = await fetch('https://hcaptcha.com/siteverify', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: `secret=${hcaptchaSecret}&response=${token}`
	}).then(r => r.json());

	if (!result.success) {
		// 失敗回数カウント＆5回でブロック
		const key = `fail_ip_${ip}`;
		const fails = (await db.get(key) || 0) + 1;
		await db.set(key, fails);
		if (fails >= 5) await db.set(`block_ip_${ip}`, true);
		return res.send('認証に失敗しました');
	}

	// 成功時：失敗カウント削除
	await db.delete(`fail_ip_${ip}`);

	// state から Discord ユーザー取得
	const userId = await db.get(`verify_state_${state}`);
	if (!userId) {
		return res.status(400).send('不正な state');
	}

	// ロール付与
	await rest.put(
		Routes.guildMemberRoles(process.env.GUILD_ID, userId),
		{ body: [process.env.ROLE_ID] }
	);

	await db.delete(`verify_state_${state}`);
	res.send('認証成功！ロールを付与しました');
});

app.listen(8080, () => console.log('Server running on port 8080'));
