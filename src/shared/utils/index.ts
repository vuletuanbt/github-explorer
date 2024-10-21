/**
 * for use on the client side
 * @param url 
 * @returns 
 */
export function apiUrl(url: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  return `${baseUrl}${url}`;
};
