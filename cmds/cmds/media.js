module.exports = {
  name: "media",
  description: "أوامر الذكاء الاصطناعي والوسائط",
  async execute(api, event, args, config) {
    const command = args[0];
    
    // أمر الذكاء الاصطناعي (⚜︎ai)
    if (command === "ai") {
      const prompt = args.slice(1).join(" ");
      api.sendMessage(`جاري معالجة طلبك: ${prompt}`, event.threadID);
    }
  }
};
