import apicache from "apicache";

export const cache = apicache.middleware;

export function clearCache(target) {
  apicache.clear(target);
}
