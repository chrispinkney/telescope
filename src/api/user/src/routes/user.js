const { Router } = require('@senecacdot/satellite');
const { errors } = require('celebrate');
const celebrateSchema = require('../models/celebrateSchema');
const User = require('../models/user');
const db = require('../services/firestore');

const router = Router();

// get a user with a supplied id, validated by the celebrateSchema
// rejected if a user could not be found, otherwise user returned
router.get('/user/:id', celebrateSchema.get(), async (req, res, next) => {
  try {
    const userRef = db.collection('users').doc(req.params.id);
    const doc = await userRef.get();

    if (!doc.exists) {
      // logger.info(`User data (id: ${doc.id}) was requested by ${req.ip} but could not be found.`); ?
      res.status(404).json({
        msg: `User data (id: ${doc.id}) was requested but could not be found.`,
      });
    } else {
      // logger.info(`User data (id: ${doc.id}) was requested by ${req.ip} and served successfully.`); ?
      res.status(200).json(doc.data());
    }
  } catch (err) {
    next(err);
  }
});

// get all users
// rejected if the user collection is empty, otherwise users returned
router.get('/users', async (req, res, next) => {
  try {
    const usersRef = db.collection('users');
    const snapshot = await usersRef.get();

    if (snapshot.empty) {
      // logger.info(`User data (id: ${doc.id}) was requested by ${req.ip} but could not be found.`); ?
      res.status(404).json({
        msg: `That collection could not be found, or contains no data.`,
      });
    } else {
      // logger.info(
      //   `User data (id: ${doc.id}) was requested by ${req.ip} and served successfully.`
      // ); ?

      const usersArray = [];
      snapshot.forEach((doc) => {
        usersArray.push(doc.data());
      });

      res.status(200).json(usersArray);
    }
  } catch (err) {
    next(err);
  }
});

// post a user with supplied info, validated by the celebrateSchema
// rejected if a user already exists with that id, otherwise user created
router.post('/user', celebrateSchema.post(), async (req, res, next) => {
  try {
    const userRef = db.collection('users').doc(`${req.body.id}`);
    const doc = await userRef.get();

    if (doc.exists) {
      // logger.info(`User data (id: ${doc.id}) was requested by ${req.ip} but could not be found.`); ?
      res.status(400).json({
        msg: `User with id ${doc.id} was requested to be added, but already exists in the db.`,
      });
    } else {
      const user = new User(req.body);
      user.created = new Date().toLocaleString();
      await db
        .collection('users')
        .doc(`${req.body.id}`)
        .set(JSON.parse(JSON.stringify(user))); // the user object must be parsed and stringified to be persisted to firestore
      res.status(201).json({ msg: `Added user with id: ${req.body.id}` });
      // logger.info(`User added with id: ${req.body.id}:\n${JSON.stringify(req.body)} by ${req.ip}`); ?
    }
  } catch (err) {
    next(err);
  }
});

// put (update) a user with a supplied id, validated by the celebrateSchema
// rejected if a user could not be found, otherwise user updated
router.put('/user/:id', celebrateSchema.update(), async (req, res, next) => {
  try {
    const userRef = db.collection('users').doc(`${req.body.id}`);
    const doc = await userRef.get();

    if (!doc.exists) {
      // logger.info(`User data (id: ${doc.id}) was requested by ${req.ip} but could not be found.`); ?
      res.status(400).json({
        msg: `User with id ${doc.id} was requested to be updated, but does not exist in the db.`,
      });
    } else {
      const user = new User(req.body);
      user.updated = new Date().toLocaleString();
      await db
        .collection('users')
        .doc(`${req.body.id}`)
        .update(JSON.parse(JSON.stringify(user))); // the user object must be parsed and stringified to be persisted to firestore
      res.status(200).json({ msg: `Updated user ${req.body.id}` });
      // logger.info(`User added with id: ${req.body.id}:\n${JSON.stringify(req.body)} by ${req.ip}`); ?
    }
  } catch (err) {
    next(err);
  }
});

// delete a user with a supplied id, validated by the celebrateSchema
// rejected if a user could not be found, otherwise user deleted
router.delete('/user/:id', celebrateSchema.delete(), async (req, res, next) => {
  try {
    const userRef = db.collection('users').doc(req.params.id);
    const doc = await userRef.get();

    if (!doc.exists) {
      // logger.info(`User data (id: ${doc.id}) was requested by ${req.ip} but could not be found.`); ?
      res.status(404).json({
        msg: `User (id: ${req.params.id}) was attempted to be removed but could not be found.`,
      });
    } else {
      // logger.info(`User data (id: ${doc.id}) was requested by ${req.ip} and served successfully.`); ?
      await db.collection('users').doc(req.params.id).delete();
      res.status(200).json({
        msg: `User (id: ${req.params.id}) was removed.`,
      });
    }
  } catch (err) {
    next(err);
  }
});

router.use(errors());

module.exports = router;
