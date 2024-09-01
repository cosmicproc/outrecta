export function mapDifficultyToText(difficulty: number) {
    switch (difficulty) {
        case 0:
            return 'extremely easy';
        case 1:
            return 'very easy';
        case 2:
            return 'easy';
        case 3:
            return 'fairly easy';
        case 4:
            return 'moderate';
        case 5:
            return 'average';
        case 6:
            return 'fairly challenging';
        case 7:
            return 'challenging';
        case 8:
            return 'very challenging';
        case 9:
            return 'extremely difficult';
        case 10:
            return 'nearly impossible';
        default:
            return 'invalid level';
    }
}
