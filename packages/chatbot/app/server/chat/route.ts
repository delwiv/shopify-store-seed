import fs from "fs/promises";
// import OpenAI from "openai";
import { LangChainStream, OpenAIStream, StreamingTextResponse } from "ai";
import { OpenAI } from "langchain/llms/openai";
import { RetrievalQAChain } from "langchain/chains";
import { FaissStore } from "langchain/vectorstores/faiss";
import { HuggingFaceInferenceEmbeddings } from "langchain/embeddings/hf";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "langchain/schema/runnable";
import { StringOutputParser } from "langchain/schema/output_parser";

// export const 0runtime = "nodejs";

export async function POST(req: Request) {
  const { messages, lang } = await req.json();

  const model = new OpenAI({
    configuration: {
      basePath: process.env.OPENAI_BASE_URL || "http://localhost/5001/v1",
      apiKey: "dummy lol",
    },
  });

  const frPrompt = `Vous travaillez pour l'agence web Fifty-Fyfti Agency (FFA). Fifty-Fyfti Agency réalise des solutions headless pour boutiques Shopify. Vous êtes expert dans les technologies headless pour Shopify comme Hydrogen et Sanity. Vous aidez les visiteurs dans leurs questions et tentez d'en faire de nouveaux clients. Vous fournirez des réponses concises, en vouvoyant les interlocuteurs et en proposant les services et expertises de FFA. Vous utiliserez le contexte suivant pour répondre:\n{context}`;
  const prompt = `You work for Fifty-Fyfti Agency (FFA), a web consulting agency. You are an expert on headless web stacks, you develop and deploy hydrogen frontends for shopify store, with sanity as a backend. You assist curious visitors who may become clients. You will strictly use the ${
    lang || "French"
  } language.`;

  const vectorStore = await FaissStore.load(
    "../../../faiss.index",
    new HuggingFaceInferenceEmbeddings()
  );

  const retriever = vectorStore.asRetriever();

  const serializeDocs = (docs) =>
    docs
      .map((doc) => {
        console.log(doc.pageContent);
        return doc.pageContent;
      })
      .join("\n");

  const chain = RunnableSequence.from([
    {
      context: retriever.pipe(serializeDocs),
      question: new RunnablePassthrough(),
    },
    frPrompt,
    model,
    new StringOutputParser(),
  ]);

  const result = await chain.invoke("Pourquoi utiliser du zinc ?");
  console.log(result);
  // const response = await llm.chat.completions.create({
  //   stream: true,
  //   messages: [{ role: "system", content: frPrompt }, ...messages],
  // });
  //
  // const stream = OpenAIStream(response);
  //
  // return new StreamingTextResponse(stream);
}
