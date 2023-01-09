import { addActionHandler, getGlobal, setGlobal } from '../../index';
import { callApi } from '../../../api/gramjs';
import * as mediaLoader from '../../../util/mediaLoader';
import { ApiMediaFormat } from '../../../api/types';
import {
  selectChat,
  selectChatMessage, selectCurrentChat,
  selectDefaultReaction,
  selectLocalAnimatedEmojiEffectByName,
  selectMaxUserReactions,
  selectMessageIdsByGroupId,
} from '../../selectors';
import { addMessageReaction, subtractXForEmojiInteraction, updateUnreadReactions } from '../../reducers/reactions';
import {
  addChatMessagesById, addChats, addUsers, updateChatMessage,
} from '../../reducers';
import { buildCollectionByKey, omit } from '../../../util/iteratees';
import { ANIMATION_LEVEL_MAX } from '../../../config';
import { isSameReaction, getUserReactions, isMessageLocal } from '../../helpers';

const INTERACTION_RANDOM_OFFSET = 40;

let interactionLocalId = 0;

addActionHandler('loadAvailableReactions', async () => {
  const result = await callApi('getAvailableReactions');
  if (!result) {
    return;
  }

  // Preload animations
  result.forEach((availableReaction) => {
    if (availableReaction.aroundAnimation) {
      mediaLoader.fetch(`sticker${availableReaction.aroundAnimation.id}`, ApiMediaFormat.BlobUrl);
    }
    if (availableReaction.centerIcon) {
      mediaLoader.fetch(`sticker${availableReaction.centerIcon.id}`, ApiMediaFormat.BlobUrl);
    }
  });

  setGlobal({
    ...getGlobal(),
    availableReactions: result,
  });
});

addActionHandler('interactWithAnimatedEmoji', (global, actions, payload) => {
  const {
    emoji, x, y, localEffect, startSize, isReversed,
  } = payload!;

  const activeEmojiInteraction = {
    id: interactionLocalId++,
    animatedEffect: emoji || localEffect,
    x: subtractXForEmojiInteraction(global, x) + Math.random()
      * INTERACTION_RANDOM_OFFSET - INTERACTION_RANDOM_OFFSET / 2,
    y: y + Math.random() * INTERACTION_RANDOM_OFFSET - INTERACTION_RANDOM_OFFSET / 2,
    startSize,
    isReversed,
  };

  return {
    ...global,
    activeEmojiInteractions: [...(global.activeEmojiInteractions || []), activeEmojiInteraction],
  };
});

addActionHandler('sendEmojiInteraction', (global, actions, payload) => {
  const {
    messageId, chatId, emoji, interactions, localEffect,
  } = payload!;

  const chat = selectChat(global, chatId);

  if (!chat || (!emoji && !localEffect) || chatId === global.currentUserId) {
    return;
  }

  void callApi('sendEmojiInteraction', {
    chat,
    messageId,
    emoticon: emoji || selectLocalAnimatedEmojiEffectByName(localEffect),
    timestamps: interactions,
  });
});

addActionHandler('sendDefaultReaction', (global, actions, payload) => {
  const {
    chatId, messageId,
  } = payload;
  const reaction = selectDefaultReaction(global, chatId);
  const message = selectChatMessage(global, chatId, messageId);

  if (!reaction || !message || isMessageLocal(message)) return;

  actions.toggleReaction({
    chatId,
    messageId,
    reaction,
  });
});

addActionHandler('toggleReaction', (global, actions, payload) => {
  const { chatId, reaction } = payload;
  let { messageId } = payload;

  const chat = selectChat(global, chatId);
  let message = selectChatMessage(global, chatId, messageId);

  if (!chat || !message) {
    return undefined;
  }

  const isInDocumentGroup = Boolean(message.groupedId) && !message.isInAlbum;
  const documentGroupFirstMessageId = isInDocumentGroup
    ? selectMessageIdsByGroupId(global, chatId, message.groupedId!)![0]
    : undefined;
  message = isInDocumentGroup
    ? selectChatMessage(global, chatId, documentGroupFirstMessageId!) || message
    : message;
  messageId = message?.id || messageId;

  const userReactions = getUserReactions(message);
  const hasReaction = userReactions.some((userReaction) => isSameReaction(userReaction, reaction));

  const newUserReactions = hasReaction
    ? userReactions.filter((userReaction) => !isSameReaction(userReaction, reaction)) : [...userReactions, reaction];

  const limit = selectMaxUserReactions(global);

  const reactions = newUserReactions.slice(-limit);

  void callApi('sendReaction', { chat, messageId, reactions });

  const { animationLevel } = global.settings.byKey;

  if (animationLevel === ANIMATION_LEVEL_MAX) {
    const newActiveReactions = hasReaction ? omit(global.activeReactions, [messageId]) : {
      ...global.activeReactions,
      [messageId]: [
        ...(global.activeReactions[messageId] || []),
        {
          messageId,
          reaction,
        },
      ],
    };
    global = {
      ...global,
      activeReactions: newActiveReactions,
    };
  }

  return addMessageReaction(global, message, reactions);
});

addActionHandler('openChat', (global) => {
  return {
    ...global,
    activeReactions: {},
  };
});

addActionHandler('stopActiveReaction', (global, actions, payload) => {
  const { messageId, reaction } = payload;

  if (!global.activeReactions[messageId]?.some((active) => isSameReaction(active.reaction, reaction))) {
    return global;
  }

  const newMessageActiveReactions = global.activeReactions[messageId]
    .filter((active) => !isSameReaction(active.reaction, reaction));

  const newActiveReactions = newMessageActiveReactions.length ? {
    ...global.activeReactions,
    [messageId]: newMessageActiveReactions,
  } : omit(global.activeReactions, [messageId]);

  return {
    ...global,
    activeReactions: newActiveReactions,
  };
});

addActionHandler('setDefaultReaction', async (global, actions, payload) => {
  const { reaction } = payload;

  const result = await callApi('setDefaultReaction', { reaction });
  if (!result) {
    return;
  }

  global = getGlobal();

  if (!global.config) {
    actions.loadConfig(); // Refetch new config, if it is somehow not loaded
    return;
  }

  setGlobal({
    ...global,
    config: {
      ...global.config,
      defaultReaction: reaction,
    },
  });
});

addActionHandler('stopActiveEmojiInteraction', (global, actions, payload) => {
  const { id } = payload;

  return {
    ...global,
    activeEmojiInteractions: global.activeEmojiInteractions?.filter((active) => active.id !== id),
  };
});

addActionHandler('loadReactors', async (global, actions, payload) => {
  const { chatId, messageId, reaction } = payload;
  const chat = selectChat(global, chatId);
  const message = selectChatMessage(global, chatId, messageId);
  if (!chat || !message) {
    return;
  }

  const offset = message.reactors?.nextOffset;
  const result = await callApi('fetchMessageReactionsList', {
    reaction,
    chat,
    messageId,
    offset,
  });

  if (!result) {
    return;
  }

  global = getGlobal();

  if (result.users?.length) {
    global = addUsers(global, buildCollectionByKey(result.users, 'id'));
  }

  setGlobal(updateChatMessage(global, chatId, messageId, {
    reactors: result,
  }));
});

addActionHandler('loadMessageReactions', (global, actions, payload) => {
  const { ids, chatId } = payload;

  const chat = selectChat(global, chatId);

  if (!chat) {
    return;
  }

  callApi('fetchMessageReactions', { ids, chat });
});

addActionHandler('sendWatchingEmojiInteraction', (global, actions, payload) => {
  const {
    chatId, emoticon, x, y, startSize, isReversed, id,
  } = payload;

  const chat = selectChat(global, chatId);

  if (!chat || !global.activeEmojiInteractions?.some((interaction) => interaction.id === id)
    || chatId === global.currentUserId) {
    return undefined;
  }

  callApi('sendWatchingEmojiInteraction', { chat, emoticon });

  return {
    ...global,
    activeEmojiInteractions: global.activeEmojiInteractions.map((activeEmojiInteraction) => {
      if (activeEmojiInteraction.id === id) {
        return {
          ...activeEmojiInteraction,
          x: subtractXForEmojiInteraction(global, x),
          y,
          startSize,
          isReversed,
        };
      }
      return activeEmojiInteraction;
    }),
  };
});

addActionHandler('fetchUnreadReactions', async (global, actions, payload) => {
  const { chatId, offsetId } = payload;
  const chat = selectChat(global, chatId);
  if (!chat) return;

  const result = await callApi('fetchUnreadReactions', { chat, offsetId, addOffset: offsetId ? -1 : undefined });

  // Server side bug, when server returns unread reactions count > 0 for deleted messages
  if (!result || !result.messages.length) {
    global = getGlobal();
    global = updateUnreadReactions(global, chatId, {
      unreadReactionsCount: 0,
    });

    setGlobal(global);
    return;
  }

  const { messages, chats, users } = result;

  const byId = buildCollectionByKey(messages, 'id');
  const ids = Object.keys(byId).map(Number);

  global = getGlobal();
  global = addChatMessagesById(global, chat.id, byId);
  global = addUsers(global, buildCollectionByKey(users, 'id'));
  global = addChats(global, buildCollectionByKey(chats, 'id'));
  global = updateUnreadReactions(global, chatId, {
    unreadReactions: [...(chat.unreadReactions || []), ...ids],
  });

  setGlobal(global);
});

addActionHandler('animateUnreadReaction', (global, actions, payload) => {
  const { messageIds } = payload;

  const { animationLevel } = global.settings.byKey;

  const chat = selectCurrentChat(global);
  if (!chat) return undefined;

  if (chat.unreadReactionsCount) {
    const unreadReactionsCount = chat.unreadReactionsCount - messageIds.length;
    const unreadReactions = (chat.unreadReactions || []).filter((id) => !messageIds.includes(id));

    global = updateUnreadReactions(global, chat.id, {
      unreadReactions,
    });

    setGlobal(global);

    if (!unreadReactions.length && unreadReactionsCount) {
      actions.fetchUnreadReactions({ chatId: chat.id, offsetId: Math.min(...messageIds) });
    }
  }

  actions.markMessagesRead({ messageIds });

  if (animationLevel !== ANIMATION_LEVEL_MAX) return undefined;

  global = getGlobal();

  return {
    ...global,
    activeReactions: {
      ...global.activeReactions,
      ...Object.fromEntries(messageIds.map((messageId) => {
        const message = selectChatMessage(global, chat.id, messageId);

        if (!message) return undefined;

        const unread = message.reactions?.recentReactions?.filter(({ isUnread }) => isUnread);

        if (!unread) return undefined;

        const reactions = unread.map((recent) => recent.reaction);

        return [messageId, reactions.map((r) => ({
          messageId,
          reaction: r,
        }))];
      }).filter(Boolean)),
    },
  };
});

addActionHandler('focusNextReaction', (global, actions) => {
  const chat = selectCurrentChat(global);

  if (!chat?.unreadReactions) return;

  actions.focusMessage({ chatId: chat.id, messageId: chat.unreadReactions[0] });
});

addActionHandler('readAllReactions', (global) => {
  const chat = selectCurrentChat(global);
  if (!chat) return undefined;

  callApi('readAllReactions', { chat });

  return updateUnreadReactions(global, chat.id, {
    unreadReactionsCount: undefined,
    unreadReactions: undefined,
  });
});
