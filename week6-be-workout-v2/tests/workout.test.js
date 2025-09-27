const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const User = require("../models/userModel");
const Workout = require("../models/workoutModel");
const workouts = require("./data/workouts.js");

let token = null;

beforeAll(async () => {
  await User.deleteMany({});
  const result = await api
    .post("/api/user/signup")
    .send({ email: "mattiv@matti.fi", password: "R3g5T7#gh" });
  token = result.body.token;
});

describe("when there is initially some workouts saved", () => {
  beforeEach(async () => {
    await Workout.deleteMany({});
    await api
      .post("/api/workouts")
      .set("Authorization", "bearer " + token)
      .send(workouts[0])
      .send(workouts[1]);
  });
  it("Workouts are returned as json", async () => {
    await api
      .get("/api/workouts")
      .set("Authorization", "bearer " + token)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  it("New workout added successfully", async () => {
    const newWorkout = {
      title: "testworkout",
      reps: 10,
      load: 100,
    };
    await api
      .post("/api/workouts")
      .set("Authorization", "bearer " + token)
      .send(newWorkout)
      .expect(201);
  });

  it('can read a single workout by id', async () => {
    // create a workout
    const newWorkout = { title: 'single-read-workout', reps: 5, load: 50 };
    const postRes = await api
      .post('/api/workouts')
      .set('Authorization', 'bearer ' + token)
      .send(newWorkout)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const created = postRes.body;

    const getRes = await api
      .get(`/api/workouts/${created._id}`)
      .set('Authorization', 'bearer ' + token)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(getRes.body.title).toBe(newWorkout.title);
    expect(getRes.body.reps).toBe(newWorkout.reps);
    expect(getRes.body.load).toBe(newWorkout.load);
  });

  it('can update a workout', async () => {
    const newWorkout = { title: 'to-update-workout', reps: 8, load: 80 };
    const postRes = await api
      .post('/api/workouts')
      .set('Authorization', 'bearer ' + token)
      .send(newWorkout)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const created = postRes.body;

    const updatedFields = { title: 'updated-workout', reps: 9, load: 85 };

    const patchRes = await api
      .patch(`/api/workouts/${created._id}`)
      .set('Authorization', 'bearer ' + token)
      .send(updatedFields)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    // The controller returns the pre-update document (findOneAndUpdate default),
    // but ensure the DB has the updated values by fetching it again.
    const getRes = await api
      .get(`/api/workouts/${created._id}`)
      .set('Authorization', 'bearer ' + token)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(getRes.body.title).toBe(updatedFields.title);
    expect(getRes.body.reps).toBe(updatedFields.reps);
    expect(getRes.body.load).toBe(updatedFields.load);
  });

  it('can delete a workout', async () => {
    const newWorkout = { title: 'to-delete-workout', reps: 3, load: 30 };
    const postRes = await api
      .post('/api/workouts')
      .set('Authorization', 'bearer ' + token)
      .send(newWorkout)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const created = postRes.body;

    await api
      .delete(`/api/workouts/${created._id}`)
      .set('Authorization', 'bearer ' + token)
      .expect(200);

    // Verify it's gone
    await api
      .get(`/api/workouts/${created._id}`)
      .set('Authorization', 'bearer ' + token)
      .expect(404);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
