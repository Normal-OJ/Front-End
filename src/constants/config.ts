if (!process.env.VUE_APP_API_BASE_URL) {
  console.warn('Please set API_BASE_URL in .env')
}

export default {
  API_BASE_URL: process.env.VUE_APP_API_BASE_URL
}
