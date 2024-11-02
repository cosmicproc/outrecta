export const truncate = (s: string, max: number) =>
    s.substring(0, max) + (s.length > max ? '...' : '');

export function mapDifficultyToText(difficulty: number): string {
    switch (difficulty) {
        case 0:
            return 'extremely easy';
        case 1:
            return 'very easy';
        case 2:
            return 'easy';
        case 3:
            return 'moderately difficult';
        case 4:
            return 'difficult';
        case 5:
            return 'very difficult';
        case 6:
            return 'extremely difficult';
        default:
            return '';
    }
}
