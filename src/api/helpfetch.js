export const helpFetch = () => {
    const URL = "https://json-alcaldia-1.onrender.com/"
  
    const customFetch = (endpoint, options = {}) => {
      options.method = options.method || "GET"
  
      if (!(options.body instanceof FormData)) {
        options.headers = {
          "Content-Type": "application/json",
          ...options.headers,
        }
        if (options.body) {
          options.body = JSON.stringify(options.body)
        }
      }
  
      return fetch(`${URL}${endpoint}`, options)
        .then((response) => {
          if (!response.ok) {
            return Promise.reject({
              error: true,
              status: response.status,
              statusText: response.statusText,
            })
          }
          return response.json()
        })
        .catch((error) => error)
    }
  
    const get = (endpoint) => customFetch(endpoint)
  
    const post = (endpoint, options) => {
      options.method = "POST"
      return customFetch(endpoint, options)
    }
  
    const put = (endpoint, options) => {
      options.method = "PUT"
      return customFetch(endpoint, options)
    }
  
    const del = (endpoint, id) => {
      const options = {
        method: "DELETE",
      }
      return customFetch(`${endpoint}/${id}`, options)
    }
  
    return { get, post, put, del }
  }
  
  