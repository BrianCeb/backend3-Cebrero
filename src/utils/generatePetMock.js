import { faker } from '@faker-js/faker';

export const generatePetMock = () => {
    const specie = faker.helpers.arrayElement(['dog', 'cat', 'hamster', 'rabbit', 'bird']);
    return {
        name: faker.animal.petName(),
        specie,
        birthDate: faker.date.past({ years: 10 }),
        adopted: false,
        owner: null
    };
};
