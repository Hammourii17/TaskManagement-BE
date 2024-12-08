// test/task.test.js

const request = require('supertest');
const { expect } = require('chai');
const app = require('../app');
const Task = require('../models/task');
const User = require('../models/user');

describe('Task API', () => {
  let token;
  let userId;
  let taskId;

  before(async () => {

    const user = new User({ username: 'testuser', email: 'test@example.com', password: 'password' });
    await user.save();
    userId = user._id;

    // Log in to get the JWT token
    const res = await request(app).post('/api/auth/login').send({ email: 'test@example.com', password: 'password' });
    token = res.body.token;
  });

  after(async () => {

    await User.deleteMany({});
    await Task.deleteMany({});
  });

  it('should create a new task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test Task', description: 'Test Description', dueDate: new Date(), priority: 'High' });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('title', 'Test Task');
    taskId = res.body._id;
  });

  it('should get all tasks', async () => {
    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  it('should get a task by ID', async () => {
    const res = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('_id', taskId);
  });

  it('should update a task', async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Task' });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('title', 'Updated Task');
  });

  it('should delete a task', async () => {
    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('message', 'Task deleted successfully');
  });
});
