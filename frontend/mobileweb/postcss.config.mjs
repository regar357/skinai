/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {}, // v4에서는 이 패키지를 사용해야 합니다.
    autoprefixer: {},
  },
}

export default config