const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Retoma a reprodução'),
    run: async ({client, interaction}) => {
        const queue = client.player.getQueue(interaction.guildId)

        if (!queue)
            return await interaction.editReply('Não há músicas na fila')
            queue.setPaused(false)
            await interaction.editReply('A música foi retomada! Use `/pause` para pausar a reprodução.')
    },
}