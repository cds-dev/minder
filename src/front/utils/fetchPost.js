const doFetch = (data, url) => {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("Network response was not ok")
    }
    return response.json()
  })
  .then(json => {
    return json
  })
  .catch(error => {
    console.error("Error:", error)
  })
}


export { doFetch }