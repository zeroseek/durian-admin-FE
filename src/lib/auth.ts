export function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("admin_token") : null
}

export function setToken(token: string) {
  localStorage.setItem("admin_token", token)
}

export function clearToken() {
  localStorage.removeItem("admin_token")
}

export function isLoggedIn() {
  return !!getToken()
}
