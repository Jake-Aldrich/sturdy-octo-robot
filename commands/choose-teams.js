const { SlashCommandBuilder } = require('@discordjs/builders');
const _ = require("lodash"); 

// Get an array of users in voice channels
async function getMembersInVoice(interaction) {
    channels = await interaction.guild.channels.fetch();

    voice_channels = channels.filter(c => c.isVoice());

    voice_members = voice_channels.map(vc => {
        return vc.members.map(mem => {
            return mem.user.username
        })
    });

    return voice_members.flat();
}

// Divide users into teams 
function chooseTeams(team_count, players) {
    const teams = [];

    // Create the multidimensional array
    for (let i = 0; i < team_count; i++) {
        teams[i] = [];
    }

    // Add a random player to each team until there are no more players
    while (players.length > 0) {
        for (let i = 0; i < team_count; i++) {
            if(players.length > 0) {
                players = _.shuffle(players);
                teams[i].push(players.pop());
            }
        }
    }

    return teams;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('choose_teams')
		.setDescription('Randomly divide players into the specified number of teams.')
        .addIntegerOption(option =>
            option.setName('team_count')
                .setDescription('Number of teams')
                .setRequired(true)),
	async execute(interaction) {
        try {  
            const team_count = interaction.options.getInteger('team_count')            
            const voice_members = await getMembersInVoice(interaction)

            const teams = chooseTeams(team_count, voice_members);

            result = teams.map((t, i) => `Team ${i + 1}: ${t.join(', ')}`).join('\n');
        } catch (ex) {
            result = `Error dividing teams: ${ex}`;
        }

        await interaction.reply(result);
	},
};