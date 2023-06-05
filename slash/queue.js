const { SlashCommandBuilder } = require('@discordjs/builders')
const { EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Exibe a fila de músicas')
    .addNumberOption((option) => option.setName('página').setDescription('Número de páginas da fila').setMinValue(1)),

    run: async ({client, interaction}) => {
        const queue = client.player.getQueue(interaction.guildId)
        if (!queue || !queue.playing) {
            return await interaction.editReply('Não há músicas na fila')
        } 
        const totalPages = Math.ceil(queue.tracks.length / 10) || 1
        const page = (interaction.options.getNumber('página') || 1) - 1

        if (page > totalPages) 
            return await interaction.editReply(`Página inválida, há um total de ${totalPages} páginas de músicas`)

        const queueString = queue.tracks.slice(page * 10, page * 10 + 10).map((song, i) => {
            return `**${page * 10 + i + 1}.** \`[${song.duration}]\` ${song.title} -- <@${song.requestedBy.id}>`
        }).join('\n')

        const currentSong = queue.current

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`**Tocando agora**\n` +
                    (currentSong ? `\`[${currentSong.duration}]\` ${currentSong.title} -- <@${currentSong.requestedBy.id}>` : 'Nenhum') +
                    `\n\n**Fila**\n${queueString}`
                    )
                    .setFooter({
                        text: `Página ${page + 1} de ${totalPages}`
                    })
                    .setThumbnail(currentSong.thumbnail)
            ]
        })
    }
}