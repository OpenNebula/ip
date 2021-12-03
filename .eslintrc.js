/* ------------------------------------------------------------------------- *
 * Copyright 2002-2021, OpenNebula Project, OpenNebula Systems               *
 *                                                                           *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may   *
 * not use this file except in compliance with the License. You may obtain   *
 * a copy of the License at                                                  *
 *                                                                           *
 * http://www.apache.org/licenses/LICENSE-2.0                                *
 *                                                                           *
 * Unless required by applicable law or agreed to in writing, software       *
 * distributed under the License is distributed on an "AS IS" BASIS,         *
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  *
 * See the License for the specific language governing permissions and       *
 * limitations under the License.                                            *
 * ------------------------------------------------------------------------- */

const RULES = {
  OFF: 'off',
  WARN: 'warn',
  ERROR: 'error',
}

module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:react/recommended',
    'plugin:jsdoc/recommended',
    'standard',
    'prettier',
  ],
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    babelOptions: {
      presets: ['@babel/preset-react'],
    },
  },
  plugins: ['jsx-a11y', 'jsdoc', 'header', 'prettier'],
  rules: {
    'default-case': RULES.OFF,
    'prefer-const': [
      RULES.ERROR,
      {
        destructuring: 'all',
      },
    ],
    'no-restricted-syntax': [
      RULES.ERROR,
      'ForInStatement',
      'LabeledStatement',
      'WithStatement',
    ],
    'no-return-assign': [RULES.ERROR, 'except-parens'],
    'no-param-reassign': [
      RULES.ERROR,
      {
        props: false,
      },
    ],
    'no-shadow': [
      RULES.ERROR,
      {
        hoist: 'all',
        allow: [
          'resolve',
          'reject',
          'done',
          'next',
          'err',
          RULES.ERROR,
          'children',
        ],
      },
    ],
    'arrow-body-style': [RULES.ERROR, 'as-needed'],
    'import/no-extraneous-dependencies': [
      RULES.ERROR,
      {
        devDependencies: ['*.js'],
      },
    ],
    'padding-line-between-statements': [
      RULES.ERROR,
      {
        blankLine: 'always',
        prev: '*',
        next: 'return',
      },
    ],
    'react/jsx-uses-react': RULES.OFF,
    'react/react-in-jsx-scope': RULES.OFF,
    'react/display-name': RULES.WARN,
    'react/no-array-index-key': RULES.OFF,
    'react/require-default-props': RULES.OFF,
    'react/forbid-prop-types': RULES.OFF,
    'jsx-a11y/alt-text': [RULES.WARN, { elements: ['img'], img: ['Image'] }],
    'jsx-a11y/aria-props': RULES.WARN,
    'jsx-a11y/aria-proptypes': RULES.WARN,
    'jsx-a11y/aria-unsupported-elements': RULES.WARN,
    'jsx-a11y/role-has-required-aria-props': RULES.WARN,
    'jsx-a11y/role-supports-aria-props': RULES.WARN,
    'prettier/prettier': [
      RULES.ERROR,
      {
        singleQuote: true,
        semi: false,
        trailingComma: 'es5',
      },
    ],
    'jsdoc/require-jsdoc': [
      RULES.ERROR,
      {
        publicOnly: true,
        require: {
          ArrowFunctionExpression: true,
          FunctionDeclaration: true,
          FunctionExpression: true,
          ClassDeclaration: true,
          ClassExpression: true,
          MethodDefinition: true,
        },
      },
    ],
    'jsdoc/check-indentation': RULES.WARN,
    'jsdoc/check-line-alignment': RULES.WARN,
    'jsdoc/check-syntax': RULES.WARN,
    'jsdoc/match-description': RULES.WARN,
    'jsdoc/require-asterisk-prefix': RULES.WARN,
    'jsdoc/require-hyphen-before-param-description': RULES.WARN,
    'header/header': [
      RULES.ERROR,
      'block',
      [
        ' ------------------------------------------------------------------------- *',
        ' * Copyright 2002-2021, OpenNebula Project, OpenNebula Systems               *',
        ' *                                                                           *',
        ' * Licensed under the Apache License, Version 2.0 (the "License"); you may   *',
        ' * not use this file except in compliance with the License. You may obtain   *',
        ' * a copy of the License at                                                  *',
        ' *                                                                           *',
        ' * http://www.apache.org/licenses/LICENSE-2.0                                *',
        ' *                                                                           *',
        ' * Unless required by applicable law or agreed to in writing, software       *',
        ' * distributed under the License is distributed on an "AS IS" BASIS,         *',
        ' * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  *',
        ' * See the License for the specific language governing permissions and       *',
        ' * limitations under the License.                                            *',
        ' * ------------------------------------------------------------------------- ',
      ],
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}
