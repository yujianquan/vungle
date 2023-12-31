module.exports = {
    verbose:false,
    
    moduleFileExtensions: [
        'js',
        'vue'
    ],

    transform: {
        '^.+\\.vue$': '<rootDir>/node_modules/vue-jest',
        '^.+\\.js$': '<rootDir>/node_modules/babel-jest'
    },

    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
    },

    snapshotSerializers: [
        'jest-serializer-vue'
    ],

    testMatch: ['**/tests/unit/**/*.spec.js'],
    transformIgnorePatterns: ['<rootDir>/node_modules/'],
    preset: '@vue/cli-plugin-unit-jest'
}
