export interface ExampleApiStatus {
  ok: boolean;
}

export function getExampleStatus(): ExampleApiStatus {
  return { ok: true };
}
