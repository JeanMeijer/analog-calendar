export class ProviderError extends Error {
  code: string;
  operation: string;
  context?: Record<string, unknown>;
  originalError: unknown;
  constructor(
    error: Error & { code?: string },
    operation: string,
    context?: Record<string, unknown>,
  ) {
    super(error?.message ?? "An unknown error occurred");
    this.name = "ProviderError";
    this.code = error?.code ?? "UNKNOWN_ERROR";
    this.operation = operation;
    this.context = context;
    this.originalError = error;
  }
}
