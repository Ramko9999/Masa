export function positiveModulo(base: number, mod: number): number {
    const result = base % mod;
    return result < 0 ? result + mod : result
}