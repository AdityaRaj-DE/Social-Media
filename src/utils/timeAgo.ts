export function timeAgo(dateISO?: string) {
    if (!dateISO) return "";
    const diff = Date.now() - new Date(dateISO).getTime();
    const s = Math.floor(diff / 1000);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    const d = Math.floor(h / 24);
  
    if (s < 60) return `${s}s`;
    if (m < 60) return `${m}m`;
    if (h < 24) return `${h}h`;
    if (d < 7) return `${d}d`;
    return new Date(dateISO).toLocaleDateString();
  }
  