// utils/cloudinary.ts
export function cldThumb(url, w = 300) {
  if (!url) return "";
  const base = "/upload/";
  if (!url.includes(base)) return url;

  return url.replace(base, `/upload/w_${w},c_fill,f_auto,q_auto/`);
}
