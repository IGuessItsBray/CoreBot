const { connectToDatabase } = require('../shared/utils/mongoClient');

(async () => {
  try {
    await connectToDatabase();
    console.log('[MongoTest] Connected successfully!');
    process.exit(0);
  } catch (err) {
    console.error('[MongoTest] Connection failed:', err);
    process.exit(1);
  }
})();