export function hasChanged(
  base: string | undefined,
  input: string | undefined,
): boolean {
  // Verifica se ambos os valores são indefinidos ou nulos
  if (base === undefined && input === undefined) {
    return false;
  }

  // Verifica se um dos valores é indefinido ou nulo
  if (base === undefined || input === undefined) {
    return true;
  }

  // Compara os valores para verificar se eles são diferentes
  return base !== input;
}
