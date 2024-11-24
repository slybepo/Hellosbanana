let auth0 = null;

async function initializeAuth0() {
  auth0 = await createAuth0Client({
    domain: "dev-5ousdzi3slqmqsnw.eu.auth0.com",
    client_id: "vTGZIMoyIktLRjrwapREVNft42wuIY2Y",
    redirect_uri: window.location.origin
  });
}

async function login(email, password) {
  try {
    const response = await auth0.loginWithCredentials({
      realm: 'Username-Password-Authentication', // Specify the Auth0 database connection
      username: email,
      password: password
    });
    return response.accessToken;
  } catch (error) {
    console.error("Login failed", error);
    return null;
  }
}

async function register(email, password) {
  try {
    const response = await fetch(`https://${auth0.domain}/dbconnections/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: "vTGZIMoyIktLRjrwapREVNft42wuIY2Y",
        email: email,
        password: password,
        connection: "Username-Password-Authentication" // Specify the Auth0 database connection
      })
    });

    if (response.ok) {
      return true;
    } else {
      console.error("Registration failed", await response.json());
      return false;
    }
  } catch (error) {
    console.error("Registration failed", error);
    return false;
  }
}
