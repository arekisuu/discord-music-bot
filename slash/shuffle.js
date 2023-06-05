const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Coloca a fila em ordem aleatória'),
    run: async ({client, interaction}) => {
        const queue = client.player.getQueue(interaction.guildId)

        if (!queue)
            return await interaction.editReply('Não há músicas na fila')
            queue.shuffle()
            await interaction.editReply(`A fila de reprodução contendo ${queue.tracks.length} músicas foi embaralhada!`)
    },
}