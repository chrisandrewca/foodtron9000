const mongo = require('mongodb').MongoClient;

const setProduct = async ({ handle }, { description, photos, price, productName }) =>
  await cmd(async db =>
    await db.collection('product').updateOne(
      { handle },
      { $set: { description, photos, price, productName } },
      { upsert: true }));

const setUser = async ({ email, handle }, { }) =>
  await cmd(async db =>
    await db.collection('user').updateOne(
      { email, handle },
      { $set: { email, handle } },
      { upsert: true }));

const userExists = async ({ email, handle }) =>
  await cmd(async db =>
    await db.collection('user').findOne({ $or: [{ email }, { handle }] }));

module.exports = {
  setProduct,
  setUser,
  userExists
};

/*
 * Base
 */
const cmd = async (command) => {

  let client;
  try {

    client = await mongo.connect(
      `${process.env.MONGO_CONNECTION}`,
      { useUnifiedTopology: true });

  } catch (mongoError) {
    // TODO logging
    console.log({ mongoError });
  }

  if (!client) {
    return null;
  }

  let result = null;
  try {
    // TODO investigate who's catching resolve(result) when using the async api
    // https://github.com/mongodb/node-mongodb-native/blob/master/lib/operations/execute_operation.js#L61
    // because upsert returns an error when using the callback api that doesn't make it to the catch
    // callback api: MongoError: the update operation document must contain atomic operators.
    // async api: [[ dbUpsert ]] {"error":{"driver":true,"name":"MongoError"}}
    const db = client.db();
    result = await command(db);

  } catch (mongoCommandError) {
    // TODO logging
    console.log({ mongoCommandError });
    result = null;

  } finally {

    await client.close();
    return result;
  }
}