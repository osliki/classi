export const cut = (text = '', max) => {
  return text.substr(0, max) + (text.length > max ? '...' : '')
}

export const getUserShort = (user) => {
  return (user ? `@${user.substr(2, 2)}...${user.substr(38)}` : '...')
}
