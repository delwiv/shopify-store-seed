import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import { OpenAI } from "langchain/llms/openai";
import { FaissStore } from "langchain/vectorstores/faiss";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "langchain/schema/runnable";
import { StringOutputParser } from "langchain/schema/output_parser";
import { HuggingFaceInferenceEmbeddings } from "langchain/embeddings/hf";

const app = express();

app.use(cors());
app.use(bodyParser({ extended: true }));

app.use((req, res, next) => {
  console.log(`${req.method} | ${req.path}`);
  return next();
});

app.use("/chat", async (req, res, next) => {
  if (req.method === "post") {
    const { messages, lang } = req.body;

    const model = new OpenAI({
      configuration: {
        baseURL: process.env.OPENAI_BASE_URL || "http://localhost/5001/v1",
        // apiKey: "dummy lol",
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
  }
});

app.listen(3002);
