const mongo = require('mongodb').MongoClient;
const uuid = require('uuid').v4;

const getAuthSession = async ({ id }) =>
  await cmd(async db =>
    await db.collection('authSession').findOne({ id }));

const setAuthSession = async ({ created, handle, id }) =>
  await cmd(async db =>
    await db.collection('authSession').updateOne(
      { handle },
      { $set: { created, handle, id } },
      { upsert: true }));

const deleteAuthSessions = async ({ handle }) =>
  await cmd(async db =>
    await db.collection('authSession').deleteMany({ handle }));

const setError = async ({ message, orderSessionId, stack }) =>
  await cmd(async db =>
    await db.collection('error').updateOne(
      { message },
      { $set: { message, orderSessionId, stack } },
      { upsert: true }));

const getLoginLink = async ({ key }) =>
  await cmd(async db =>
    await db.collection('loginLink').findOne({ key }));

const setLoginLink = async ({ expiry, handle, key }) =>
  await cmd(async db =>
    await db.collection('loginLink').updateOne(
      { handle },
      { $set: { expiry, handle, key } },
      { upsert: true }));

const deleteLoginLinks = async ({ handle }) =>
  await cmd(async db =>
    await db.collection('loginLink').deleteMany({ handle }));

const setOrder = async ({
  customer,
  handle,
  id,
  products,
  stripe
}) =>
  await cmd(async db =>
    await db.collection('order').updateOne(
      { handle, id },
      { $set: { customer, handle, id, products, stripe } },
      { upsert: true }));

const getOrderById = async ({ id }) =>
  await cmd(async db =>
    await db.collection('order').findOne({ id }));

const getOrderSession = async ({ id }) =>
  await cmd(async db =>
    await db.collection('orderSession').findOne({ id }));

const setOrderSession = async ({ id, products }) =>
  await cmd(async db =>
    await db.collection('orderSession').updateOne(
      { id },
      { $set: { id, products } },
      { upsert: true }));

const setProduct = async ({
  description,
  handle,
  name,
  photos,
  price,
  id = uuid()
}) =>
  await cmd(async db =>
    await db.collection('product').updateOne(
      { handle, id },
      { $set: { description, handle, id, name, photos, price } },
      { upsert: true }));

const deleteProductById = async ({ id }) =>
  await cmd(async db =>
    await db.collection('product').deleteOne({ id }));

const getProductById = async ({ id }) =>
  await cmd(async db =>
    await db.collection('product').findOne({ id }));

// TODO paginate and reduce memory usage from toArray()
const getProductsByHandle = async ({ handle }) =>
  await cmd(async db =>
    await db.collection('product').find({ handle }).toArray());

const getStripeAccount = async ({ handle }) =>
  await cmd(async db =>
    await db.collection('stripeAccount').findOne({ handle }));

const setStripeAccount = async ({ handle, ...stripeAccount }) =>
  await cmd(async db =>
    await db.collection('stripeAccount').updateOne(
      { handle },
      { $set: { handle, ...stripeAccount } },
      { upsert: true }));

const setUser = async ({ description, email, handle, photo }) =>
  await cmd(async db =>
    await db.collection('user').updateOne(
      { email, handle },
      { $set: { description, email, handle, photo } },
      { upsert: true }));

const getUserByHandle = async ({ handle }) =>
  await cmd(async db =>
    await db.collection('user').findOne({ handle }));

const getUserExists = async ({ email, handle }) =>
  await cmd(async db =>
    await db.collection('user').findOne({ $or: [{ email }, { handle }] }));

const getUserFeature = async ({ handle }) =>
  await cmd(async db =>
    await db.collection('userFeature').findOne({ handle }));

const setUserFeature = async ({ handle, stripeCheckout }) =>
  await cmd(async db =>
    await db.collection('userFeature').updateOne(
      { handle },
      { $set: { handle, stripeCheckout } },
      { upsert: true }
    ));

module.exports = {
  getAuthSession,
  setAuthSession,
  deleteAuthSessions,
  setError,
  getLoginLink,
  setLoginLink,
  deleteLoginLinks,
  setOrder,
  getOrderById,
  getOrderSession,
  setOrderSession,
  setProduct,
  deleteProductById,
  getProductById,
  getProductsByHandle,
  getStripeAccount,
  setStripeAccount,
  setUser,
  getUserByHandle,
  getUserExists,
  getUserFeature,
  setUserFeature
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