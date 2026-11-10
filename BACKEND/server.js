import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

app.use("/api", chatRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});

const connectDB = async() => {
   try{
     await mongoose.connect(process.env.MONGO_ATLAS_URL);
     console.log("connected with Database");
   } catch(err){
     console.log("Failed to connect with Db", err);
   }
}

// app.post("/test", async (req, res) => {
//   const {query} = req.body;
//   const userMessage = query || "Hello";
//   const apiKey = process.env.GEMINI_API_KEY;
//   const modelName = "gemini-3.5-flash-lite";

//   // 1. URL mein API Key aur Model dono set hain
//   const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

//   // 2. Gemini REST API format Body Structure
//   const options = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       contents: [
//         {
//           role: "user",
//           parts: [{text: userMessage}],
//         },
//       ],
//     }),
//   };

//   try {
//     const response = await fetch(url, options);
//     const data = await response.json();
//     if (!response.ok) {
//       console.error("Gemini API Error:", data);
//       return res.status(response.status).json(data);
//     }

//     // Response text clean extract karke frontend ko bhejiyen
//     const replyText = data.candidates[0].content.parts[0].text;
//     console.log("Gemini API Response:", replyText);
//     res.json({ success: true, reply: replyText });
//   } catch (err) {
//     console.error("Server Error:", err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY,
// });

// async function generate() {
//   const prompt = "Differences between SQL & MongoDB";

//   try {
//     const response = await ai.models.generateContent({
//       model: "gemini-3.8-flash",
//       contents: prompt,
//     });
//     console.log(response.text);
//   } catch (error) {
//     console.log("Gemini 3.8-flash busy, falling back to 3.5-flash-lite...");
//     try {
//       const fallbackResponse = await ai.models.generateContent({
//         model: "gemini-3.5-flash-lite", // Updated model name
//         contents: prompt,
//       });
//       console.log(fallbackResponse.text);
//     } catch (fallbackError) {
//       console.error("Fallback model error:", fallbackError.message);
//     }
//   }
// }

// generate();