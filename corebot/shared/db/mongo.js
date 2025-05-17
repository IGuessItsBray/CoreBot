// shared/db/mongo.js
import { MongoClient } from 'mongodb';
import config from '../../config/configLoader.js';

let client;
let db;

export async function connectToDatabase() {
  if (db) return db;

  const uri = config.database.mongoUri;
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    replicaSet: config.database.replicaSet || undefined,
  };

  try {
    client = new MongoClient(uri, options);
    await client.connect();
    db = client.db(config.database.name);
    console.log(`[MongoDB] Connected to ${config.database.name}`);
    return db;
  } catch (error) {
    console.error('[MongoDB] Connection failed:', error);
    throw error;
  }
}

export function getDb() {
  if (!db) throw new Error('Database not connected yet. Call connectToDatabase first.');
  return db;
}
