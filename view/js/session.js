axios.defaults.baseURL = SERVER

const getSession = async () => {
  try {
    const token = localStorage.getItem("token")

    if (!token) {
      return null
    }

    const payload = { token }

    const { data } = await axios.post(
      "/token/verify",
      payload,
    )
    return data
  } catch (err) {
    return null
  }
}

const logout = () => {
  localStorage.clear();
  setTimeout(() => {
    location.href = '/'
  }, 800);
}
