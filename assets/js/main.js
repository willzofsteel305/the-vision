function setFooterYear() {
  const year = new Date().getFullYear();
  document.querySelectorAll("#year").forEach((node) => {
    node.textContent = year;
  });
}

document.addEventListener("DOMContentLoaded", setFooterYear);
