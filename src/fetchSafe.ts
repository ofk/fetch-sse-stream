import { FetchResponseError } from './FetchResponseError';

export async function fetchSafe(
  ...args: Parameters<typeof fetch>
): Promise<ReturnType<typeof fetch>> {
  const resp = await fetch(...args);
  if (!resp.ok) {
    throw new FetchResponseError(resp);
  }
  return resp;
}
