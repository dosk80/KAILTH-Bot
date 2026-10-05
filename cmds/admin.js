module.exports = {
  name: "admin",
  description: "أوامر الإدارة والحماية",
  async execute(api, event, args, config) {
    const command = args[0];
    
    // أمر تغيير اسم المجموعه (⚜︎nm)
    if (command === "nm") {
      const name = args.slice(1).join(" ");
      api.setTitle(name, event.threadID);
    }
    
    // أمر طرد عضو (⚜︎kick)
    if (command === "kick") {
      const mention = Object.keys(event.mentions)[0];
      if (mention) api.removeUserFromGroup(mention, event.threadID);
    }
  }
};
