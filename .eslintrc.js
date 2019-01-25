// https://eslint.org/docs/user-guide/configuring

module.exports = {
    root: true,

    parserOptions: {
        parser: 'babel-eslint',
    },

    env: {
        browser: true,
    },

    extends: [
        // https://cn.vuejs.org/v2/style-guide/#%E4%BC%98%E5%85%88%E7%BA%A7-B-%E7%9A%84%E8%A7%84%E5%88%99%EF%BC%9A%E5%BC%BA%E7%83%88%E6%8E%A8%E8%8D%90-%E5%A2%9E%E5%BC%BA%E5%8F%AF%E8%AF%BB%E6%80%A7
        // https://github.com/vuejs/eslint-plugin-vue#priority-b-strongly-recommended-improving-readability
        'plugin:vue/strongly-recommended',

        // 英文：https://github.com/airbnb/javascript
        // 中文：https://github.com/sivan/javascript-style-guide/blob/master/es5/README.md
        'airbnb-base',
    ],

    plugins: [
        'vue',
    ],

    rules: {
        'no-shadow': [
            'error',
            {
                'allow': [
                    'state',
                ],
            },
        ],
        // 'import/extensions': 'off',
        'import/extensions': ['error', 'always', {
            js: 'never',
            vue: 'never',
        }],
        'import/no-unresolved': 'off',
        'no-param-reassign': 'off',
        'consistent-return': 'off',
        'global-require': 'off',
        'import/no-dynamic-require': 'off',
        'import/no-extraneous-dependencies': 'off',

        // 4 行空格缩进
        'vue/html-indent': [
            'error',
            4,
        ],
        'indent': [
            'error',
            4,
            { "SwitchCase": 1 }
        ],

        "max-len": ["error", { "code": 150 }],
    },
};
