import { normalizeDigitalProfile } from './normalizeDigitalProfile';
import { mockDigitalProfile } from './mockDigitalProfile';

/**
 * digitalProfileService.js
 *
 * Single place responsible for fetching Digital Profile data and
 * handing it to normalizeDigitalProfile(). Components never call
 * fetch() or touch raw API responses directly.
 *
 * Base URL follows the project's existing env-variable convention
 * (Vite exposes import.meta.env.VITE_*). If no API base URL is
 * configured, or the request fails, this falls back to the isolated
 * mock fixture — clearly logged as a fallback, never silently mixed
 * into production data.
 */

const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || '';

/**
 * Fetches the Digital Profile for a given application ID.
 * Returns { data, error, usedFallback }.
 */
export const fetchDigitalProfile = async (applicationId) => {
  // No backend configured yet in this environment — use the isolated
  // mock fixture so the screen remains inspectable during frontend work.
  if (!API_BASE_URL) {
    await simulateNetworkDelay();
    return {
      data: normalizeDigitalProfile(mockDigitalProfile),
      error: null,
      usedFallback: true,
    };
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/digital-profile${applicationId ? `/${applicationId}` : ''}`,
      { headers: { 'Content-Type': 'application/json' } }
    );

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const json = await response.json();
    return { data: normalizeDigitalProfile(json), error: null, usedFallback: false };
  } catch (err) {
    // Keep the console message generic — never log applicant PII.
    console.error('Digital Profile request failed.');
    return { data: null, error: err, usedFallback: false };
  }
};

const simulateNetworkDelay = (ms = 700) => new Promise((resolve) => setTimeout(resolve, ms));
