export function isValidCi(ci: string): boolean {
    if(ci.length !== 11) {
        return false;
    }

    const months = parseInt(ci.substring(2, 3));
    const days = parseInt(ci.substring(4, 5));

    if(months < 1 || months > 12) {
        return false;
    }

    if(days < 1 || days > 31) {
        return false;
    }

    return true;
}