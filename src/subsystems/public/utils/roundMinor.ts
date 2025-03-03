export function roundMinor(n: number): number {
    const power: number = Math.pow(10, Math.floor(Math.log10(n)));
    return power * Math.floor((n - 1) / power);
}