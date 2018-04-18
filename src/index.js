import { sortBy } from 'lodash';
import Rule, { RuleList } from './Rule';

export class MediaQuery {
    constructor(name, constraints = []) {
        this.name = name;
        this.constraints = constraints;
    }

    toQueryString() {
        const query = this.constraints;

        return query ? `@media ${query}` : '';
    }
}

export class QueryList {
    constructor(queryList = {}) {
        this.queries = Object.entries(queryList).map(entry => new MediaQuery(...entry));
    }

    has(queryText) {
        return this.get(queryText).length > 0;
    }

    get(queryText = null) {
        return this.queries.filter(query => query.constraints === queryText);
    }

    getQueryInstance(queryText) {
        return this.queries.find(x => x.name === queryText);
    }

    toObject() {
        return sortBy(this.queries, query => query.constraints !== null);
    }
}

export default class StyleBridge {
    constructor(selectorText, queryList = {}) {
        this.selectorText = selectorText;
        this.queryList = new QueryList(queryList);
        this.rules = new RuleList();
    }

    parse() {
        this.extractRules(this.getSheetRules());

        return this;
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

    select(selector, query = null) {
        const rules = this.rules.get(selector);

        if (query === null) {
            return new RuleList(rules);
        }

        if (rules === undefined) {
            return this.insert(selector, query);
        }

        return rules.find(rule => rule.mediaQuery.name === query)
            || this.insert(selector, query);
    }

    insert(selector, query) {
        const queryString = this.queryList.getQueryInstance(query).toQueryString();
        const ruleString = queryString
            ? `${queryString} { ${selector} {} }`
            : `${selector} {}`;

        this.getDocumentSheet().insertRule(ruleString);
        this.parse();

        return this.select(selector, query);
    }

    toObject() {
        const queries = this.queryList.toObject();
        const result = { mediaqueries: {}, rules: {} };

        queries.forEach((query) => {
            result.mediaqueries[query.name] = query.constraints;
            result.rules[query.name] = {};

            Object.entries(this.rules.cssRules).forEach((cssRule) => {
                const [selector, rules] = cssRule;
                const rule = rules.find(r => r.mediaQuery.name === query.name);

                if (rule && (Object.keys(rule.toObject()).length > 0)) {
                    result.rules[query.name][selector] = rule.toObject();
                }
            });
        });

        return result;
    }

    getSheetRules() {
        return this.getDocumentSheet().cssRules;
    }

    getDocumentSheet() {
        return document.querySelector(this.selectorText).sheet;
    }
}
