const auth0 = new Auth0Client({
  domain: "dev-5ousdzi3slqmqsnw.eu.auth0.com",
  clientId: "vTGZIMoyIktLRjrwapREVNft42wuIY2Y",
  authorizationParams: {
    redirect_uri: window.location.origin,
    audience: "https://dev-5ousdzi3slqmqsnw.eu.auth0.com/api/v2/",
  },
});

const UNIQUE_ID = generateUniqueId();

// Generate Unique ID for Each User
function generateUniqueId() {
  return Math.floor(Math.random() * 1000000000000000).toString();
}

document.addEventListener("DOMContentLoaded", async () => {
  const isAuthenticated = await auth0.isAuthenticated();

  if (isAuthenticated) {
    const user = await auth0.getUser();
    displayUser(user);
    const roles = await fetchUserRoles(user.sub);
    setupPermissions(roles);
  } else {
    auth0.loginWithRedirect();
  }

  document.getElementById("logout-button").addEventListener("click", () => {
    auth0.logout({ returnTo: window.location.origin });
  });
});

// Fetch User Roles
async function fetchUserRoles(userId) {
  const token = await auth0.getTokenSilently();
  const response = await fetch(`https://YOUR_AUTH0_DOMAIN/api/v2/users/${userId}/roles`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    console.error("Failed to fetch roles");
    return [];
  }

  const roles = await response.json();
  return roles.map((role) => role.name);
}

// Set Up Permissions Based on Roles
function setupPermissions(roles) {
  if (roles.includes("admin")) {
    document.getElementById("admin-panel").classList.remove("hidden");
  }
  if (roles.includes("moderator")) {
    document.getElementById("moderator-panel").classList.remove("hidden");
  }
}

// Display User Information
function displayUser(user) {
  document.getElementById("user-name").textContent = `${user.name} (${UNIQUE_ID})`;
  document.getElementById("user-avatar").src =
    user.picture || `https://api.dicebear.com/6.x/avataaars/svg?seed=${Math.random()}`;
    }
