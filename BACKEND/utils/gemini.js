import "dotenv/config";

const getGeminiResponse = async (userMessage) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const modelName = "gemini-3.5-flash-lite";

  // 1. URL mein API Key aur Model dono set hain
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  // 2. Gemini REST API format Body Structure
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{text: userMessage || "Hello"}],
        },
      ],
    }),
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API Error Details:", data);
      return res.Error(data.error?.message || "Gemini API request failed");
    }

    // Response text clean extract karke frontend ko bhejiyen
    const replyText = data.candidates[0].content.parts[0].text;
    return replyText;
  } catch (err) {
    console.error("Error in getGeminiResponse utility:", err.message);
    throw err;
  }
};

export default getGeminiResponse;