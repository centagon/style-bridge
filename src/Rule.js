import unitParse from 'unit-parse';
import { head } from 'lodash';
import { StringUtils } from './Utils';

export class RuleValue {
    constructor(value) {
        this.raw = value;
        ({ value: this.value, unit: this.unit } = unitParse(value));
    }
}

export default class Rule {
    constructor(rule, bridge) {
        this.rule = rule;
        this.bridge = bridge;
        this.properties = this.extractProperties();
        this.mediaQuery = this.extractMediaQuery();
    }

    set(property, value = null) {
        if (typeof property === 'object') {
            Object.entries(property).forEach(prop => this.set(...prop));
        } else {
            const definedStyles = Rule.getDefinedStyles(this.rule);

            definedStyles.setProperty(
                StringUtils.toKebabCase(property),
                (new RuleValue(value)).raw,
            );

            this.properties = this.extractProperties();
        }
    }

    remove(property) {
        Rule.getDefinedStyles(this.rule)
            .removeProperty(StringUtils.toKebabCase(property));

        this.properties = this.extractProperties();
    }

    extractProperties() {
        const properties = new Map();
        const definedStyles = Rule.getDefinedStyles(this.rule);

        [...definedStyles].forEach((property) => {
            const value = definedStyles[property];

            if (!value) {
                return;
            }

            properties.set(property, new RuleValue((value)));
        });

        return properties;
    }

    extractMediaQuery() {
        const { parentRule } = this.rule;
        const queryText = (parentRule && parentRule.constructor.name === 'CSSMediaRule')
            ? parentRule.conditionText
            : null;

        return head(this.bridge.queryList.get(queryText));
    }

    toObject() {
        const properties = {};

        this.extractProperties().forEach((value, property) => {
            properties[property] = value.raw;
        });

        return properties;
    }

    static getDefinedStyles(rule) {
        return rule.style || {};
    }
}

export class RuleList {
    constructor() {
        this.cssRules = [];
    }

    append(selector, rule) {
        if (!this.has(selector)) {
            this.cssRules[selector] = [];
        }

        this.cssRules[selector].push(rule);
    }

    get(selector) {
        return this.cssRules[selector] || undefined;
    }

    has(selector) {
        return this.get(selector) !== undefined;
    }
}
