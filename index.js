import Autocomplete from "./Autocomplete";
import usStates from "./us-states";
import "./main.css";

// US States
const data = (query) => {
  return new Promise((resolve, reject) => {
    resolve(usStates.map(state => ({
      text: state.name,
      value: state.abbreviation
    })));
  }); 
}

new Autocomplete(document.getElementById('state'), {
  data,
  onSelect: (stateCode) => {
    console.log('selected state:', stateCode);
  },
});

// Github Users
const ghData = (query, numOfResults) => {
  if (query == "")
    return new Promise((resolve, reject) => {
      resolve([]);
    });
  return fetch(
    `https://api.github.com/search/users?q=${query}&per_page=${numOfResults}`
  ).then(res => {
    if (res.status !== 200) {
      console.log("Looks like there was a problem. Status Code: " + res.status);
      return;
    }

    return res.json().then(function(data) {
      console.log(data);
      return data.items.map(x => ({ text: x.login, value: x.id }));
    });
  });
};
new Autocomplete(document.getElementById("gh-user"), {
  data: ghData,
  onSelect: ghUserId => {
    console.log("selected github user id:", ghUserId);
  }
});
