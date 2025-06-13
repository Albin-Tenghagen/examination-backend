export function timestampCreation() {
  const date = new Date();
  const stockholmDate = date.toLocaleString("sv-SE", {
    timeZone: "Europe/Stockholm",
  });

  // stockholmDate is like: "2025-06-13 15:24:10"
  return stockholmDate.replace(" ", " ");
}
