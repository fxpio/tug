export default {
    babel: {
        compileEnhancements: false
    },
    files: [
        './test/**/*.ts'
    ],
    require: [
        'ts-node/register',
        'tsconfig-paths/register'
    ],
    extensions: [
        'ts'
    ]
};
