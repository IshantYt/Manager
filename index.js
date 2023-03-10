const TelegramBot = require('node-telegram-bot-api');

// create a bot instance
const bot = new TelegramBot('6118662631:AAHJWHMFNQZ99autGEGWtdcc8pifnTcqWX4', { polling: true });

// define the promote function
function promote(msg) {
  // check if the user issuing the command is an admin or owner
  if (!is_admin(msg.chat.id, msg.from.id)) {
    bot.sendMessage(msg.chat.id, "Sorry, only admins or owners can use this command.");
    return;
  }
  // check if the command is being issued in a group chat
  if (msg.chat.type != "group") {
    bot.sendMessage(msg.chat.id, "This command can only be used in a group chat.");
    return;
  }
  // get the user to be promoted
  const user_id = msg.reply_to_message.from.id;
  // promote the user to admin
  bot.promoteChatMember(msg.chat.id, user_id, {
    can_change_info: true,
    can_invite_users: true,
    can_delete_messages: true,
    can_restrict_members: true,
    can_pin_messages: true,
    can_promote_members: false
  });
}

// define the demote function
function demote(msg) {
  // check if the user issuing the command is an admin or owner
  if (!is_admin(msg.chat.id, msg.from.id)) {
    bot.sendMessage(msg.chat.id, "Sorry, only admins or owners can use this command.");
    return;
  }
  // check if the command is being issued in a group chat
  if (msg.chat.type != "group") {
    bot.sendMessage(msg.chat.id, "This command can only be used in a group chat.");
    return;
  }
  // get the user to be demoted
  const user_id = msg.reply_to_message.from.id;
  // demote the user from admin
  bot.promoteChatMember(msg.chat.id, user_id, {
    can_change_info: false,
    can_invite_users: false,
    can_delete_messages: false,
    can_restrict_members: false,
    can_pin_messages: false,
    can_promote_members: false
  });
}

// define a helper function to check if a user is an admin or owner
function is_admin(chat_id, user_id) {
  bot.getChatMember(chat_id, user_id).then(chat_member => {
    return chat_member.status === "administrator" || chat_member.status === "creator";
  });
}

// add the promote and demote handlers to the bot
bot.onText(/\/promote/, promote);
bot.onText(/\/demote/, demote);
