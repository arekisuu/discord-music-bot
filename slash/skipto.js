const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skipto')
        .setDescription('Pula para uma música especificada')
        .addNumberOption((option) => 
            option.setName('numero').setDescription('A música a ser reproduzida').setMinValue(1).setRequired(true)),
    run: async ({client, interaction}) => {
        const queue = client.player.getQueue(interaction.guildId)

        if (!queue)
            return await interaction.editReply('Não há músicas na fila')
            const trackNum = interaction.options.getNumber('numero')
            if (trackNum > queue.tracks.length)
                return await interaction.editReply('Número inválido')
            queue.skipTo(trackNum - 1)
            await interaction.editReply(`Reprodução pulada para a música #${trackNum}`)
    },
}