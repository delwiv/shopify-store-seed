import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const { messages, lang } = await req.json();

  console.log({ messages });

  const llm = new OpenAI({
    baseURL: process.env.OPENAI_BASE_URL || "http://localhost/5001/v1",
    apiKey: "dummy lol",
  });

  const prompt = `You work for Fifty-Fyfti Agency (FFA), a web consulting agency. You are an expert on headless web stacks, you develop and deploy hydrogen frontends for shopify store, with sanity as a backend. You assist curious visitors who may become clients. You will strictly use the ${
    lang || "French"
  } language.`;

  const payload = [{ role: "system", content: prompt }, ...messages];

  console.log({ payload });

  const response = await llm.chat.completions.create({
    stream: true,
    messages: payload,
  });

  const stream = OpenAIStream(response);

  return new StreamingTextResponse(stream);
}
