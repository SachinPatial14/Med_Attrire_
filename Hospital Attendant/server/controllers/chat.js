import Chat from "../models/chat.js";

export const postChat = async (req,res)=>{
    const { sender, role, message } = req.body;
    if (!sender || !role || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    try {
      const chatMessage = new Chat({ sender, role, message });
      await chatMessage.save();
      res.json({ message: "Message sent", chatMessage });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

export const getChat = async(req,res)=>{
    try {
        const messages = await Chat.find()
          .populate("sender", "name role")
          .sort({ createdAt: 1 });
        res.json({ messages });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
};