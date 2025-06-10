document.cookie = "cookieName=myValue; path=/; max-age=3600"; // gültig für 1 Stunde
function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}
export default getCookie;