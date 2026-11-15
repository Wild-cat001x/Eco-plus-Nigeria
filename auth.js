let currentUser = JSON.parse(localStorage.getItem("ecopulse_user")) || null;
let allUsers = JSON.parse(localStorage.getItem("ecopulse_users")) || [];

function populateStates() {
  const selectors = ["regState", "actionState", "mapStateFilter"];
  selectors.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = id === "mapStateFilter"
      ? `<option value="Nigeria">All Nigeria (36 States + FCT)</option>`
      : "";
    NIGERIAN_STATES.forEach(st => {
      const opt = document.createElement("option");
      opt.value = st;
      opt.textContent = st;
      if (st === "FCT Abuja" && id !== "mapStateFilter") opt.selected = true;
      el.appendChild(opt);
    });
  });
}

function toggleAuthMode(mode) {
  document.getElementById("loginBox").style.display = mode === "login" ? "block" : "none";
  document.getElementById("registerBox").style.display = mode === "register" ? "block" : "none";
}

function handleRegister() {
  const name = document.getElementById("regName").value.trim();
  const school = document.getElementById("regSchool").value.trim();
  const state = document.getElementById("regState").value;
  const email = document.getElementById("regEmail").value.trim().toLowerCase();
  const password = document.getElementById("regPass").value.trim();

  if (!name || !school || !email || !password) {
    alert("Please fill in your name, school, email, and password.");
    return;
  }
  if (allUsers.some(u => u.email === email)) {
    alert("This email is already registered. Please sign in.");
    return;
  }

  const newUser = { name, school, state, email, password, points: 30, vouchers: [] };
  allUsers.push(newUser);
  localStorage.setItem("ecopulse_users", JSON.stringify(allUsers));
  loginSuccess(newUser);
}

function handleLogin() {
  const email = document.getElementById("loginEmail").value.trim().toLowerCase();
  const password = document.getElementById("loginPass").value.trim();
  const found = allUsers.find(u => u.email === email && u.password === password);

  if (!found) {
    alert("Invalid email or password. Try creating an account or use One-Tap Demo Login.");
    return;
  }
  loginSuccess(found);
}

function demoLogin() {
  const demoUser = {
    name: "Abdulsalam",
    school: "Government Secondary School",
    state: "FCT Abuja",
    email: "abdulsalam@ecopulse.ng",
    password: "demo",
    points: 110,
    vouchers: []
  };
  if (!allUsers.some(u => u.email === demoUser.email)) {
    allUsers.push(demoUser);
    localStorage.setItem("ecopulse_users", JSON.stringify(allUsers));
  }
  loginSuccess(demoUser);
}

function loginSuccess(user) {
  currentUser = user;
  localStorage.setItem("ecopulse_user", JSON.stringify(currentUser));
  document.getElementById("authScreen").style.display = "none";
  document.getElementById("mainApp").style.display = "block";
  refreshDashboard();
}

function handleLogout() {
  localStorage.removeItem("ecopulse_user");
  currentUser = null;
  document.getElementById("mainApp").style.display = "none";
  document.getElementById("authScreen").style.display = "block";
}

function initAppBoot() {
  populateStates();
  const splash = document.getElementById("splashScreen");

  if (currentUser) {
    document.getElementById("splashGreeting").textContent = `Welcome back, ${currentUser.name}...`;
    document.getElementById("authScreen").style.display = "none";
    document.getElementById("mainApp").style.display = "block";
    refreshDashboard();

    setTimeout(() => {
      splash.style.opacity = "0";
      setTimeout(() => { splash.style.display = "none"; }, 450);
    }, 1500);
  } else {
    splash.style.display = "none";
    document.getElementById("authScreen").style.display = "block";
    document.getElementById("mainApp").style.display = "none";
  }
}
