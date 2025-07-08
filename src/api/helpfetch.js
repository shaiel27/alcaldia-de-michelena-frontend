export const helpFetch = () => {
  const api = (endpoint, options) => {
    const url = `http://localhost:3004/${endpoint}`

    if (!options) {
      options = {}
    }

    options.method = options.method || "GET"
    options.headers = {
      "content-type": "application/json",
      ...options.headers,
    }

    if (options.body) {
      options.body = JSON.stringify(options.body)
    }

    return fetch(url, options)
      .then((res) => {
        if (res.ok) {
          return res.json()
        } else {
          return Promise.reject({
            err: true,
            status: res.status || "00",
            statusText: res.statusText || "Ocurrió un error",
          })
        }
      })
      .catch((err) => {
        console.error("API Error:", err)
        return {
          err: true,
          status: err.status || "00",
          statusText: err.statusText || err.message || "Error de conexión",
        }
      })
  }

  const get = (endpoint) => api(endpoint)

  const post = (endpoint, options) => {
    options.method = "POST"
    return api(endpoint, options)
  }

  const put = (endpoint, options, id) => {
    options.method = "PUT"
    return api(`${endpoint}/${id}`, options)
  }

  const del = (endpoint, id) => {
    return api(`${endpoint}/${id}`, { method: "DELETE" })
  }

  return {
    get,
    post,
    put,
    del,
  }
}
