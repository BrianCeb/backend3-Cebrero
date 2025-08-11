import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

export const generateUserMock = () => {
    return {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email().toLowerCase(),
        password: bcrypt.hashSync('coder123', 10), 
        role: faker.helpers.arrayElement(['user', 'admin']),
        pets: []
    };
};
