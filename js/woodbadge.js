// js/woodbadge.js

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("woodbadge-content");

  if (!container) {
    console.error("Missing #woodbadge-content container in wood-badge.html");
    return;
  }

  if (!WOODBADGE_SHEET_URL || WOODBADGE_SHEET_URL.includes("PASTE_")) {
    container.innerHTML = `
      <p style="color:red;">
        Google Sheet CSV link is missing. Add it in js/woodbadge-data.js.
      </p>
    `;
    return;
  }

  fetch(WOODBADGE_SHEET_URL)
    .then(response => {
      if (!response.ok) {
        throw new Error("Could not fetch Google Sheet data.");
      }
      return response.text();
    })
    .then(csvText => {
      const rows = parseCSV(csvText);
      const data = formatRows(rows);
      renderWoodBadge(data, container);
    })
    .catch(error => {
      console.error(error);
      container.innerHTML = `
        <p style="color:red;">
          Unable to load Wood Badge content. Please check the Google Sheet link.
        </p>
      `;
    });
});

function parseCSV(csvText) {
  const rows = [];
  let currentRow = [];
  let currentValue = "";
  let insideQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"' && insideQuotes && nextChar === '"') {
      currentValue += '"';
      i++;
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      currentRow.push(currentValue.trim());
      currentValue = "";
    } else if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (currentValue || currentRow.length) {
        currentRow.push(currentValue.trim());
        rows.push(currentRow);
        currentRow = [];
        currentValue = "";
      }

      if (char === "\r" && nextChar === "\n") {
        i++;
      }
    } else {
      currentValue += char;
    }
  }

  if (currentValue || currentRow.length) {
    currentRow.push(currentValue.trim());
    rows.push(currentRow);
  }

  return rows;
}

function formatRows(rows) {
  const header = rows[0].map(h => h.trim().toLowerCase());
  const body = rows.slice(1);

  return body
    .map(row => {
      const item = {};

      header.forEach((columnName, index) => {
        item[columnName] = row[index] || "";
      });

      return {
        cluster: item.cluster || "",
        clusterTitle: item.clustertitle || item["cluster title"] || "",
        module: item.module || "",
        subsection: item.subsection || "",
        content: item.content || "",
        supportingDocuments:
          item.supportingdocuments ||
          item["supporting documents"] ||
          item.documents ||
          ""
      };
    })
    .filter(item => item.cluster && item.module);
}

function parseSupportingDocuments(value) {
  if (!value) return [];

  return value
    .split(";")
    .map(item => {
      const parts = item.split("|");

      return {
        title: (parts[0] || "Supporting document").trim(),
        url: (parts[1] || "").trim()
      };
    })
    .filter(doc => doc.url);
}

function renderWoodBadge(data, container) {
  const grouped = {};

  data.forEach(item => {
    const clusterKey = item.cluster;
    const clusterTitle = item.clusterTitle || item.cluster;
    const moduleTitle = item.module;

    if (!grouped[clusterKey]) {
      grouped[clusterKey] = {
        title: clusterTitle,
        modules: {}
      };
    }

    if (!grouped[clusterKey].modules[moduleTitle]) {
      grouped[clusterKey].modules[moduleTitle] = [];
    }

    grouped[clusterKey].modules[moduleTitle].push({
      label: item.subsection,
      content: item.content,
      documents: parseSupportingDocuments(item.supportingDocuments)
    });
  });

  container.innerHTML = "";

  Object.entries(grouped).forEach(([clusterId, cluster], index) => {
    const panel = document.createElement("div");
    panel.className = `tab-panel ${index === 0 ? "active" : ""}`;
    panel.id = slugify(clusterId);

    panel.innerHTML = `
      <h3 style="color:var(--purple);">${escapeHTML(clusterId)} — ${escapeHTML(cluster.title)}</h3>
    `;

    Object.entries(cluster.modules).forEach(([moduleTitle, sections], moduleIndex) => {
      const details = document.createElement("details");
      details.className = "detail-block reveal";

      if (moduleIndex === 0) {
        details.open = true;
      }

      details.innerHTML = `
        <summary>
          <div>
            <h3>${escapeHTML(moduleTitle)}</h3>
            <div class="sub">Module</div>
          </div>
          <span class="chev">+</span>
        </summary>

        <div class="detail-body">
          <div class="field-grid">
            ${sections.map(section => renderSection(section)).join("")}
          </div>
        </div>
      `;

      panel.appendChild(details);
    });

    container.appendChild(panel);
  });

  renderTabs(Object.keys(grouped));
}

function renderSection(section) {
  return `
    <div class="field">
      <div class="field-label">${escapeHTML(section.label)}</div>
      <p>${formatContent(section.content)}</p>

      ${section.documents.length ? `
        <div class="supporting-docs">
          <h4>Supporting Documents</h4>
          <div class="doc-grid">
            ${section.documents.map(doc => `
              <a class="doc-card" href="${escapeAttribute(doc.url)}" target="_blank" rel="noopener">
                ${escapeHTML(doc.title)}
              </a>
            `).join("")}
          </div>
        </div>
      ` : ""}
    </div>
  `;
}

function renderTabs(clusterNames) {
  const tabsContainer = document.getElementById("woodbadge-tabs");

  if (!tabsContainer) return;

  tabsContainer.innerHTML = "";

  clusterNames.forEach((clusterName, index) => {
    const button = document.createElement("button");
    button.className = `tab-btn ${index === 0 ? "active" : ""}`;
    button.dataset.target = slugify(clusterName);
    button.textContent = clusterName;

    button.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.classList.remove("active");
      });

      document.querySelectorAll(".tab-panel").forEach(panel => {
        panel.classList.remove("active");
      });

      button.classList.add("active");

      const targetPanel = document.getElementById(button.dataset.target);
      if (targetPanel) {
        targetPanel.classList.add("active");
      }
    });

    tabsContainer.appendChild(button);
  });
}

function formatContent(text) {
  if (!text) return "";

  return escapeHTML(text)
    .replace(/\n/g, "<br>")
    .replace(/•/g, "<br>•");
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHTML(value);
}