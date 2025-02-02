export const helpFetch = () => {
  const URL = "https://json-alcaldia-2.onrender.com/";

  const customFetch = (endpoint, options = {}) => {
    options.method = options.method || "GET";
    options.headers = {
      "content-type": "application/json",
      ...options.headers,
    };

    if (options.body) {
      options.body = JSON.stringify(options.body);
    }

    return fetch(`${URL}${endpoint}`, options)
      .then(response => {
        return response.ok 
          ? response.json() 
          : Promise.reject({
              error: true,
              status: response.status,
              statusText: response.statusText
            });
      })
      .catch(error => error);
  };

  const get = (endpoint) => customFetch(endpoint);

  const post = (endpoint, options) => {
    options.method = "POST";
    return customFetch(endpoint, options);
  };

  const put = (endpoint, options, id) => {
    options.method = "PUT";
    return customFetch(`${endpoint}/${id}`, options);
  };

  const del = (endpoint, id) => {
    const options = {
      method: "DELETE"
    };
    return customFetch(`${endpoint}/${id}`, options);
  };

  return { get, post, put, del };
};
  "http://localhost:3004/"
  