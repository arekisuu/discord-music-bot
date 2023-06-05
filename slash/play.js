const { SlashCommandBuilder } = require('@discordjs/builders')
const { EmbedBuilder } = require('discord.js')
const { QueryType } = require('discord-player')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Adiciona uma música ou playlist na fila a partir de um link ou termos de busca')
        .addStringOption((option) => option.setName('termos').setDescription('termos de busca').setRequired(true)),
    
    run: async ({client, interaction}) => {
        if (!interaction.member.voice.channel)
            return interaction.editReply("É preciso estar em um canal de voz para usar este comando")
        
        const queue = await client.player.createQueue(interaction.guild)
        if (!queue.connection) await queue.connect(interaction.member.voice.channel)

        let embed = new EmbedBuilder()

        if (interaction.commandName === 'play') {
            let url = interaction.options.getString('termos')
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })
            if (result.tracks.length === 0) 
                return interaction.editReply('Nenhum resultado encontrado')
            if (!result.playlist) {
                const song = result.tracks[0]
                await queue.addTrack(song)
                embed
                    .setDescription(`**${song.title} ${song.url}** foi adicionada à fila`)
                    .setThumbnail(song.thumbnail)
                    .setFooter({text: `Duração: ${song.duration}`})
            }
            else if (result.playlist) {
                queue.addTracks(result.tracks)
                embed
                    .setDescription(`**${result.tracks.length} músicas de ${result.playlist.title} ${result.playlist.url}** foram adicionadas à fila`)
             } 
        }
        if (!queue.playing) await queue.play()
        await interaction.editReply({
            embeds: [embed]
        })
    }
}