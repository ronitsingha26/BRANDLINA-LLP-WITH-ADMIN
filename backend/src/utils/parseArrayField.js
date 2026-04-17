export function parseArrayField(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean).map((item) => String(item).trim());
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (!trimmed) {
      return [];
    }

    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.filter(Boolean).map((item) => String(item).trim());
      }
    } catch {
      // fall through to comma split
    }

    return trimmed
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}
