const request = require('supertest');
const firebaseTesting = require('@firebase/rules-unit-testing');

const { app } = require('../../index');
const User = require('../../src/models/user');

// Utility functions
const clearData = async () => {
  await firebaseTesting.clearFirestoreData({ projectId: 'telescope' });
};

const getUser = (id) => request(app).get(`/${id}`);

const getUsers = () => request(app).get('/');

const postUser1 = async () => {
  const body = {
    id: 10001,
    firstName: 'Galileo',
    lastName: 'Galilei',
    displayName: 'Galileo Galilei',
    isAdmin: true,
    isFlagged: true,
    feeds: ['https://dev.to/feed/galileogalilei'],
    github: {
      username: 'galileogalilei',
      avatarUrl:
        'https://avatars.githubusercontent.com/u/7242003?s=460&u=733c50a2f50ba297ed30f6b5921a511c2f43bfee&v=4',
    },
  };
  const user = new User(body);
  user.created = new Date().toLocaleString();

  const response = await request(app).post('/').set('Content-Type', 'application/json').send(user);

  return response;
};

const postUser2 = async () => {
  const body = {
    id: 10002,
    firstName: 'Carl',
    lastName: 'Sagan',
    displayName: 'Carl Sagan',
    isAdmin: true,
    isFlagged: true,
    feeds: ['https://dev.to/feed/carlsagan'],
    github: {
      username: 'carlsagan',
      avatarUrl:
        'https://avatars.githubusercontent.com/u/7242003?s=460&u=733c50a2f50ba297ed30f6b5921a511c2f43bfee&v=4',
    },
  };
  const user = new User(body);
  const response = await request(app).post('/').set('Content-Type', 'application/json').send(user);

  return response;
};

// Tests
describe('GET REQUESTS', () => {
  beforeEach(() => clearData());
  afterEach(() => clearData());

  test('process.env.development === localhost:8088', () => {
    expect(process.env.FIRESTORE_EMULATOR_HOST).toEqual('localhost:8088');
  });

  test('Get JSON, get all users', async () => {
    await postUser1();
    await postUser2();
    const response = await getUsers();
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body).toStrictEqual([
      {
        id: 10001,
        firstName: 'Galileo',
        lastName: 'Galilei',
        displayName: 'Galileo Galilei',
        isAdmin: true,
        isFlagged: true,
        feeds: ['https://dev.to/feed/galileogalilei'],
        github: {
          username: 'galileogalilei',
          avatarUrl:
            'https://avatars.githubusercontent.com/u/7242003?s=460&u=733c50a2f50ba297ed30f6b5921a511c2f43bfee&v=4',
        },
      },
      {
        id: 10002,
        firstName: 'Carl',
        lastName: 'Sagan',
        displayName: 'Carl Sagan',
        isAdmin: true,
        isFlagged: true,
        feeds: ['https://dev.to/feed/carlsagan'],
        github: {
          username: 'carlsagan',
          avatarUrl:
            'https://avatars.githubusercontent.com/u/7242003?s=460&u=733c50a2f50ba297ed30f6b5921a511c2f43bfee&v=4',
        },
      },
    ]);
  });

  test('Get JSON, Accepted - postUser() was called, thus user 10001 exists', async () => {
    await postUser1();
    const response = await getUser(10001);
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({
      id: 10001,
      firstName: 'Galileo',
      lastName: 'Galilei',
      displayName: 'Galileo Galilei',
      isAdmin: true,
      isFlagged: true,
      feeds: ['https://dev.to/feed/galileogalilei'],
      github: {
        username: 'galileogalilei',
        avatarUrl:
          'https://avatars.githubusercontent.com/u/7242003?s=460&u=733c50a2f50ba297ed30f6b5921a511c2f43bfee&v=4',
      },
    });
  });

  test('Get JSON, Rejected - postUser() was not called, thus no users exist', async () => {
    const response = await getUser(10001);
    expect(response.statusCode).toBe(404);
    expect(response.body).toStrictEqual({
      msg: 'User data (id: 10001) was requested but could not be found.',
    });
  });
});

describe('PUT REQUESTS', () => {
  beforeEach(() => clearData());
  afterEach(() => clearData());

  test('Put JSON, Accepted - updated an existing user', async () => {
    await postUser1();
    const body = {
      id: 10001,
      firstName: 'Galileo',
      lastName: 'Galilei',
      displayName: 'Sir Galileo Galilei',
      isAdmin: true,
      isFlagged: true,
      feeds: ['https://dev.to/feed/galileogalilei'],
      github: {
        username: 'galileogalilei',
        avatarUrl:
          'https://avatars.githubusercontent.com/u/7242003?s=460&u=733c50a2f50ba297ed30f6b5921a511c2f43bfee&v=4',
      },
    };

    const response = await request(app)
      .put('/10001')
      .set('Content-Type', 'application/json')
      .send(body);

    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({
      msg: 'Updated user 10001',
    });
  });
  test('Put JSON, Rejected - tried to update a nonexistent user', async () => {
    const body = {
      id: 10002,
      firstName: 'Carl',
      lastName: 'Sagan',
      displayName: 'Carl Sagan',
      isAdmin: true,
      isFlagged: true,
      feeds: ['https://dev.to/feed/carlsagan'],
      github: {
        username: 'carlsagan',
        avatarUrl:
          'https://avatars.githubusercontent.com/u/7242003?s=460&u=733c50a2f50ba297ed30f6b5921a511c2f43bfee&v=4',
      },
    };

    const response = await request(app)
      .put('/10002')
      .set('Content-Type', 'application/json')
      .send(body);

    expect(response.statusCode).toBe(400);
    expect(response.body).toStrictEqual({
      msg: 'User with id 10002 was requested to be updated, but does not exist in the db.',
    });
  });
});

describe('POST REQUESTS', () => {
  beforeEach(() => clearData());
  afterEach(() => clearData());

  test('Post JSON, Accepted - postUser() was called, thus user 10001 was created', async () => {
    const response = await postUser1();
    expect(response.statusCode).toBe(201);
    expect(response.body).toStrictEqual({ msg: 'Added user with id: 10001' });
  });

  test('Post JSON, Rejected - postUser() was called twice, but user 10001 already exists', async () => {
    await postUser1();
    const response = await postUser1();

    expect(response.statusCode).toBe(400);
    expect(response.body).toStrictEqual({
      msg: 'User with id 10001 was requested to be added, but already exists in the db.',
    });
  });

  test('Post JSON, Rejected - Feeds array must only contain strings', async () => {
    const body = {
      id: 10002,
      firstName: 'Carl',
      lastName: 'Sagan',
      displayName: 'Carl Sagan',
      isAdmin: true,
      isFlagged: true,
      feeds: [123],
      github: {
        username: 'carlsagan',
        avatarUrl:
          'https://avatars.githubusercontent.com/u/7242003?s=460&u=733c50a2f50ba297ed30f6b5921a511c2f43bfee&v=4',
      },
    };

    const response = await request(app)
      .post('/')
      .set('Content-Type', 'application/json')
      .send(body);

    expect(response.statusCode).toBe(400);
    expect(response.body.validation.body.message).toStrictEqual('"feeds[0]" must be a string');
  });

  test('Post JSON, Rejected - id is a required field', async () => {
    const body = {
      firstName: 'Carl',
      lastName: 'Sagan',
      displayName: 'Carl Sagan',
      isAdmin: true,
      isFlagged: true,
      feeds: ['https://dev.to/feed/carlsagan'],
      github: {
        username: 'carlsagan',
        avatarUrl:
          'https://avatars.githubusercontent.com/u/7242003?s=460&u=733c50a2f50ba297ed30f6b5921a511c2f43bfee&v=4',
      },
    };

    const response = await request(app)
      .post('/')
      .set('Content-Type', 'application/json')
      .send(body);

    expect(response.statusCode).toBe(400);
    expect(response.body.validation.body.message).toStrictEqual('"id" is required');
  });

  test('Post JSON, Rejected - firstName is a required field', async () => {
    const body = {
      id: 10002,
      lastName: 'Sagan',
      displayName: 'Carl Sagan',
      isAdmin: true,
      isFlagged: true,
      feeds: ['https://dev.to/feed/carlsagan'],
      github: {
        username: 'carlsagan',
        avatarUrl:
          'https://avatars.githubusercontent.com/u/7242003?s=460&u=733c50a2f50ba297ed30f6b5921a511c2f43bfee&v=4',
      },
    };

    const response = await request(app)
      .post('/')
      .set('Content-Type', 'application/json')
      .send(body);

    expect(response.statusCode).toBe(400);
    expect(response.body.validation.body.message).toStrictEqual('"firstName" is required');
  });

  test('Post JSON, Rejected - lastName is a required field', async () => {
    const body = {
      id: 10002,
      firstName: 'Carl',
      displayName: 'Carl Sagan',
      isAdmin: true,
      isFlagged: true,
      feeds: ['https://dev.to/feed/carlsagan'],
      github: {
        username: 'carlsagan',
        avatarUrl:
          'https://avatars.githubusercontent.com/u/7242003?s=460&u=733c50a2f50ba297ed30f6b5921a511c2f43bfee&v=4',
      },
    };

    const response = await request(app)
      .post('/')
      .set('Content-Type', 'application/json')
      .send(body);

    expect(response.statusCode).toBe(400);
    expect(response.body.validation.body.message).toStrictEqual('"lastName" is required');
  });

  test('Post JSON, Rejected - feeds is a required field', async () => {
    const body = {
      id: 10002,
      firstName: 'Carl',
      lastName: 'Sagan',
      displayName: 'Carl Sagan',
      isAdmin: true,
      isFlagged: true,
      github: {
        username: 'carlsagan',
        avatarUrl:
          'https://avatars.githubusercontent.com/u/7242003?s=460&u=733c50a2f50ba297ed30f6b5921a511c2f43bfee&v=4',
      },
    };

    const response = await request(app)
      .post('/')
      .set('Content-Type', 'application/json')
      .send(body);

    expect(response.statusCode).toBe(400);
    expect(response.body.validation.body.message).toStrictEqual('"feeds" is required');
  });
});

describe('DELETE REQUESTS', () => {
  beforeEach(() => clearData());
  afterEach(() => clearData());

  test('Delete JSON, Accepted - deleted an existing user', async () => {
    await postUser1();

    const response = await request(app).delete('/10001').set('Content-Type', 'application/json');

    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({
      msg: 'User (id: 10001) was removed.',
    });
  });

  test('Delete JSON, Rejected - deleted an existing user', async () => {
    const response = await request(app).delete('/10001').set('Content-Type', 'application/json');

    expect(response.statusCode).toBe(404);
    expect(response.body).toStrictEqual({
      msg: 'User (id: 10001) was attempted to be removed but could not be found.',
    });
  });
});
