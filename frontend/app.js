const baseUrlInput = document.getElementById("base-url");
const apiSettingsForm = document.getElementById("api-settings");
const createLeadForm = document.getElementById("create-lead-form");
const updateStatusForm = document.getElementById("update-status-form");
const scheduleVisitForm = document.getElementById("schedule-visit-form");
const refreshDashboardBtn = document.getElementById("refresh-dashboard");
const clearLogBtn = document.getElementById("clear-log");
const apiLog = document.getElementById("api-log");
const dashboardCards = document.getElementById("dashboard-cards");
const connectionHint = document.getElementById("connection-hint");
const fillLeadDummyBtn = document.getElementById("fill-lead-dummy");
const fillStatusDummyBtn = document.getElementById("fill-status-dummy");
const fillVisitDummyBtn = document.getElementById("fill-visit-dummy");
const runDemoFlowBtn = document.getElementById("run-demo-flow");

const STORAGE_KEY = "graphy_api_base";
let lastLeadId = null;
let autoSwitchAttempted = false;

function getBaseUrl() {
  return (localStorage.getItem(STORAGE_KEY) || baseUrlInput.value || "").replace(/\/+$/, "");
}

function setBaseUrl(url) {
  localStorage.setItem(STORAGE_KEY, url);
  baseUrlInput.value = url;
  updateConnectionHint();
}

function logResponse(title, payload, isError = false) {
  apiLog.classList.toggle("error", isError);
  const stamp = new Date().toLocaleTimeString();
  apiLog.textContent = `[${stamp}] ${title}\n${JSON.stringify(payload, null, 2)}\n`;
}

async function request(path, options = {}) {
  const base = getBaseUrl();
  if (!base) {
    throw new Error("Backend base URL is required.");
  }

  const response = await fetch(`${base}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = { message: await response.text() };
  }

  if (!response.ok) {
    const err = new Error(`HTTP ${response.status}`);
    err.details = data;
    throw err;
  }

  return data;
}

function updateConnectionHint() {
  const base = getBaseUrl();
  connectionHint.classList.remove("bad", "good");

  if (!base) {
    connectionHint.textContent = "Backend URL is required.";
    connectionHint.classList.add("bad");
    return;
  }

  try {
    const baseOrigin = new URL(base).origin;
    const sameOrigin = baseOrigin === window.location.origin;
    if (sameOrigin) {
      connectionHint.textContent =
        "Warning: Frontend and backend are on same origin. If API returns 404, run frontend on 3001 and keep backend on 3000.";
      connectionHint.classList.add("bad");
      return;
    }
  } catch {
    connectionHint.textContent = "Backend URL format looks invalid.";
    connectionHint.classList.add("bad");
    return;
  }

  connectionHint.textContent = `Backend configured: ${base}`;
  connectionHint.classList.add("good");
}

function normalizeStatusRows(raw) {
  if (Array.isArray(raw)) return raw;
  if (raw && Array.isArray(raw.rows)) return raw.rows;
  return [];
}

function renderDashboard(stats) {
  const statusRows = normalizeStatusRows(stats.leadsByStatus);
  const statusText =
    statusRows.length > 0
      ? statusRows.map((row) => `${row.status}: ${row.count ?? row["count(*)"] ?? "-"}`).join(" | ")
      : "No grouped status data";

  dashboardCards.innerHTML = `
    <div class="card">
      <p class="label">Total Leads</p>
      <p class="value">${stats.totalLeads ?? 0}</p>
    </div>
    <div class="card">
      <p class="label">Visits Scheduled</p>
      <p class="value">${stats.visitsScheduled ?? 0}</p>
    </div>
    <div class="card">
      <p class="label">Leads By Status</p>
      <p class="value" style="font-size:1rem">${statusText}</p>
    </div>
  `;
}

async function loadDashboard() {
  try {
    const result = await request("/dashboard");
    renderDashboard(result.data || {});
    logResponse("GET /dashboard", result);
  } catch (error) {
    const currentBase = getBaseUrl();
    if (!autoSwitchAttempted && currentBase.endsWith(":3000")) {
      autoSwitchAttempted = true;
      try {
        const probe = await fetch("http://localhost:3002/");
        if (probe.ok) {
          setBaseUrl("http://localhost:3002");
          logResponse("Auto Switch", {
            message: "Port 3000 unavailable. Switched backend URL to http://localhost:3002",
          });
          return loadDashboard();
        }
      } catch {
        // Ignore probe failure and continue with original error.
      }
    }
    logResponse("Dashboard Error", { message: error.message, details: error.details }, true);
  }
}

apiSettingsForm.addEventListener("submit", (event) => {
  event.preventDefault();
  setBaseUrl(baseUrlInput.value.trim());
  logResponse("Saved Base URL", { baseUrl: getBaseUrl() });
  loadDashboard();
});

createLeadForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const payload = {
    name: document.getElementById("lead-name").value.trim(),
    phone: document.getElementById("lead-phone").value.trim(),
    source: document.getElementById("lead-source").value.trim() || undefined,
  };

  try {
    const result = await request("/leads", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    lastLeadId = result?.data?.id ?? null;
    logResponse("POST /leads", result);
    createLeadForm.reset();
    loadDashboard();
  } catch (error) {
    logResponse("Create Lead Error", { message: error.message, details: error.details }, true);
  }
});

updateStatusForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const leadId = Number(document.getElementById("status-lead-id").value);
  const status = document.getElementById("lead-status").value;

  try {
    const result = await request(`/leads/${leadId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    logResponse(`PATCH /leads/${leadId}/status`, result);
    updateStatusForm.reset();
    loadDashboard();
  } catch (error) {
    logResponse("Update Status Error", { message: error.message, details: error.details }, true);
  }
});

scheduleVisitForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const payload = {
    leadId: Number(document.getElementById("visit-lead-id").value),
    property: document.getElementById("visit-property").value.trim(),
    visitDate: document.getElementById("visit-date").value,
    visitTime: document.getElementById("visit-time").value,
  };

  try {
    const result = await request("/visits", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    logResponse("POST /visits", result);
    scheduleVisitForm.reset();
    loadDashboard();
  } catch (error) {
    logResponse("Schedule Visit Error", { message: error.message, details: error.details }, true);
  }
});

refreshDashboardBtn.addEventListener("click", loadDashboard);
clearLogBtn.addEventListener("click", () => {
  apiLog.classList.remove("error");
  apiLog.textContent = "Cleared.";
});

fillLeadDummyBtn.addEventListener("click", () => {
  document.getElementById("lead-name").value = "Aman Test";
  document.getElementById("lead-phone").value = "9999999999";
  document.getElementById("lead-source").value = "Instagram";
});

fillStatusDummyBtn.addEventListener("click", () => {
  document.getElementById("status-lead-id").value = lastLeadId || 1;
  document.getElementById("lead-status").value = "CONTACTED";
});

fillVisitDummyBtn.addEventListener("click", () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  document.getElementById("visit-lead-id").value = lastLeadId || 1;
  document.getElementById("visit-property").value = "Flat A-101";
  document.getElementById("visit-date").value = tomorrow.toISOString().slice(0, 10);
  document.getElementById("visit-time").value = "11:00";
});

runDemoFlowBtn.addEventListener("click", async () => {
  try {
    const leadRes = await request("/leads", {
      method: "POST",
      body: JSON.stringify({
        name: "Demo User",
        phone: "8888888888",
        source: "Demo Flow",
      }),
    });

    const id = leadRes?.data?.id;
    if (!id) {
      throw new Error("Lead created but no lead id returned.");
    }
    lastLeadId = id;

    await request(`/leads/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: "CONTACTED" }),
    });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await request("/visits", {
      method: "POST",
      body: JSON.stringify({
        leadId: id,
        property: "Demo Property",
        visitDate: tomorrow.toISOString().slice(0, 10),
        visitTime: "10:30",
      }),
    });

    await loadDashboard();
    logResponse("Demo Flow Complete", { leadId: id, status: "CONTACTED", visitScheduled: true });
  } catch (error) {
    logResponse("Demo Flow Error", { message: error.message, details: error.details }, true);
  }
});

const savedBase = localStorage.getItem(STORAGE_KEY);
if (savedBase) {
  baseUrlInput.value = savedBase;
}
updateConnectionHint();
loadDashboard();
