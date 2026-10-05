module.exports = {
  name: "system",
  description: "أوامر النظام والترحيب والاقتصاد",
  async execute(api, event, args, config) {
    const command = args[0];
    
    // أمر الترحيب (⚜︎greet)
    if (command === "greet") {
      api.sendMessage("أهلاً بك في المجموعة!", event.threadID);
    }
  }
};
