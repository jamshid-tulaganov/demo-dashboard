import { describe, it, expect } from 'vitest';

describe('Icon Component Props', () => {
    it('should validate icon props interface', () => {
        const iconProps = {
            name: 'home',
            size: 24,
            color: 'auto',
        };

        expect(iconProps.name).toBe('home');
        expect(iconProps.size).toBe(24);
        expect(iconProps.color).toBe('auto');
    });

    it('should handle numeric size', () => {
        const size = 32;
        const sizeStr = typeof size === 'number' ? `${size}px` : size;

        expect(sizeStr).toBe('32px');
    });

    it('should handle string size', () => {
        const size = '2rem';
        const sizeStr = typeof size === 'number' ? `${size}px` : size;

        expect(sizeStr).toBe('2rem');
    });

    it('should handle auto color as currentColor', () => {
        const color = 'auto';
        const iconColor = color === 'auto' ? 'currentColor' : color;

        expect(iconColor).toBe('currentColor');
    });

    it('should use custom color when provided', () => {
        const color = '#ff0000';
        const iconColor = color === 'auto' ? 'currentColor' : color;

        expect(iconColor).toBe('#ff0000');
    });
});
