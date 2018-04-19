/* eslint-disable import/prefer-default-export, no-cond-assign, no-param-reassign */

export class StringUtils {
    static toKebabCase(string) {
        return string.replace(/([a-z])([A-Z])/g, '$1-$2')
            .replace(/\s+/g, '-')
            .toLowerCase();
    }
}

export class QueryUtils {
    static resolve(query) {
        const mediaqueryPattern = /^(screen\sand\s)?\((min|max)-width:\s\d+px\)(\sand\s\(max-width:\s\d+px\))?$/i;

        if (!mediaqueryPattern.test(query)) {
            return null;
        }

        const valuePattern = /\((min|max)-width:\s(\d+)px\)/gi;
        const matches = [];
        let next;

        while (next = valuePattern.exec(query)) {
            matches.push(next);
        }

        return matches.reduce((result, match) => {
            const type = match[1];
            const value = parseInt(match[2], 10);

            result[type] = value;

            return result;
        }, { min: null, max: null });
    }

    static compare(x, y) {
        if (x === null && y === null) return 0;
        if (x === null) return -1;
        if (y === null) return 1;
        if (x > y) return 1;
        if (x < y) return -1;

        return 0;
    }

    static sort(queryA, queryB) {
        const a = QueryUtils.resolve(queryA);
        const b = QueryUtils.resolve(queryB);

        if (a === null && b === null) return 0;
        if (a === null) return 1;
        if (b === null) return -1;
        if (a.min && b.min) {
            return QueryUtils.compare(a.min, b.min, () => QueryUtils.compare(a.max, b.max));
        }
        if (a.min && b.max) return QueryUtils.compare(a.min, b.max);
        if (a.max && b.min) return QueryUtils.compare(a.max, b.min);

        return QueryUtils.compare(a.max, b.max);
    }
}
