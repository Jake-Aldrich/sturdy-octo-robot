const { SlashCommandBuilder } = require('@discordjs/builders');

function rollDice(rolls, size) {
    let results = []
    for (let i = 0; i < rolls; i++) {
        results.push(
            Math.floor(Math.random() * size) + 1
        );
    }
    return results;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Roll dice with options to set the size and number of dice.')
        .addStringOption(option =>
            option.setName('size')
                .setDescription('Size of the dice to roll.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('number')
                .setDescription('Number of dice to roll.')
                .setRequired(true)),
	async execute(interaction) {
        try {
            // Parse the dice option  
            const dice_size = interaction.options.getString('size')
            const rolls = interaction.options.getString('number')

            const roll_results = rollDice(rolls, dice_size);
            
            // Format the results into a String to send as a response
            result = `Result of ${rolls}d${dice_size}:\n ${roll_results.join(' + ')}`;
            if(rolls > 1) {
                result += ` = ${roll_results.reduce((sum, x) => sum + x)}`;
            }
        } catch (ex) {
            result = `Error rolling the dice: ${ex}`;
        }

		await interaction.reply(result);
	},
};