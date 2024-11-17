const auth0 = new Auth0Client({
  domain: "dev-5ousdzi3slqmqsnw.eu.auth0.com",
  clientId: "vTGZIMoyIktLRjrwapREVNft42wuIY2Y",
  authorizationParams: {
    redirect_uri: window.location.origin,
    audience: "https://dev-5ousdzi3slqmqsnw.eu.auth0.com/api/v2/",
  },
});

document.addEventListener("DOMContentLoaded", async () => {
  const loginButton = document.getElementById("login-button");
  const logoutButton = document.getElementById("logout-button");
  const userProfile = document.getElementById("user-profile");
  const userAvatar = document.getElementById("user-avatar");
  const userName = document.getElementById("user-name");
  const navMenu = document.getElementById("nav-menu");

  try {
    const isAuthenticated = await auth0.isAuthenticated();

    if (isAuthenticated) {
      // User is authenticated
      const user = await auth0.getUser();
      displayUser(user);
      setupUserUI(true);
    } else {
      // User is not authenticated
      setupUserUI(false);
    }

    loginButton.addEventListener("click", () => {
      auth0.loginWithRedirect();
    });

    logoutButton.addEventListener("click", () => {
      auth0.logout({ returnTo: window.location.origin });
    });

    // Toggle navigation menu on profile click
    userProfile.addEventListener("click", () => {
      navMenu.classList.toggle("hidden");
    });
  } catch (err) {
    console.error("Error during authentication:", err);
  }
});

// Display user info
function displayUser(user) {
  document.getElementById("user-avatar").src =
    user.picture || `https://api.dicebear.com/6.x/avataaars/svg?seed=${Math.random()}`;
  document.getElementById("user-name").textContent = user.name || "Guest";
}

// Toggle UI based on authentication
function setupUserUI(isAuthenticated) {
  document.getElementById("login-button").classList.toggle("hidden", isAuthenticated);
  document.getElementById("logout-button").classList.toggle("hidden", !isAuthenticated);
  document.getElementById("user-avatar").classList.toggle("hidden", !isAuthenticated);
  document.getElementById("user-name").classList.toggle("hidden", !isAuthenticated);
}
