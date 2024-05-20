// imports

import { getColor } from "./colors.mjs";
import { getTopUsers } from "./fetch.mjs";
import { getUserData } from "./fetch.mjs";
import { getRepos } from "./fetch.mjs";

// Initialization
const searchForm = document.getElementById("searchForm");
const input = document.getElementById("searchInput");
const loader = document.querySelector(".loader-container");
const searchResults = document.getElementById("searchResults");
const profile = document.getElementById("profile");

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // Display Loader
  displayLoader();
  // Hide former results
  searchResults.style.display = "none";
  getTopUsers(input.value).then((topUsers) => {
    console.log(topUsers);
    renderTopUsers(topUsers);
    hideLoader();
    input.value = "";
    return topUsers;
  });
});

function displayLoader() {
  loader.style.display = "block";
}

function hideLoader() {
  loader.style.display = "none";
}

// Renders top users
function renderTopUsers(topUsers) {
  searchResults.innerHTML = "";

  //   Rendering title
  let title = document.createElement("li");
  title.classList.add("title");
  title.textContent = "Top Results";
  searchResults.appendChild(title);

  // Rendering results
  topUsers.forEach((user) => {
    let element = document.createElement("li");
    element.textContent = user.login;
    element.addEventListener("click", () => {
      profile.innerHTML = "";
      searchResults.innerHTML = "";
      renderCard(user.url);
      renderRepos(user.login);
      profile.style.display = "flex";
    });
    searchResults.appendChild(element);
  });

  searchResults.style.display = "block";
}

// Renders user's card
function renderCard(url) {
  // Get user data
  getUserData(url)
    .then((data) => {
      return data;
    })
    .then((userData) => {
      // Card
      let card = document.createElement("div");
      card.classList.add("card");

      //Card Elements

      //Avatar
      let avatar = document.createElement("div");
      avatar.classList.add("avatar");
      avatar.style.backgroundImage = `url(${userData.avatar_url})`;
      card.appendChild(avatar);

      //Username
      let username = document.createElement("div");
      username.classList.add("username");
      username.innerHTML = `
        ${
          userData.type == "User"
            ? '<i class="fa-solid fa-user">'
            : '<i class="fa-solid fa-building">'
        }</i>
        <h2>${userData.login}</h2>
  `;
      card.appendChild(username);

      // Htmlurl
      let html_url = document.createElement("div");
      html_url.classList.add("html_url");
      html_url.innerHTML = `
        <i class="fa-solid fa-link"></i>
        <a href="${userData.html_url}">${userData.html_url}</a>
  `;
      card.appendChild(html_url);

      // Bio
      let bio = document.createElement("div");
      bio.classList.add("bio");
      bio.innerHTML = `
        <i class="fa-solid fa-circle-info"></i>
        ${userData.bio}
  `;
      card.appendChild(bio);

      // Grid container
      let gridContainer = document.createElement("div");
      gridContainer.classList.add("gridContainer");
      gridContainer.innerHTML = `
        <div class="gridItem">
            <i class="fa-solid fa-users"></i>
            <h3>${userData.followers}</h3>
            <p>Followers</p>
        </div>
        <div class="gridItem">
            <i class="fa-solid fa-user-group"></i>
            <h3>${userData.following}</h3>
            <p>Following</p>
        </div>
        <div class="gridItem">
            <i class="fa-solid fa-book"></i>
            <h3>${userData.public_repos}</h3>
            <p>Repositories</p>
        </div>
        <div class="gridItem">
            <i class="fa-brands fa-x-twitter"></i>
            <p>@${userData.twitter_username}</p>
        </div>
        <div class="gridItem email">
            <i class="fa-solid fa-envelope"></i>
            <p>${userData.email}</p>
        </div>
        <div class="gridItem">
            <i class="fa-solid fa-location-dot"></i>
            <p>${userData.location}</p>
        </div>
  `;
      card.appendChild(gridContainer);
      profile.appendChild(card);
    });
}

// Renders user's repos
function renderRepos(username) {
  // Get top 5 repos
  getRepos(username)
    .then((data) => {
      return data;
    })
    .then((repos) => {
      // Creating repo container
      let repoContainer = document.createElement("div");
      repoContainer.classList.add("repos");

      // Create repo title
      let heading = document.createElement("div");
      heading.classList.add("heading");
      heading.textContent = "Top repositories";
      repoContainer.appendChild(heading);

      // Creating repo items
      repos.forEach((repo) => {
        let element = document.createElement("div");
        element.classList.add("repo");
        element.innerHTML = `
        <div class="repo-detail">
            <a href="${repo.html_url}"><h2>${repo.name}</h2></a>
                <span>Public</span>
            </div>
            <div class="repo-info">
            <div class="forks">
                <i class="fa-solid fa-code-fork"></i>
                <h4>${repo.forks_count}</h4>
            </div>

            <div class="stars">
                <i class="fa-solid fa-star starIcon"></i>
                <h4>${repo.stargazers_count}</h4>
            </div>

            <div class="language">
                <span style="background: ${getColor(repo.language)}"></span>
                <h4>${repo.language}</h4>
            </div>
        </div>
    `;
        repoContainer.appendChild(element);
      });
      profile.appendChild(repoContainer);
    });
}

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (event) => {
    if (event.matches) {
      document.querySelector("html").setAttribute("data-theme", "dark");
    } else {
      document.querySelector("html").setAttribute("data-theme", "light");
    }
  });
