const axios = require('axios');
const fs = require('node:fs');
const { Client, Collection, Intents } = require('discord.js');
require('dotenv').config()

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_VOICE_STATES] });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

let data = {};

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		response = await command.execute(interaction, data);
		if(response) {
			data = response;
		}
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.on('voiceStateUpdate', async (oldState, newState) => {
	voice_members = data[newState.guild.id]?.voice_members;
	member = (({ username, id }) => ({ username, id }))(await client.users.fetch(newState.id))
	joined = (newState.channel != null)
	
	console.log(`${member.username} ${joined ? 'joined': 'left'} a voice channel.`);
	
	if(voice_members) {
		if(joined && !voice_members.some((m => m.id == member.id))) {
			console.log("Adding user to voice members")
			voice_members.push(member)
		} else if (!joined) {
			console.log("Removing user from voice members")
			voice_members = voice_members.filter(m => m.id != member.id)
		}
		data[newState.guild.id].voice_members = voice_members
	}
})

client.login(process.env.DISCORD_TOKEN);