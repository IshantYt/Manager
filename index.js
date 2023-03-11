const TelegramBot = require('node-telegram-bot-api');

// create a bot instance
const token = '6118662631:AAHRMWEtNNTUkmZI2_HYh8PRvQ41YxH7XuU';

// Create a bot instance
const bot = new TelegramBot(token, { polling: true });

const ownerID = '5246043923';

// Define a set to store the user IDs of users who have started the bot
const users = new Set();

// Define the handler function for the /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  // Add the user to the set of users who have started the bot
  users.add(chatId);

  const options = {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Add me to Group', url: 'http://t.me/Ishant2Point0_bot?startgroup=botstart' }],
        [{ text: 'Join Our News Channel !', url: 'https://t.me/Ishant_News_Area' }]
      ]
    }
  };

  // Send the message with the buttons
  bot.sendMessage(chatId, 'Choose a button:', options);
});

// Define the handler function for the /broadcast command
bot.onText(/\/broadcast/, (msg) => {
  const chatId = msg.chat.id;

  // Check if the sender is the owner
  if (chatId != ownerID) {
    bot.sendMessage(chatId, 'Sorry, only the owner can broadcast messages.');
    return;
  }

  // Prompt the owner for the message to broadcast
  bot.sendMessage(chatId, 'What message do you want to broadcast?')
    .then((promptMsg) => {
      // Define a function to handle the owner's response
      const handleBroadcastMessage = (responseMsg) => {
        const message = responseMsg.text ? responseMsg : promptMsg;

        // Broadcast the message to all users who have started the bot
        users.forEach((user) => {
          const options = { chat_id: user };

          if (message.text) {
            options.text = message.text;
          } else if (message.sticker) {
            options.sticker = message.sticker.file_id;
          } else if (message.animation) {
            options.animation = message.animation.file_id;
          } else if (message.video) {
            options.video = message.video.file_id;
          } else if (message.photo) {
            options.photo = message.photo[0].file_id;
          } else if (message.audio) {
            options.audio = message.audio.file_id;
          } else if (message.voice) {
            options.voice = message.voice.file_id;
          } else if (message.document) {
            options.document = message.document.file_id;
          }

          bot.sendMediaGroup([options]);
        });

        // Acknowledge the owner's message
        bot.sendMessage(chatId, `Message broadcasted to ${users.size} users.`);
      };

      // Set the function as the handler for the next message from the owner
      bot.once('message', handleBroadcastMessage);
    });
});



// handle incoming messages
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const userFirstName = msg.from.first_name;
  const userLastName = msg.from.last_name;
  const userName = msg.from.username;
  const messageText = msg.text;

  // Check if the message is a command
  if (messageText.startsWith('/')) {
    return;
  }

  // Forward the message to the bot owner
  bot.forwardMessage(ownerId, chatId, msg.message_id)
  bot.sendChatAction(ownerId, 'typing')
});


bot.onText(/\/ban/, (msg, match) => {
  const chatId = msg.chat.id;
  const messageId = msg.message_id;
  const banCommand = match[0];

  // Check if the user is an admin
  if (!msg.from || !msg.from.username || !msg.chat || !msg.chat.id || !msg.chat.type || msg.chat.type !== 'group' || !msg.chat.all_members_are_administrators) {
    bot.sendMessage(chatId, 'You must be an admin in a group chat to use this command.');
    return;
  }

  // Check if the ban command was sent in reply to a message
  if (msg.reply_to_message) {
    const bannedUserId = msg.reply_to_message.from.id;
    const bannedUserName = msg.reply_to_message.from.username;

    // Ban the user
    bot.kickChatMember(chatId, bannedUserId)
      .then(() => {
        bot.sendMessage(chatId, `User @${bannedUserName} has been banned.`);
      })
      .catch((error) => {
        bot.sendMessage(chatId, `An error occurred while trying to ban the user: ${error.message}`);
      });
  } else {
    // Parse the chat ID and username from the ban command
    const banArgs = banCommand.split(' ');
    if (banArgs.length < 3) {
      bot.sendMessage(chatId, 'Usage: /ban <chat_id> <username>');
      return;
    }

    const bannedChatId = parseInt(banArgs[1]);
    const bannedUserName = banArgs[2];

    // Ban the user
    bot.kickChatMember(bannedChatId, bannedUserName)
      .then(() => {
        bot.sendMessage(chatId, `User @${bannedUserName} has been banned from chat ${bannedChatId}.`);
      })
      .catch((error) => {
        bot.sendMessage(chatId, `An error occurred while trying to ban the user: ${error.message}`);
      });
  }
});
