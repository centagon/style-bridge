/* global describe, it */
import should from 'should';
import StyleBridge, { MediaQuery, QueryList } from '../src/index';
import Rule, { RuleList } from '../src/Rule';

const { JSDOM } = require('jsdom');

const jsdom = new JSDOM(`<!doctype html>
    <html>
        <head>
            <link rel="stylesheet" id="stylesheet" type="text/css" href="./test.css" media="all" /> 
        </head>
        <body></body>
    </html>`, {
    runScripts: 'dangerously',
    resources: 'usable',
    url: `file:///${__dirname}/`,
});

const { window } = jsdom;
global.document = window.document;

describe('MediaQuery', () => {
    describe('#constructor', () => {
        it('defines the `name` and `constraint` property.', () => {
            const query = new MediaQuery('my-awesome-query', 'screen and (max-width: 991px)');

            should(query).have.property('name');
            should(query).have.property('constraints');
        });
    });
});

describe('QueryList', () => {
    describe('#constructor', () => {
        it('should not complain when no initial queryList is given.', () => {
            should(() => new QueryList()).not.throwError();
        });

        it('defines the `queries` property.', () => {
            should(new QueryList()).have.property('queries');
        });
    });

    describe('#has', () => {
        it('returns false if the given query could not be found.', () => {
            const list = new QueryList();

            should(list.has('non-existing-query')).type('boolean');
            should(list.has('non-existing-query')).equal(false);
        });

        it('returns true if the given query could be found.', () => {
            const list = new QueryList({
                desktop: null,
            });

            should(list.has('desktop')).type('boolean');
            should(list.has()).equal(true);
        });
    });

    describe('#get', () => {
        it('returns the match for null queries.', () => {
            const list = new QueryList({
                desktop: null,
            });

            should(list.get(null)).not.empty();
        });

        it('returns an empty array when the given query could not be found.', () => {
            const list = new QueryList({
                desktop: 'screen and (max-width: 500px)',
            });

            should(list.get('another query')).be.empty();
        });

        it('should return the matching query.', () => {
            const query = 'screen and (max-width: 500px)';
            const list = new QueryList({
                mobile: query,
            });

            should(list.get(query)).not.empty();
        });
    });

    describe('#getQueryInstance', () => {
        it('should return the query instance.', () => {
            const list = new QueryList({
                desktop: null,
            });

            should(list.getQueryInstance('desktop')).not.null();
            should(list.getQueryInstance('desktop')).be.equal(list.queries[0]);
        });
    });

    describe('#toObject', () => {
        it('should return an object with queries.', () => {
            const list = new QueryList({
                mobile: 'screen and (max-width: 500px)',
                tablet: 'screen and (max-width: 991px)',
                desktop: null,
            });

            should(list.toObject()).be.type('object');
            should(list.toObject()).not.null();
        });

        it('should sort the object with empty queries first.', () => {
            const list = new QueryList({
                mobile: 'screen and (max-width: 500px)',
                tablet: 'screen and (max-width: 991px)',
                desktop: null,
            }).toObject();

            should(list[0].name).equal('desktop');
        });
    });
});

describe('StyleBrige', () => {
    describe('#constructor', () => {
        it('defines the selectorText property.', () => {
            const bridge = new StyleBridge('#my-css-file');

            should(bridge).have.property('selectorText');
            should(bridge).property('selectorText').equal('#my-css-file');
        });

        it('defines the queryList property.', () => {
            const bridge = new StyleBridge('#my-css-file');

            should(bridge).have.property('queryList');
            should(bridge).property('queryList').be.instanceof(QueryList);
        });

        it('defines the rules property.', () => {
            const bridge = new StyleBridge('#my-css-file');

            should(bridge).have.property('rules');
            should(bridge).property('rules').instanceof(RuleList);
        });
    });

    describe('#parse', () => {
        it('returns the StyleBridge instance.', () => {
            const bridge = new StyleBridge('#stylesheet').parse();

            should(bridge).be.instanceof(StyleBridge);
        });
    });

    describe('#select', () => {
        it('should return an instance of Rule when selecting with a selector and query.', () => {
            window.addEventListener('load', () => {
                const bridge = new StyleBridge('#stylesheet', {
                    desktop: null,
                }).parse();

                should(bridge.select('body', 'desktop')).be.instanceof(Rule);
            });
        });

        it('should a querylist when the query is set to null.', () => {
            window.addEventListener('load', () => {
                const bridge = new StyleBridge('#stylesheet', {
                    desktop: null,
                }).parse();

                should(bridge.select('body')).be.instanceof(RuleList);
            });
        });

        it('should insert a new rule when the selector could not be found.', () => {
            window.addEventListener('load', () => {
                const bridge = new StyleBridge('#stylesheet', {
                    desktop: null,
                }).parse();

                should(bridge.select('#non-existing-element', 'desktop')).be.instanceof(Rule);
            });
        });

        it('should insert a new rule when the query is found but the selector is not found on that query.', () => {
            window.addEventListener('load', () => {
                const bridge = new StyleBridge('#stylesheet', {
                    desktop: null,
                    tablet: 'screen and (max-width: 991px)',
                }).parse();

                should(bridge.select('#element', 'tablet')).be.instanceof(Rule);
            });
        });

        it('should return the rule.', () => {
            window.addEventListener('load', () => {
                const bridge = new StyleBridge('#stylesheet', {
                    desktop: null,
                }).parse();

                should(bridge.select('body', 'desktop')).be.instanceof(Rule);
            });
        });
    });

    describe('#insert', () => {
        it('should insert a new rule.', () => {
            window.addEventListener('load', () => {
                const bridge = new StyleBridge('#stylesheet', { desktop: null }).parse();

                should(bridge.rules.length).equal(0);

                bridge.insert('body', 'desktop');

                should(bridge.rules.length).equal(1);
            });
        });
    });

    describe('#toObject', () => {
        it('should convert the instance to object.', () => {
            window.addEventListener('load', () => {
                const bridge = new StyleBridge('#stylesheet', { desktop: null }).parse();
                bridge.insert('body', 'desktop');

                should(bridge.toObject()).be.of.type('object');
                should(bridge.toObject()).have.property('mediaqueries');
                should(bridge.toObject()).have.property('rules');
            });
        });
    });

    describe('#getSheetRules', () => {
        it('should get the sheet rules.', () => {
            window.addEventListener('load', () => {
                const bridge = new StyleBridge('#stylesheet', { desktop: null });
                bridge.insert('body', 'desktop');

                should(bridge.getSheetRules()[0]).be.of.type('object');
            });
        });
    });

    describe('#getDocumentSheet', () => {
        it('should get the sheet from the document.', () => {
            window.addEventListener('load', () => {
                const bridge = new StyleBridge('#stylesheet', { desktop: null });

                should(bridge.getDocumentSheet().constructor.name).equal('CSSStyleSheet');
            });
        });
    });
});
