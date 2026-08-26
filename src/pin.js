export async function hashPin(pin) {
  const data = new TextEncoder().encode(`sc-pin-v1:${pin}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
