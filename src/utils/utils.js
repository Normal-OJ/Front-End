export function setAvatar (payload) {
  // FIXME: note that publicPath should end with '/'
  const publicPath = process.env.BASE_PATH ? process.env.BASE_PATH : '/'
  const d = encodeURI(`${location.origin}${publicPath}defaultAvatar.png`)
  return `https://www.gravatar.com/avatar/${payload}?d=${d}`
}
