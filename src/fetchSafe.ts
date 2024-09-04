export async function fetchSafe(
  ...args: Parameters<typeof fetch>
): Promise<ReturnType<typeof fetch>> {
  const resp = await fetch(...args);
  if (!resp.ok) {
    throw new Error(`This fetch has failed: ${String(resp.status)} ${resp.statusText}`);
  }
  return resp;
}
