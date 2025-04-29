import { DataAPIClient } from "@datastax/astra-db-ts";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import "dotenv/config";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { CohereEmbeddings } from "@langchain/cohere";

const {
    ASTRA_DB_NAMESPACE,
    ASTRA_DB_COLLECTION,
    ASTRA_DB_API_ENDPOINT,
    ASTRA_DB_APPLICATION_TOKEN,
    ASTRA_DB_SOURCE,
    HUGGINGFACE_API_KEY,
    COHERE_API_KEY
} = process.env;


// Initialize embedding models
const embeddingModels = {
    huggingface: new HuggingFaceInferenceEmbeddings({
        apiKey: HUGGINGFACE_API_KEY,
        model: "sentence-transformers/all-mpnet-base-v2" // 768 dimensions
    }),
    cohere: new CohereEmbeddings({
        apiKey: COHERE_API_KEY,
        model: "embed-english-v3.0" // 1024 dimensions
    }),
    // ollama: new OllamaEmbeddings({
    //     model: "llama2" // Run locally, 4096 dimensions
    // })
};


// Choose which embedding model to use
const embeddingModel = embeddingModels.huggingface; // or cohere, or ollama

// Connects to Astra DB
const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT!, {
    keyspace: ASTRA_DB_NAMESPACE
});

const sigmaData = await db.collection(ASTRA_DB_SOURCE!);
console.log(sigmaData);

// This needs to query from the prepopulated Astra DB
// const sigmaData = []

// console.log(openai);
// const loader = new PuppeteerWebBaseLoader("https://langchain.com/");

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 512,
    chunkOverlap: 100
});

// Get the dimension size based on the chosen embedding model
const getDimension = (model: typeof embeddingModel) => {
    if (model === embeddingModels.huggingface) return 768;
    // if (model === embeddingModels.cohere) return 1024;
    return 4096; // ollama
};

const createCollection = async (similarityMetric: "dot_product" | "cosine" | "euclidean" = "dot_product") => {
    const dimension = getDimension(embeddingModel);
    const res = await db.createCollection(ASTRA_DB_COLLECTION!, {
        vector: {
            dimension: dimension,
            metric: similarityMetric
        }
    });
    console.log(res);
}

const loadSampleData = async () => {
    const targetCollection = await db.collection(ASTRA_DB_COLLECTION!);
    const sourceCollection = await db.collection(ASTRA_DB_SOURCE!);

    try {
        // Delete all existing documents in the target collection
        console.log('Deleting existing documents...');
        await targetCollection.deleteMany({});
        console.log('All existing documents deleted');

        // Query all documents from the source collection
        const sourceDocs = await sourceCollection.find({}).toArray();
        console.log(`Found ${sourceDocs.length} documents to process`);

        for (const doc of sourceDocs) {
            try {
                // Create text content from pool data
                const content = `
                    Pool ID: ${doc.poolId}
                    Quote Token: ${doc.quoteToken}
                    Pool Index: ${doc.poolIndex}
                    APY: ${doc.apy}%
                    Fee Rate: ${doc.feeRate}
                    Total Volume: $${doc.totalVolume}
                    Swap Count: ${doc.swapCount}
                    Creation Time: ${new Date(doc.creationTime).toISOString()}
                    Last Updated: ${new Date(doc.lastUpdated).toISOString()}
                    Details: ${JSON.stringify(doc.details, null, 2)}
                `.trim();

                console.log('Processing document:', {
                    id: doc._id,
                    poolId: doc.poolId,
                    contentLength: content.length
                });

                // Split the content into chunks
                const chunks = await splitter.splitText(content);
                console.log(`Split document into ${chunks.length} chunks`);

                if (chunks.length === 0) {
                    console.log(`No chunks generated for document ${doc._id}`);
                    continue;
                }

                // Process each chunk
                for (const chunk of chunks) {
                    try {
                        // Generate embedding using the chosen model
                        const vector = await embeddingModel.embedQuery(chunk);

                        // Insert into target collection with proper field names
                        await targetCollection.insertOne({
                            vector: vector,
                            text: chunk,
                            sourceDocId: doc._id,
                            metadata: {
                                poolId: doc.poolId,
                                quoteToken: doc.quoteToken,
                                apy: doc.apy,
                                chunkIndex: chunks.indexOf(chunk),
                                totalChunks: chunks.length,
                                timestamp: new Date()
                            }
                        });
                        console.log(`Inserted chunk ${chunks.indexOf(chunk) + 1}/${chunks.length}`);
                    } catch (chunkError) {
                        console.error(`Error processing chunk in document ${doc._id}:`, chunkError);
                    }
                }
            } catch (error) {
                console.error(`Error processing document ${doc._id}:`, error);
            }
        }

        console.log('Finished processing all documents');
    } catch (error) {
        console.error('Error in loadSampleData:', error);
    }
}

createCollection().then(() => loadSampleData());

// const chunks = await splitter.splitText(sigmaData);

// collection.insert(sigmaData);