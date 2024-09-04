export function mapDifficultyToText(difficulty: number): string {
    switch (difficulty) {
        case 0:
            return 'Questions should be very simple and brief.';
        case 1:
            return 'Questions should be simple and concise.';
        case 2:
            return 'Questions should be straightforward and relatively short.';
        case 3:
            return 'Questions should be slightly challenging and moderately detailed.';
        case 4:
            return 'Questions should involve a moderate level of understanding and some complexity.';
        case 5:
            return 'Questions should be balanced in difficulty with a mix of length and complexity.';
        case 6:
            return 'Questions should be somewhat challenging with increasing length and detail.';
        case 7:
            return 'Questions should be challenging and more complex with greater detail.';
        case 8:
            return 'Questions should be very challenging, lengthy, and intricate.';
        case 9:
            return 'Questions should be highly challenging, long, detailed.';
        case 10:
            return 'Questions should be extremely challenging, long, and complex. Even experts should find them difficult.';
        default:
            return '';
    }
}
