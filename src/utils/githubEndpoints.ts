/**
 * Utility functions for GitHub.com and GitHub Enterprise Server (GHES) endpoints
 */

export function normalizeInstanceUrl(inputUrl?: string | null): string {
  if (!inputUrl || !inputUrl.trim()) {
    return 'https://github.com';
  }
  let url = inputUrl.trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }
  return url.replace(/\/+$/, '');
}

export function isStandardGitHub(instanceUrl?: string | null): boolean {
  const normalized = normalizeInstanceUrl(instanceUrl);
  try {
    const parsed = new URL(normalized);
    return parsed.hostname.toLowerCase() === 'github.com';
  } catch {
    return true;
  }
}

export function getRestBaseUrl(instanceUrl?: string | null): string {
  const normalized = normalizeInstanceUrl(instanceUrl);
  if (isStandardGitHub(normalized)) {
    return 'https://api.github.com';
  }
  // GitHub Enterprise Server REST v3 endpoint
  return `${normalized}/api/v3`;
}

export function getGraphQLEndpoint(instanceUrl?: string | null): string {
  const normalized = normalizeInstanceUrl(instanceUrl);
  if (isStandardGitHub(normalized)) {
    return 'https://api.github.com/graphql';
  }
  // GitHub Enterprise Server GraphQL endpoint
  return `${normalized}/api/graphql`;
}

export function getInstanceDomain(instanceUrl?: string | null): string {
  const normalized = normalizeInstanceUrl(instanceUrl);
  try {
    const parsed = new URL(normalized);
    return parsed.hostname;
  } catch {
    return 'github.com';
  }
}
