/* eslint-disable import/prefer-default-export */

export class StringUtils {
    static toKebabCase(string) {
        return string.replace(/([a-z])([A-Z])/g, '$1-$2')
            .replace(/\s+/g, '-')
            .toLowerCase();
    }
}
