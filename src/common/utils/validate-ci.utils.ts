export function isValidCi(ci: string): boolean {
    if(ci.length !== 11) {
        return false;
    }
    
    const months: number = parseInt(ci.substring(2, 4));
    const days: number = parseInt(ci.substring(4, 6));

    if(months < 1 || months > 12) {
        return false;
    }

    return !(days < 1 || days > 31);
}