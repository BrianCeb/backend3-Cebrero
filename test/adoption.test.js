process.env.NODE_ENV = 'test';

import { expect } from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';

import app from '../src/app.js';

import userModel from '../src/dao/models/User.js';
import petModel from '../src/dao/models/Pet.js';
import adoptionModel from '../src/dao/models/Adoption.js';

const request = supertest(app);
const unique = (pfx = 'test') => `${pfx}_${Date.now()}@mail.com`;

describe('Adoptions Router - Functional', function () {
    this.timeout(20000);

    let createdUserId;
    let createdPetId;
    let createdAdoptionId;

    before(async () => {
        await userModel.deleteMany({ email: /test_/ });
        await petModel.deleteMany({ name: /TestPet_/ });
        await adoptionModel.deleteMany({});
    });

    after(async () => {
        await userModel.deleteMany({ email: /test_/ });
        await petModel.deleteMany({ name: /TestPet_/ });
        await adoptionModel.deleteMany({});
        // 🔒 Cerrar conexión para que Mocha finalice
        await mongoose.connection.close(true);
    });

    it('GET /api/adoptions -> 200 y payload array', async () => {
        const { statusCode, body } = await request.get('/api/adoptions');
        expect(statusCode).to.equal(200);
        expect(body.status).to.equal('success');
        expect(body.payload).to.be.an('array');
    });

    it('POST /api/adoptions/:uid/:pid (éxito)', async () => {
        const email = unique('test_user');
        const reg = await request.post('/api/sessions/register').send({
            first_name: 'Test',
            last_name: 'Adopter',
            email,
            password: 'coder123'
        });
        expect(reg.statusCode).to.equal(200);
        expect(reg.body).to.have.property('status', 'success');
        expect(reg.body).to.have.property('payload').that.is.a('string');
        createdUserId = reg.body.payload;

        const petRes = await request.post('/api/pets').send({
            name: `TestPet_${Date.now()}`,
            specie: 'dog',
            birthDate: new Date().toISOString()
        });
        expect(petRes.statusCode).to.equal(200);
        expect(petRes.body.status).to.equal('success');
        expect(petRes.body.payload).to.have.property('_id');
        createdPetId = petRes.body.payload._id;

        const adoptRes = await request.post(`/api/adoptions/${createdUserId}/${createdPetId}`);
        expect(adoptRes.statusCode).to.equal(200);
        expect(adoptRes.body.status).to.equal('success');
        expect(adoptRes.body.message).to.match(/Pet adopted/i);

        const list = await request.get('/api/adoptions');
        const found = list.body.payload.find(
            a => String(a.owner) === String(createdUserId) && String(a.pet) === String(createdPetId)
        );
        expect(found).to.exist;
        createdAdoptionId = found._id;
    });

    it('GET /api/adoptions/:aid (éxito)', async () => {
        const { statusCode, body } = await request.get(`/api/adoptions/${createdAdoptionId}`);
        expect(statusCode).to.equal(200);
        expect(body.status).to.equal('success');
        expect(body.payload).to.have.property('_id', createdAdoptionId);
    });

    it('GET /api/adoptions/:aid (no existe) -> 404', async () => {
        const fakeId = new mongoose.Types.ObjectId().toString();
        const res = await request.get(`/api/adoptions/${fakeId}`);
        expect(res.statusCode).to.equal(404);
    });

    it('POST /api/adoptions/:uid/:pid (pet ya adoptada) -> 400', async () => {
        const res = await request.post(`/api/adoptions/${createdUserId}/${createdPetId}`);
        expect(res.statusCode).to.equal(400);
        expect(res.body.error).to.match(/already adopted/i);
    });

    it('POST /api/adoptions/:uid/:pid (usuario inexistente) -> 404', async () => {
        const fakeUser = new mongoose.Types.ObjectId().toString();
        const newPet = await request.post('/api/pets').send({
            name: `TestPet_${Date.now()}`,
            specie: 'cat',
            birthDate: new Date().toISOString()
        });
        const res = await request.post(`/api/adoptions/${fakeUser}/${newPet.body.payload._id}`);
        expect(res.statusCode).to.equal(404);
    });

    it('POST /api/adoptions/:uid/:pid (mascota inexistente) -> 404', async () => {
        const email = unique('test_user2');
        const reg = await request.post('/api/sessions/register').send({
            first_name: 'Test',
            last_name: 'Adopter2',
            email,
            password: 'coder123'
        });
        const fakePet = new mongoose.Types.ObjectId().toString();
        const res = await request.post(`/api/adoptions/${reg.body.payload}/${fakePet}`);
        expect(res.statusCode).to.equal(404);
    });
});
