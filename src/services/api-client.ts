export const API_BASE_URL = "https://rayolbistro.chefchefe.app/api/v1";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { Accept: "application/json" },
      signal,
    });
  } catch (error) {
    if ((error as Error)?.name === "AbortError") throw error;
    throw new ApiError(
      "Não foi possível se conectar ao cardápio. Verifique sua conexão.",
    );
  }

  if (!response.ok) {
    throw new ApiError(
      `O cardápio não pôde ser carregado (erro ${response.status}).`,
      response.status,
    );
  }

  return (await response.json()) as T;
}
