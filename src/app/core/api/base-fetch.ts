import { Result } from "@/app/core/models/result.ts";
import { AUTH_PATHS } from "@/app/modules/auth/routes/auth-paths.ts";
import { ACCESS_TOKEN_KEY, getRefreshTokenFormData, logout, REFRESH_TOKEN_KEY, setLoginData } from "@/lib/authUtils.ts";
import { getErrorMessages } from "@/lib/formUtils";
import { toastError } from "@/lib/toasterUtils.tsx";
import { baseURL, navigateFn, preloaderHandler } from "@/app/core/api/api-request-config.ts";

type FetchRequestOptions = {
  method?: string;
  headers?: HeadersInit;
  body?: any;
  params?: Record<string, any>;
  signal?: AbortSignal;
  skipPreloader?: boolean;
  // internal flag used to avoid infinite retry loop
  _retry?: boolean;
};

function isFormData(val: unknown): val is FormData {
  return typeof FormData !== "undefined" && val instanceof FormData;
}

function isPlainObject(val: unknown): val is Record<string, any> {
  return !!val && typeof val === "object" && !Array.isArray(val) && !isFormData(val);
}

function buildUrl(path: string, params?: Record<string, any>): string {
  const normalizedPath = path.startsWith("http")
    ? path
    : `${baseURL}${path.startsWith("/") ? "" : "/"}${path}`;
  const url = new URL(normalizedPath, window.location.origin);
  if (params) {
    Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null)
      .forEach(([k, v]) => url.searchParams.append(k, String(v)));
  }
  return url.toString();
}

async function parseJsonSafe<T>(res: Response): Promise<T | undefined> {
  const contentType = res.headers.get('content-type')?.toLowerCase() ?? '';
  if (!contentType.includes('json')) return undefined;

  try {
    const text = await res.json();//(await res.json()).trim().replace(/^\uFEFF/, '');
    if (!text) return undefined;
    if (typeof text === 'string') return JSON.parse(text);
    return text;
  } catch (error) {
    // console.error(error);
    return undefined;
  }
}

async function request<T>(path: string, options: FetchRequestOptions = {}): Promise<T> {
  const {
    method = "GET",
    headers: inputHeaders,
    body: inputBody,
    params,
    signal,
    skipPreloader = false,
    _retry = false
  } = options;

  const url = buildUrl(path, params);

  const headers = new Headers(inputHeaders || {});
  // const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  // if (token) {
  //   headers.set("Authorization", `Bearer ${token}`);
  // }
  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  let body = inputBody;
  if (body !== undefined && body !== null && !isFormData(body)) {
    if (isPlainObject(body) || Array.isArray(body)) {
      headers.set("Content-Type", "application/json");
      body = JSON.stringify(body);
    }
  }

  try {
    if (preloaderHandler && !skipPreloader) {
      preloaderHandler.increment();
    }

    const res = await fetch(url, {
      method,
      headers,
      body,
      signal,
      credentials: 'include'
    });

    // Auto-refresh on 401 (once)
    if (res.status === 401 && !_retry) {
      try {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
        const refreshRes = await fetch(buildUrl("/auth/token"), {
          method: "POST",
          body: getRefreshTokenFormData(refreshToken ?? undefined),
          // Skip preloader for the refresh request to avoid double-counting
          signal
        });

        if (!refreshRes.ok) {
          throw new Error("Failed to refresh token");
        }

        const refreshData = (await parseJsonSafe<any>(refreshRes)) || {};
        const { access_token, refresh_token } = refreshData;

        if (!access_token || !refresh_token) {
          throw new Error("Invalid refresh token response");
        }

        setLoginData(access_token, refresh_token);

        // Retry the original request with new token, but avoid touching preloader again
        return await request<T>(path, {
          method,
          headers: inputHeaders,
          body: inputBody,
          params,
          signal,
          skipPreloader: false,
          _retry: true
        });
      } catch (refreshError) {
        await logout();
        if (navigateFn) {
          navigateFn(AUTH_PATHS.login());
        } else {
          window.location.href = AUTH_PATHS.login();
        }
        throw refreshError;
      }
    }

    // For non-2xx responses (other than the 401 handled above), mimic axios by rejecting
    if (!res.ok) {
      // Attempt to parse and include server message if present, but still reject
      const maybeJson = await parseJsonSafe<any>(res);
      const msg = (maybeJson && (maybeJson.message || maybeJson?.error)) || `HTTP error: ${res.status}`;
      throw new Error(msg);
    }

    // Parse JSON result and handle isSuccess toast like axios interceptor
    const response: T = await parseJsonSafe<T>(res);
    const data = (await parseJsonSafe<T>(res)) as Result<T>;
    if (data && data.isSuccess === false) {
      toastError(getErrorMessages(data), data?.message || "Failed to perform action");
    }

    return response;
  } catch (error: any) {
    // Don't display errors for aborted requests
    if (error?.name === "AbortError") {
      // Just propagate the abort error
      throw error;
    }
    throw error;
  } finally {
    if (preloaderHandler && !skipPreloader) {
      preloaderHandler.decrement();
    }
  }
}

// SSE message type
type SSEMessage<T = any> = {
  event?: string;
  data: T;
  id?: string;
  retry?: number;
  raw: string;
};

// Options for event-stream
type EventStreamOptions = Omit<FetchRequestOptions, "method"> & {
  method?: "GET" | "POST";
  onMessage?: (message: SSEMessage) => void;
  onError?: (error: any) => void;
};

// Internal SSE request using fetch for Authorization support
async function eventStreamRequest<T = any>(
  path: string,
  options: EventStreamOptions = {}
): Promise<{ close: () => void }> {

  const {
    method = "GET",
    headers: inputHeaders,
    body: inputBody,
    params,
    signal,
    skipPreloader: inputSkipPreloader,
    onMessage,
    onError,
    _retry = false
  } = options;

  try {
    // Default to skipping preloader for long-lived streams unless explicitly overridden
    const skipPreloader = inputSkipPreloader ?? true;

    const url = buildUrl(path, params);

    const headers = new Headers(inputHeaders || {});
    // Override Accept for SSE
    headers.set("Accept", "text/event-stream");
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    // Handle body for POST requests
    let body = inputBody;
    if (method === "POST" && body !== undefined && body !== null && !isFormData(body)) {
      if (isPlainObject(body) || Array.isArray(body)) {
        headers.set("Content-Type", "application/json");
        body = JSON.stringify(body);
      }
    }

    const controller = new AbortController();
    const combinedAbort = controller.signal;
    if (signal) {
      // Propagate external aborts
      if (signal.aborted) {
        controller.abort((signal as any).reason);
      } else {
        signal.addEventListener("abort", () => controller.abort((signal as any).reason), { once: true });
      }
    }

    let reader: ReadableStreamDefaultReader<Uint8Array> | null = null;

    const begin = async (): Promise<{ close: () => void }> => {
      try {
        if (preloaderHandler && !skipPreloader) {
          preloaderHandler.increment();
        }

        const res = await fetch(url, {
          method,
          headers,
          body,
          signal: combinedAbort,
          cache: "no-store",
        });

        // Attempt token refresh on initial 401 (once)
        if (res.status === 401 && !_retry) {
          try {
            const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
            const refreshRes = await fetch(buildUrl("/auth/token"), {
              method: "POST",
              body: getRefreshTokenFormData(refreshToken ?? undefined),
              signal: combinedAbort
            });
            if (!refreshRes.ok) {
              throw new Error("Failed to refresh token");
            }
            const refreshData = (await parseJsonSafe<any>(refreshRes)) || {};
            const { access_token, refresh_token } = refreshData;
            if (!access_token || !refresh_token) {
              throw new Error("Invalid refresh token response");
            }
            setLoginData(access_token, refresh_token);
            // Retry stream once after refreshing token
            return await eventStreamRequest<T>(path, {
              ...options,
              method,
              body: inputBody,
              skipPreloader: false,
              _retry: true,
              signal: combinedAbort
            });
          } catch (refreshError) {
            await logout();
            if (navigateFn) {
              navigateFn(AUTH_PATHS.login());
            } else {
              window.location.href = AUTH_PATHS.login();
            }
            throw refreshError;
          }
        }

        if (!res.ok) {
          throw new Error(`HTTP error: ${res.status}`);
        }

        if (!res.body) {
          throw new Error("Readable stream not supported by this environment");
        }

        reader = res.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          // Process complete SSE events separated by blank lines
          let sepIndex = buffer.indexOf("\n\n");
          while (sepIndex !== -1) {
            const rawEvent = buffer.slice(0, sepIndex).replace(/\r/g, "");
            buffer = buffer.slice(sepIndex + 2);

            const lines = rawEvent.split("\n");
            const evt: SSEMessage<T> = { raw: rawEvent } as SSEMessage<T>;
            const dataLines: string[] = [];

            for (const line of lines) {
              if (!line || line.startsWith(":")) continue;
              const colon = line.indexOf(":");
              const field = colon === -1 ? line : line.slice(0, colon);
              const value = colon === -1 ? "" : line.slice(colon + 1).replace(/^ /, "");
              switch (field) {
                case "event":
                  evt.event = value;
                  break;
                case "data":
                  dataLines.push(value);
                  break;
                case "id":
                  evt.id = value;
                  break;
                case "retry": {
                  const n = Number(value);
                  if (!Number.isNaN(n)) evt.retry = n;
                }
                  break;
                default:
                  break;
              }
            }

            const dataStr = dataLines.join("\n");
            try {
              // Try JSON first; fallback to raw string
              (evt as SSEMessage<any>).data = dataStr ? JSON.parse(dataStr) : ("" as any);
            } catch {
              (evt as SSEMessage<any>).data = dataStr as any;
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            onMessage && onMessage(evt);

            sepIndex = buffer.indexOf("\n\n");
          }
        }
      } catch (err) {
        // Ignore AbortError
        if ((err as any)?.name !== "AbortError") {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          onError && onError(err);
        }
        throw err;
      } finally {
        if (preloaderHandler && !skipPreloader) {
          preloaderHandler.decrement();
        }
        if (reader) {
          try {
            await reader.cancel();
          } catch {
            // ignore
          }
        }
      }
    };

    // Start the stream asynchronously; bubble errors to onError if provided
    begin().catch((e) => {
      if ((e as any)?.name !== "AbortError") {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        onError && onError(e);
      }
    });

    return {
      close: () => {
        controller.abort();
      }
    };
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    onError && onError(e);
  }
}

const baseFetch = {
  get<T>(path: string, options?: Omit<FetchRequestOptions, "method" | "body">) {
    return request<T>(path, { ...options, method: "GET" });
  },
  post<T>(path: string, body?: any, options?: Omit<FetchRequestOptions, "method">) {
    return request<T>(path, { ...options, method: "POST", body });
  },
  put<T>(path: string, body?: any, options?: Omit<FetchRequestOptions, "method">) {
    return request<T>(path, { ...options, method: "PUT", body });
  },
  delete<T>(path: string, options?: Omit<FetchRequestOptions, "method" | "body">) {
    return request<T>(path, { ...options, method: "DELETE" });
  },
  // Start a text/event-stream (SSE) connection. Returns a handle with close().
  eventStream<T = any>(path: string, options?: EventStreamOptions) {
    options.skipPreloader ??= true;
    return eventStreamRequest<T>(path, options);
  },
};

export default baseFetch;
