import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  console.log("POST REQUEST CALLED @@@@");
  const { question } = await request.json();
  console.log(" process.env.OPENAI_API_URL -->", process.env.OPENAI_API_URL);
  console.log(" process.env.OPENAI_API_KEY -->", process.env.OPENAI_API_KEY);
  try {
    const response = await fetch(process.env.OPENAI_API_URL as string, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a knowlegeable assistant that provides quality information.",
          },
          {
            role: "user",
            content: `Tell me ${question}`,
          },
        ],
      }),
    });

    const responseData = await response.json();
    console.log("responseData -->", responseData);
    if (responseData.error) {
      return NextResponse.json({ error: responseData.error?.message });
    }

    const reply = responseData.choices[0].message.content;

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.log("error =-=", error);
    return NextResponse.json({ error: error.message });
  }
};
