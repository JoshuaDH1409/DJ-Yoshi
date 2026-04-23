const { SlashCommandBuilder } = require('discord.js');
const { isLavalinkAvailable, handleLavalinkError } = require('../utils/interactionHelpers');
const { getValidVolume } = require('../utils/volumeValidator');
const logger = require('../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('playlist')
        .setDescription('Adds a playlist to the queue.')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('Playlist URL or search query.')
                .setRequired(true)
                .setMaxLength(500)),
    async execute(interaction) {
        const { client, guild, options } = interaction;
        const query = options.getString('query');
        const lang = client.defaultLanguage;

        try {
            if (!interaction.inGuild() || !guild) {
                return await interaction.reply({ content: client.languageManager.get(lang, 'NOT_IN_VOICE'), ephemeral: true });
            }

            const cachedVoiceState = guild.voiceStates.cache.get(interaction.user.id);
            const member = interaction.member ?? await guild.members.fetch({ user: interaction.user.id, force: true });
            const voiceChannel = cachedVoiceState?.channel ?? member?.voice?.channel;

            if (!voiceChannel) {
                return await interaction.reply({ content: client.languageManager.get(lang, 'NOT_IN_VOICE'), ephemeral: true });
            }

            if (!isLavalinkAvailable(client)) {
                return await interaction.reply({
                    content: client.languageManager.get(lang, 'LAVALINK_UNAVAILABLE'),
                    ephemeral: true
                });
            }

            await interaction.deferReply();
            logger.cmd(`/playlist "${query}" by ${member.user.tag} in #${interaction.channel?.name || 'DM'} (Guild: ${guild.name})`);

            let player = client.lavalink.getPlayer(guild.id);
            if (!player) {
                player = client.lavalink.createPlayer({
                    guildId: guild.id,
                    voiceChannelId: voiceChannel.id,
                    textChannelId: interaction.channel.id,
                    selfDeaf: true,
                    selfMute: false,
                    volume: getValidVolume(process.env.DEFAULT_VOLUME, 80),
                });
            }

            if (player.voiceChannelId && player.voiceChannelId !== voiceChannel.id) {
                return interaction.editReply({
                    content: client.languageManager.get(lang, 'ERROR_SAME_VOICE_CHANNEL'),
                    ephemeral: true,
                });
            }

            if (!player.connected) {
                player.connect();
            }

            const res = await player.search({ query }, interaction.user);
            if (!res || !res.tracks.length) {
                return interaction.editReply({ content: client.languageManager.get(lang, 'NO_RESULTS') });
            }

            if (res.loadType !== 'playlist') {
                return interaction.editReply({ content: client.languageManager.get(lang, 'NO_RESULTS') });
            }

            player.queue.add(res.tracks);

            if (!player.playing) {
                player.play();
            }

            const replyContent = client.languageManager.get(lang, 'PLAYLIST_ADDED', res.playlist?.title);
            await interaction.editReply({ content: replyContent });

            const existingMessageId = client.playerController.playerMessages.get(guild.id);
            if (existingMessageId) {
                await client.playerController.updatePlayer(guild.id);
            } else {
                await client.playerController.sendPlayer(interaction.channel, player);
            }
        } catch (error) {
            if (error.code === 10062) {
                logger.warn('Interaction expired for /playlist command');
                return;
            }
            logger.error('Error in playlist command:', error);
            await handleLavalinkError(interaction, error, client);
        }
    },
};
