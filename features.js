let posts = JSON.parse(localStorage.getItem("ecopulse_posts")) || [...SAMPLE_POSTS];
let selectedAction = { type: "Report Blocked Drain", points: 10 };
let uploadedMedia = { type: "", url: "" };

function switchTab(tabId, btnEl) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
  document.getElementById(tabId).classList.add("active");
  if (btnEl) btnEl.classList.add("active");
}

function selectActionType(type, points, tileEl) {
  selectedAction = { type, points };
  document.querySelectorAll(".action-tile").forEach(t => t.classList.remove("selected"));
  tileEl.classList.add("selected");
  document.getElementById("submitActionBtn").textContent = `Post & Earn +${points} Eco-Points`;
}

function detectGPS() {
  const locInput = document.getElementById("actionLocation");
  locInput.value = "Locating GPS...";
  if (!navigator.geolocation) {
    locInput.value = "Government Secondary School, Nigeria";
    return;
  }
  navigator.geolocation.getCurrentPosition(
    pos => {
      locInput.value = `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`;
    },
    () => {
      locInput.value = `${document.getElementById("actionState").value}, Nigeria`;
    }
  );
}

function handleMediaUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    uploadedMedia = {
      type: file.type.startsWith("video") ? "video" : "image",
      url: e.target.result
    };
    const preview = document.getElementById("mediaPreview");
    preview.innerHTML = uploadedMedia.type === "video"
      ? `<video src="${uploadedMedia.url}" controls class="feed-media"></video>`
      : `<img src="${uploadedMedia.url}" class="feed-media" alt="Preview">`;
  };
  reader.readAsDataURL(file);
}

function submitEcoAction() {
  const state = document.getElementById("actionState").value;
  const location = document.getElementById("actionLocation").value.trim() || `${state}, Nigeria`;
  const notes = document.getElementById("actionNotes").value.trim() || `${selectedAction.type} logged in ${state}.`;

  const newPost = {
    id: Date.now(),
    user: currentUser.name,
    state,
    type: selectedAction.type,
    points: selectedAction.points,
    location,
    notes,
    mediaType: uploadedMedia.type || "image",
    mediaUrl: uploadedMedia.url || "https://unsplash.com",
    likes: 1,
    time: "Just now"
  };

  posts.unshift(newPost);
  localStorage.setItem("ecopulse_posts", JSON.stringify(posts));

  currentUser.points += selectedAction.points;
  syncCurrentUser();

  document.getElementById("actionLocation").value = "";
  document.getElementById("actionNotes").value = "";
  document.getElementById("mediaPreview").innerHTML = "";
  uploadedMedia = { type: "", url: "" };

  updateGoogleMap(`${location}, ${state}, Nigeria`);
  refreshDashboard();
  alert(`Awesome! You earned +${selectedAction.points} Eco-Points.`);
}

function syncCurrentUser() {
  localStorage.setItem("ecopulse_user", JSON.stringify(currentUser));
  allUsers = allUsers.map(u => (u.email === currentUser.email ? currentUser : u));
  localStorage.setItem("ecopulse_users", JSON.stringify(allUsers));
}

function updateGoogleMap(queryText) {
  const q = encodeURIComponent(queryText || "Nigeria");
  document.getElementById("googleMapFrame").src = `https://google.com{q}&z=13&output=embed`;
  document.getElementById("openRealMapsBtn").href = `https://google.com{q}`;
}

function filterMapByState() {
  const st = document.getElementById("mapStateFilter").value;
  updateGoogleMap(st === "Nigeria" ? "Nigeria" : `${st} State, Nigeria`);
  renderMapPins();
}

function likePost(id) {
  posts = posts.map(p => (p.id === id ? { ...p, likes: p.likes + 1 } : p));
  localStorage.setItem("ecopulse_posts", JSON.stringify(posts));
  renderFeed();
}

function redeemReward(id) {
  const item = REWARDS_CATALOG.find(r => r.id === id);
  if (!item) return;
  if (currentUser.points < item.cost) {
    alert(`You need ${item.cost - currentUser.points} more Eco-Points for this reward.`);
    return;
  }
  const code = "ECO-" + Math.random().toString(36).substring(2, 8).toUpperCase();
  currentUser.points -= item.cost;
  currentUser.vouchers.unshift({ title: item.title, code });
  syncCurrentUser();
  refreshDashboard();
  alert(`Reward Claimed! Your Voucher Code is: ${code}`);
}

function renderFeed() {
  const container = document.getElementById("feedList");
  container.innerHTML = posts.map(p => `
    <div class="glass-card">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <strong>${p.user} • ${p.state}</strong>
        <span class="badge">+${p.points} pts</span>
      </div>
      <div style="font-size:12px;color:#a7f3d0;margin-top:4px;">${p.type} • ${p.location} (${p.time})</div>
      ${p.mediaType === "video"
        ? `<video src="${p.mediaUrl}" controls class="feed-media"></video>`
        : `<img src="${p.mediaUrl}" class="feed-media" alt="Eco Post">`}
      <p style="font-size:14px;margin-bottom:10px;">${p.notes}</p>
      <div style="display:flex;gap:8px;">
        <button class="btn btn-glass" style="padding:9px;" onclick="likePost(${p.id})">Support (${p.likes})</button>
        <a class="btn btn-primary" style="padding:9px;text-decoration:none;" target="_blank" href="https://google.com{encodeURIComponent(p.location + ', ' + p.state + ', Nigeria')}">Google Maps</a>
      </div>
    </div>
  `).join("");
}

function renderMapPins() {
  const filter = document.getElementById("mapStateFilter").value;
  const filtered = filter === "Nigeria" ? posts : posts.filter(p => p.state === filter);
  document.getElementById("mapPinList").innerHTML = filtered.map(p => `
    <div class="glass-card" style="padding:13px;">
      <div style="display:flex;justify-content:space-between;">
        <strong>${p.type}</strong>
        <span class="badge">${p.state}</span>
      </div>
      <div style="font-size:13px;color:#a7f3d0;margin:4px 0 8px;">${p.location}</div>
      <div style="display:flex;gap:8px;">
        <button class="btn btn-glass" style="padding:8px;font-size:13px;" onclick="updateGoogleMap('${p.location.replace(/'/g, "")}, ${p.state}, Nigeria')">Focus Map</button>
        <a class="btn btn-primary" style="padding:8px;font-size:13px;text-decoration:none;" target="_blank" href="https://google.com{encodeURIComponent(p.location + ', ' + p.state + ', Nigeria')}">Directions</a>
      </div>
    </div>
  `).join("");
}

function renderLeaderboard() {
  const board = [...SAMPLE_LEADERBOARD];
  if (currentUser && !board.some(b => b.name === currentUser.name)) {
    board.push({ name: currentUser.name, state: currentUser.state, points: currentUser.points });
  } else if (currentUser) {
    board.forEach(b => { if (b.name === currentUser.name) b.points = currentUser.points; });
  }
  board.sort((a, b) => b.points - a.points);
  document.getElementById("leaderboardList").innerHTML = board.map((u, idx) => `
    <div class="glass-card" style="display:flex;justify-content:space-between;align-items:center;padding:14px;">
      <div><strong>#${idx + 1} ${u.name}</strong><div style="font-size:12px;color:#a7f3d0;">${u.state}</div></div>
      <span class="badge" style="font-size:13px;">${u.points} pts</span>
    </div>
  `).join("");
}

function renderRewards() {
  document.getElementById("rewardsList").innerHTML = REWARDS_CATALOG.map(r => `
    <div class="glass-card">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <strong>${r.title}</strong>
        <span class="badge">${r.cost} pts</span>
      </div>
      <p style="font-size:13px;color:#a7f3d0;margin:6px 0 10px;">${r.desc}</p>
      <button class="btn btn-primary" style="padding:10px;" onclick="redeemReward('${r.id}')">Claim Reward</button>
    </div>
  `).join("");

  document.getElementById("voucherList").innerHTML = (currentUser.vouchers || []).map(v => `
    <div class="glass-card" style="padding:12px;">
      <strong>${v.title}</strong><div class="badge" style="margin-top:6px;">Code: ${v.code}</div>
    </div>
  `).join("") || `<p style="font-size:13px;color:#a7f3d0;">No vouchers claimed yet.</p>`;
}

function renderDeveloperInfo() {
  document.getElementById("devProfileBox").innerHTML = `
    <p style="margin-bottom:6px;"><strong>Developer Name:</strong> ${DEVELOPER_INFO.name}</p>
    <p style="margin-bottom:6px;"><strong>School:</strong> ${DEVELOPER_INFO.school}</p>
    <p style="margin-bottom:10px;"><strong>Class:</strong> ${DEVELOPER_INFO.studentClass}</p>
    <p style="font-size:13px;line-height:1.5;color:#d1fae5;">${DEVELOPER_INFO.bio}</p>
  `;
}

function resetAppDemo() {
  localStorage.removeItem("ecopulse_posts");
  posts = [...SAMPLE_POSTS];
  refreshDashboard();
  alert("Sample nationwide data restored.");
}

function refreshDashboard() {
  if (!currentUser) return;
  document.getElementById("userDisplayName").textContent = currentUser.name;
  document.getElementById("userStateBadge").textContent = `${currentUser.school} • ${currentUser.state}`;
  document.getElementById("pointsBalance").textContent = currentUser.points;
  renderFeed();
  renderMapPins();
  renderLeaderboard();
  renderRewards();
  renderDeveloperInfo();
}
