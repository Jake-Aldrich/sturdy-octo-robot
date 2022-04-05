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
		.setDescription('Roll a dice using the NdN format to set the dice number and type.')
        .addStringOption(option =>
            option.setName('dice')
                .setDescription('Number and type of dice to roll in the NdN format.')
                .setRequired(true)),
	async execute(interaction) {
        try {
            // Parse the dice option  
            const dice = interaction.options.getString('dice')
            const [rolls, dice_size] = dice.split('d');

            const roll_results = rollDice(rolls, dice_size);
            
            // Format the results into a String to send as a response
            result = `Result of ${dice}:\n ${roll_results.join(' + ')}`;
            if(rolls > 1) {
                result += ` = ${roll_results.reduce((sum, x) => sum + x)}`;
            }
        } catch (ex) {
            result = `Error rolling the dice: ${ex}`;
        }

		await interaction.reply(result);
	},
};