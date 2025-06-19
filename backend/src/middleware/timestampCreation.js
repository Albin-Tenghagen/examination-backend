export function timestampCreation() {
  const date = new Date();
  const stockholmDate = date.toLocaleString("sv-SE", {
    timeZone: "Europe/Stockholm",
  });

  return stockholmDate.replace(" ", " ");
}
