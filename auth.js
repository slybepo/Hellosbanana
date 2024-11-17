let auth0 = null;

async function initializeAuth0() {
  auth0 = await createAuth0Client({
    domain: "dev-5ousdzi3slqmqsnw.eu.auth0.com",
    client_id: "vTGZIMoyIktLRjrwapREVNft42wuIY2Y",
    redirect_uri: window.location.origin,
    audience: "https://nexaverse-vr-api", // Required for roles
    scope: "openid profile email read:roles"
  });

  // Handle redirect if needed
  if (window.location.search.includes("code=") && window.location.search.includes("state=")) {
    await auth0.handleRedirectCallback();
    window.history.replaceState({}, document.title, "/");
  }
}

async function checkAuth() {
  await initializeAuth0();
  const isAuthenticated = await auth0.isAuthenticated();

  if (!isAuthenticated) {
    showPopup();
    return false;
  }

  const user = await auth0.getUser();
  const token = await auth0.getTokenSilently();

  const response = await fetch("<YOUR_AUTH0_DOMAIN>/api/v2/users/" + user.sub, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await response.json();

  return {
    user,
    roles: data.app_metadata.roles || []
  };
}

function showPopup() {
  const popup = document.createElement("div");
  popup.style.position = "fixed";
  popup.style.top = "50%";
  popup.style.left = "50%";
  popup.style.transform = "translate(-50%, -50%)";
  popup.style.backgroundColor = "white";
  popup.style.color = "black";
  popup.style.borderRadius = "8px";
  popup.style.boxShadow = "0px 4px 12px rgba(0, 0, 0, 0.2)";
  popup.style.padding = "2rem";
  popup.style.textAlign = "center";
  popup.style.zIndex = "1000";

  popup.innerHTML = `
    <h2>You're not signed in!</h2>
    <p>You need to sign in before accessing our website.</p>
    <button id="popup-signin">Sign In</button>
  `;

  document.body.appendChild(popup);
  document.getElementById("popup-signin").addEventListener("click", () => {
    auth0.loginWithRedirect();
  });
}
