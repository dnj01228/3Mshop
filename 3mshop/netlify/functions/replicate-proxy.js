const axios = require("axios");

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  const replicateApiKey = process.env.REPLICATE_API_KEY;

  if (!replicateApiKey) {
    return {
      statusCode: 500,
      body: "Missing Replicate API key",
    };
  }

  try {
    const body = JSON.parse(event.body);

    const response = await axios.post(
      "https://api.replicate.com/v1/predictions",
      body,
      {
        headers: {
          Authorization: `Token ${replicateApiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (err) {
    console.error("🔥 Replicate API 에러:", err.response?.data || err.message);
    return {
      statusCode: 500,
      body: "Replicate API 호출 실패",
    };
  }
};
