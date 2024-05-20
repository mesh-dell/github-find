import { getColor } from "./colors.mjs";

export async function getUserData(profileUrl) {
  let response = await fetch(profileUrl);
  let userProf = await response.json();

  const {
    login,
    html_url,
    followers,
    following,
    type,
    avatar_url,
    email,
    location,
    bio,
    twitter_username,
    public_repos,
  } = userProf;

  const data = {
    login,
    html_url,
    followers,
    following,
    type,
    avatar_url,
    email,
    location,
    bio,
    twitter_username,
    public_repos,
  };

  return data;
}

// Get top Users
export async function getTopUsers(query) {
  query = encodeURIComponent(query);
  const url = `https://api.github.com/search/users?q=${query}&per_page=5`;

  try {
    let response = await fetch(url);
    let topUsers = await response.json();
    let topUsersData = filtertopUsersData(topUsers.items);
    return topUsersData;
  } catch (error) {
    console.error(`Fetch error: ${error.message}`);
  }
}

//Filters repo raw data
function getRepoData(reposRaw) {
  let repoData = [];

  reposRaw.forEach((repo) => {
    let { name, html_url, language, stargazers_count, forks_count } = repo;
    repoData.push({ name, html_url, language, stargazers_count, forks_count });
  });
  return repoData;
}

// Get top 5 repos
export async function getRepos(query) {
  query = encodeURIComponent(query);
  const url = `https://api.github.com/search/repositories?q=user:${query}&sort=stars&order=desc&per_page=5`;

  try {
    let response = await fetch(url);
    let repos = await response.json();
    let repoData = getRepoData(repos.items);
    return repoData;
  } catch (error) {
    console.error(`Fetch error: ${error.message}`);
  }
}

// Filter topUsersData
function filtertopUsersData(topUsers) {
  let topUsersData = [];

  topUsers.forEach((user) => {
    let { login, url } = user;
    topUsersData.push({ login, url });
  });
  return topUsersData;
}
// getTopUsers("apple").then((userData) => {
//   return getUserData(userData[0].url)
// }).then((profileInfo) => {
//   console.log(profileInfo);
// });
