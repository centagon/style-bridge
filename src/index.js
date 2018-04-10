import { head, sortBy } from 'lodash';
import Rule, { RuleList } from './Rule';

export class MediaQuery {
    constructor(name, constraints) {
        this.name = name;
        this.constraints = constraints;
    }

    toString() {
        return this.constraints
            ? this.constraints.join(' ')
            : null;
    }
}

export class QueryList {
    constructor(queryList) {
        this.queries = Object.entries(queryList).map(entry => new MediaQuery(...entry));
    }

    has(queryText) {
        return this.get(queryText).length > 0;
    }

    get(queryText) {
        return this.queries.filter((query) => {
            if (!query.constraints) {
                return queryText === null;
            }

            return query.constraints.filter(constraint => constraint === queryText).length > 0;
        });
    }

    toObject() {
        return sortBy(this.queries, query => query.constraints !== null);
    }
}

export default class StyleBridge {
    constructor(selectorText, queryList) {
        this.selectorText = selectorText;
        this.queryList = new QueryList(queryList);
        this.rules = new RuleList();
    }

    parse() {
        const element = document.querySelector(this.selectorText);
        const { cssRules } = element.sheet;

        return this.extractRules(cssRules);
    }

    extractRules(rules) {
        [...rules].forEach((rule) => {
            const { selectorText } = rule;

            if (selectorText === undefined) {
                if (this.queryList.has(rule.conditionText)) {
                    this.extractRules(rule.cssRules);
                }
            } else {
                this.rules.append(selectorText, new Rule(rule, this));
            }
        });
    }

    select(selector, query) {
        const rules = this.rules.get(selector);

        return head(rules.filter(rule => rule.mediaQuery.name === query));
    }

    toObject() {
        const queries = this.queryList.toObject();
        const result = { mediaqueries: {}, rules: {} };

        queries.forEach((query) => {
            result.mediaqueries[query.name] = query.toString();
            result.rules[query.name] = {};

            Object.entries(this.rules.cssRules).forEach((cssRule) => {
                const [selector, rules] = cssRule;
                const rule = head(rules.filter(r => r.mediaQuery.name === query.name));

                if (rule) {
                    result.rules[query.name][selector] = rule.toObject();
                }
            });
        });

        return result;
    }
}
