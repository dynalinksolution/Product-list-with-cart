fetch("../data.json")
  .then((response) => response.json())
  .then((data) => {
    const items = data;
  })
  .catch((error) => console.error("Error loading JSON:", error));

console.log(items);
