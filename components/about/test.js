const url =
  "https://jsearch.p.rapidapi.com/estimated-salary?job_title=full%20stack&location=dhaka&location_type=ANY&years_of_experience=ALL";
const options = {
  method: "GET",
  headers: {
    "x-rapidapi-key": "72527afae0mshd9563127d5c7e85p1aadb9jsnb64427ccbf4a",
    "x-rapidapi-host": "jsearch.p.rapidapi.com",
  },
};

try {
  const response = await fetch(url, options);
  const result = await response.text();
  console.log(result);
} catch (error) {
  console.error(error);
}
