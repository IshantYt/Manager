const TelegramBot = require('node-telegram-bot-api');

// create a bot instance
const bot = new TelegramBot('6295929019:AAGyjANMW9acGtD-UA0aWFUX-hqeXp3Y6tU', { polling: true });

// handle incoming messages
bot.on('message', async (msg) => {
  // check if the message was sent in a group chat
  if (msg.chat.type === 'group') {
    // get information about the user's chat membership status
    const chatMember = await bot.getChatMember(msg.chat.id, msg.from.id);
    // check if the user is an admin or owner
    if (chatMember.status === 'creator' || chatMember.status === 'administrator') {
      console.log(`User ${msg.from.id} is an admin or owner in group ${msg.chat.id}`);
       bot.sendChatAction(msg.chat.id, 'typing');
    } else {
      console.log(`User ${msg.from.id} is not an admin or owner in group ${msg.chat.id}`);
       bot.sendChatAction(msg.chat.id, 'typing');
    }
  }
});
