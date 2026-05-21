import nextConfig from 'eslint-config-next'

const config = [
  ...nextConfig,
  {
    rules: {
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ],
      'react-hooks/set-state-in-effect': 'off',
      'react/display-name': 0
    }
  }
]

export default config
