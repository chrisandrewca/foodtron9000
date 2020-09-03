module.exports = {
  async up(db) {

    // While /api/start does create a userFeature for new users
    // We have existing users whom do not have a userFeature
    // We use a migration to create a userFeature for each of them
    const userCursor = await db.collection('user').find();

    for await (const { handle } of userCursor) {

      await db.collection('userFeature').insertOne({
        handle
      });
    }
  },

  async down(db) {

    await db.collection('userFeature').drop();
  }
};
