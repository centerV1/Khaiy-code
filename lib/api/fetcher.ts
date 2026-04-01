type ApiBody = BodyInit | object | undefined;

type ApiRequestInit = Omit<RequestInit, "body"> & {
  body?: ApiBody;
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
};

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"
).replace(/\/$/, "");

export function getApiBaseUrl() {
  return API_BASE_URL;
}

export async function apiFetch<T>(
  path: string,
  init: ApiRequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const headers = new Headers(init.headers);
  const body = serializeBody(init.body, headers);
  const requestCache =
    init.cache ?? (init.next ? undefined : ("no-store" as RequestCache));

  const response = await fetch(url, {
    ...init,
    headers,
    body,
    credentials: "include",
    cache: requestCache,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const payload = await parseResponse(response);

  if (!response.ok) {
    throw new ApiError(getErrorMessage(payload), response.status, payload);
  }

  return payload as T;
}

function serializeBody(body: ApiBody, headers: Headers) {
  if (!body) {
    return undefined;
  }

  if (
    body instanceof FormData ||
    body instanceof URLSearchParams ||
    body instanceof Blob ||
    body instanceof ArrayBuffer ||
    typeof body === "string"
  ) {
    return body as BodyInit;
  }

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return JSON.stringify(body);
}

async function parseResponse(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return getErrorMessage(error.data) || error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if (error && typeof error === "object") {
    const maybeMessage = Reflect.get(error, "message");
    if (typeof maybeMessage === "string") {
      return maybeMessage;
    }

    const maybeError = Reflect.get(error, "error");
    if (typeof maybeError === "string") {
      return maybeError;
    }
  }

  return "Something went wrong. Please try again.";
}
