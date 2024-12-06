// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAncQ-1auE71T--2DwSh4YWo1aXym9rMNc",
  authDomain: "nexaverse-production.firebaseapp.com",
  databaseURL: "https://nexaverse-production-default-rtdb.firebaseio.com",
  projectId: "nexaverse-production",
  storageBucket: "nexaverse-production.appspot.com",
  messagingSenderId: "1049480422009",
  appId: "1:1049480422009:web:08938ebe8c1689f55eaaa8",
  measurementId: "G-SB58316QE4",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

class ChatApp {
  constructor() {
    this.init();
  }

  init() {
    this.renderLogin();
  }

  renderLogin() {
    document.body.innerHTML = `
      <div id="title_container"><h1 id="title">Welcome to Auth Chat</h1></div>
      <div id="join_container">
        <div id="join_inner_container">
          <input id="join_input" type="email" placeholder="Enter your email" />
          <input id="join_password" type="password" placeholder="Enter your password" />
          <button id="join_button">Login</button>
          <p>New user? <span id="register_link" style="color:blue;cursor:pointer;">Register</span></p>
        </div>
      </div>
    `;

    document.getElementById("join_button").addEventListener("click", () => this.login());
    document.getElementById("register_link").addEventListener("click", () => this.renderRegister());
  }

  renderRegister() {
    document.body.innerHTML = `
      <div id="title_container"><h1 id="title">Register</h1></div>
      <div id="join_container">
        <div id="join_inner_container">
          <input id="join_input" type="email" placeholder="Enter your email" />
          <input id="join_password" type="password" placeholder="Enter your password" />
          <button id="join_button">Register</button>
        </div>
      </div>
    `;

    document.getElementById("join_button").addEventListener("click", () => this.register());
  }

  login() {
    const email = document.getElementById("join_input").value;
    const password = document.getElementById("join_password").value;

    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        alert("Login successful!");
        this.renderChat();
      })
      .catch((err) => alert(err.message));
  }

  register() {
    const email = document.getElementById("join_input").value;
    const password = document.getElementById("join_password").value;

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        db.ref("users/" + user.user.uid).set({ role: "user" });
        alert("Registration successful!");
        this.renderLogin();
      })
      .catch((err) => alert(err.message));
  }

  renderChat() {
    document.body.innerHTML = `
      <div id="title_container"><h1 id="title">Community Chat</h1></div>
      <div id="chat_container">
        <div id="chat_inner_container">
          <div id="chat_content_container"></div>
          <div id="chat_input_container">
            <input id="chat_input" type="text" placeholder="Type a message..." />
            <button id="chat_input_send">Send</button>
          </div>
          <button id="chat_logout">Logout</button>
        </div>
      </div>
    `;

    document.getElementById("chat_input_send").addEventListener("click", () => this.sendMessage());
    document.getElementById("chat_logout").addEventListener("click", () => this.logout());
    this.loadMessages();
  }

  logout() {
    auth.signOut().then(() => this.renderLogin());
  }

  sendMessage() {
    const message = document.getElementById("chat_input").value;
    if (!message) return;

    const user = auth.currentUser;
    db.ref("chats/").push({ name: user.email, message, userId: user.uid });
    document.getElementById("chat_input").value = "";
  }

  loadMessages() {
    db.ref("chats/").on("value", (snapshot) => {
      const chatContainer = document.getElementById("chat_content_container");
      chatContainer.innerHTML = "";

      snapshot.forEach((msg) => {
        const { name, message } = msg.val();
        const messageDiv = document.createElement("div");
        messageDiv.className = "message_container";
        messageDiv.innerHTML = `<p class="message_user">${name}</p><p>${message}</p>`;
        chatContainer.appendChild(messageDiv);
      });

      chatContainer.scrollTop = chatContainer.scrollHeight;
    });
  }
}

window.onload = () => new ChatApp();
