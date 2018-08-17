import { sortBy } from 'lodash';
import Rule, { RuleList } from './Rule';
import { QueryUtils } from './Utils';

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
        this.queries = QueryList.sort(Object.entries(queryList)
            .map(entry => new MediaQuery(...entry)));
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

    toObject(reverse = true) {
        const object = sortBy(this.queries, query => query.constraints !== null);

        return reverse === true
            ? object.reverse()
            : object;
    }

    static sort(queries) {
        const sortedQueries = [];

        Object.entries(queries)
            .sort((a, b) => QueryUtils.sort(a[1].constraints, b[1].constraints))
            .forEach((query) => {
                sortedQueries.push(query[1]);
            });

        return sortedQueries;
    }
}

export default class StyleBridge {
    constructor(selectorText, queryList = {}) {
        this.selectorText = selectorText;
        this.queryList = new QueryList(queryList);
        this.rules = Object.freeze(new RuleList());
    }

    parse() {
        this.extractRules(this.getSheetRules());

        return this;
    }

    extractRules(rules) {
        if (rules) {
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
    }

    select(selector, query = null) {
        const rules = this.rules.get(selector);

        if (query === null) {
            return new RuleList(rules);
        }

        if (rules === undefined) {
            Object.values(this.queryList.queries).forEach((e) => {
                this.insert(selector, e.name);
            });

            return this.select(selector, query);
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
        const element = typeof this.selectorText === 'object'
            ? this.selectorText
            : document.querySelector(this.selectorText);

        return element.sheet;
    }
}
