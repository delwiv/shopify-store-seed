import { FaissStore } from "langchain/vectorstores/faiss";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { HtmlToTextTransformer } from "langchain/document_transformers/html_to_text";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { HuggingFaceInferenceEmbeddings } from "langchain/embeddings/hf";

const run = async () => {
  const loader = new CheerioWebBaseLoader("https://fifty-fyfti.agency", {
    selector: "main",
  });

  const docs = await loader.load();

  const splitter = RecursiveCharacterTextSplitter.fromLanguage("html");
  const transformer = new HtmlToTextTransformer();

  const sequence = splitter.pipe(transformer);

  const newDocs = await sequence.invoke(docs);

  console.log("import data in vector store...");
  const vectorStore = await FaissStore.fromDocuments(
    newDocs,
    new HuggingFaceInferenceEmbeddings()
  );

  await vectorStore.save(".");

  console.log("done");
};

run();
