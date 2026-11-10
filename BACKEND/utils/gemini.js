import "dotenv/config";

const getGeminiResponse = async (userMessage) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const modelName = "gemini-1.5-flash"; // 👉 gemini-1.5-flash standard and stable model name use kar

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: userMessage || "Hello" }],
        },
      ],
    }),
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API Error Details:", data);
      throw new Error(data.error?.message || "Gemini API request failed");
    }

    const replyText = data.candidates[0].content.parts[0].text;
    return replyText;

  } catch (err) {
    console.error("Error in getGeminiResponse utility:", err.message);
    throw err;
  }
};

export default getGeminiResponse;