document.addEventListener("DOMContentLoaded", () => {
  const nameInput = document.getElementById("nameInput");
  const urlInput = document.getElementById("urlInput");
  const addLinkButton = document.getElementById("addLink");
  const linkList = document.getElementById("linkList");
  const openAllButton = document.getElementById("openAll");

  console.log(addLinkButton.innerText);

  // load save links --
  function loadLinks() {
    chrome.storage.sync.get(["links"], (result) => {
      const links = result.links || [];
      linkList.innerHTML = "";
      links.forEach((link, index) => {
        const linkItem = document.createElement("div");
        linkItem.className = "link-item";
        linkItem.innerHTML = `
          <input type="text" value="${link.name}" data-index="${index}" class="name-edit">
          <input type="text" value="${link.url}" data-index="${index}" class="url-edit">
          <button class="delete-btn" data-index="${index}">X</button>
         `;
        linkList.appendChild(linkItem);
      });
    });
  }

  // Save links
  function saveLinks(links) {
    chrome.storage.sync.set({ links });
  }

  //   add new link
  addLinkButton.addEventListener("click", () => {
    const name = nameInput.value.trim();
    const url = urlInput.value.trim();

    if (name && url) {
      chrome.storage.sync.get(["links"], (result) => {
        const links = result.links || [];
        links.push({ name, url });
        saveLinks(links);
        nameInput.value = "";
        urlInput.value = "";
        loadLinks();
      });
    }
  });

  // Update or delete link
  linkList.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
      const index = e.target.dataset.index;
      chrome.storage.sync.get(["links"], (result) => {
        const links = result.links || [];
        links.splice(index, 1);
        saveLinks(links);
        loadLinks();
      });
    }
  });

  linkList.addEventListener("change", (e) => {
    if (
      e.target.classList.contains("name-edit") ||
      e.target.classList.contains("url-edit")
    ) {
      const index = e.target.dataset.index;
      chrome.storage.sync.get(["links"], (result) => {
        const links = result.links || [];
        if (e.target.classList.contains("name-edit")) {
          links[index].name = e.target.value;
        } else {
          links[index].url = e.target.value;
        }
        saveLinks(links);
      });
    }
  });

  // Open all tabs
  openAllButton.addEventListener("click", () => {
    chrome.storage.sync.get(["links"], (result) => {
      const links = result.links || [];
      links.forEach((link) => {
        chrome.tabs.create({ url: link.url });
      });
    });
  });

  // Initial load
  loadLinks();
});
