export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@model(/.*)': '<rootDir>/../src/model$1',
        '^@service(/.*)': '<rootDir>/../src/service$1',
        '^@repository(/.*)': '<rootDir>/../src/repository$1',
        '^@test(/.*)': 'test$1',
    },
};
