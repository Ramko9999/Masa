export function convertHexToRGBA(color: string, alpha: number = 1) {
    const hexColor = color.replace("#", "");
    const r = parseInt(hexColor.substring(0, 2), 16);
    const g = parseInt(hexColor.substring(2, 4), 16);
    const b = parseInt(hexColor.substring(4, 6), 16);
  
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}