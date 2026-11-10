import express from "express";
import Thread from "../models/Thread.js";
import getGeminiResponse from "../utils/gemini.js";

const router = express.Router();

router.post("/test", async(req, res)=>{
    try{
        const thread = new Thread({
            threadId: "xyz",
            title: "testing new Thread"
        });

        const response = await thread.save();
        res.status(201).json({ success: true, data: response});
    } catch(err){
        console.log(err);
        res.status(500).json({error: "Failed to save in DB"});
    }
});

//Get all threads

router.get("/thread", async(req, res) => {
    try{
        const threads = await Thread.find({}).sort({updatedAt: -1});
        //descending order of updatedAt...most recent date on top
        res.json(threads);
    }catch(err){
        console.log(err);
        res.status(500).json({error: "Failed to fetch threads"});
    }
});

router.get("/thread/:threadId", async(req, res) => {
    const {threadId} = req.params;

    try{
      const thread = await Thread.findOne({threadId});

      if(!thread){
        return res.status(404).json({error: "Thread not found"});
      }
      res.json(thread.messages);

    }catch(err){
       console.log(err);
       res.status(500).json({error: "failed to fetch chat"});
    }
});

router.delete("/thread/:threadId", async(req, res) => {
    const {threadId} = req.params;

    try{
        const deletedThread = await Thread.findOneAndDelete({threadId});
        if(!deletedThread){
            res.status(404).json({error: "Thread not found"});
        }
        
        res.status(200).json({success: "Thread deleted successfully"});

    } catch(err){
        console.log(err);
        res.status(500).json({error: "failed to fetch chat"});
    }
});

router.post("/chat", async (req, res) => {
    const { threadId, message } = req.body;

    if (!threadId || !message) {
        return res.status(400).json({ error: "missing required fields" });
    }

    try {
        let thread = await Thread.findOne({ threadId });

        if (!thread) {
            // create a new thread in DB
            thread = new Thread({
                threadId,
                title: message,
                messages: [{ role: "user", content: message }],
            });
        } else {
            thread.messages.push({ role: "user", content: message });
        }

        // 1. get the reply FIRST
        const assistantReply = await getGeminiResponse(message);

        // 2. only then use it
        thread.messages.push({ role: "model", content: assistantReply });
        thread.updatedAt = new Date();

        await thread.save();
        res.json({ reply: assistantReply });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to process chat request" });
    }
});


export default router;