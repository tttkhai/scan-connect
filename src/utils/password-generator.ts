export function generatePassword(): string {
    const passOne = (Math.random() + 1).toString(36).substring(2, 8);
    const passTwo = (Math.random() + 1).toString(36).substring(2, 8);
    const upperPassOne = passOne.charAt(0).toUpperCase() + passOne.slice(1);
    const specialPassTwo = passTwo + "_" + (Math.random() + 1).toString(36).substring(2, 8);
    
    return `${upperPassOne}-${specialPassTwo}`;
}