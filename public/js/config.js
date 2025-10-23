async function getConfig() {
  const res = await fetch("/config");
  const data = await res.json();
  return {
    host:data.host,
};
}
