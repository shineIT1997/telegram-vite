import { addActionHandler } from '../../index';

addActionHandler('openMediaViewer', (global, actions, payload) => {
  const {
    chatId, threadId, mediaId, avatarOwnerId, profilePhotoIndex, origin, volume, playbackRate, isMuted,
  } = payload;

  return {
    ...global,
    mediaViewer: {
      ...global.mediaViewer,
      chatId,
      threadId,
      mediaId,
      avatarOwnerId,
      profilePhotoIndex,
      origin,
      isHidden: false,
      volume: volume ?? global.mediaViewer.volume,
      playbackRate: playbackRate || global.mediaViewer.playbackRate,
      isMuted: isMuted || global.mediaViewer.isMuted,
    },
    forwardMessages: {},
  };
});

addActionHandler('closeMediaViewer', (global) => {
  const {
    volume, isMuted, playbackRate, isHidden,
  } = global.mediaViewer;
  return {
    ...global,
    mediaViewer: {
      volume,
      isMuted,
      isHidden,
      playbackRate,
    },
  };
});

addActionHandler('setMediaViewerVolume', (global, actions, payload) => {
  const {
    volume,
  } = payload;

  return {
    ...global,
    mediaViewer: {
      ...global.mediaViewer,
      volume,
      isMuted: false,
    },
  };
});

addActionHandler('setMediaViewerPlaybackRate', (global, actions, payload) => {
  const {
    playbackRate,
  } = payload;

  return {
    ...global,
    mediaViewer: {
      ...global.mediaViewer,
      playbackRate,
    },
  };
});

addActionHandler('setMediaViewerMuted', (global, actions, payload) => {
  const {
    isMuted,
  } = payload;

  return {
    ...global,
    mediaViewer: {
      ...global.mediaViewer,
      isMuted,
    },
  };
});

addActionHandler('setMediaViewerHidden', (global, actions, payload) => {
  const isHidden = payload;

  return {
    ...global,
    mediaViewer: {
      ...global.mediaViewer,
      isHidden,
    },
  };
});
