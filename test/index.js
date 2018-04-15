/* global describe, it */
import should from 'should';
import StyleBridge, { MediaQuery, QueryList } from '../src/index';

// describe('MediaQuery', () => {
//     describe('#constructor', () => {
//         it('defines the `name` and `constraint` property.', () => {
//             const query = new MediaQuery('my-awesome-query', ['max-width', '300px']);
//
//             should(query).have.property('name');
//             should(query).have.property('constraints');
//         });
//     });
//
//     describe('#toString', () => {
//         it('returns `null` when an empty or no constraint is given.', () => {
//             const query = new MediaQuery('my-awesome-query');
//
//             should(query.toString()).equal(null);
//         });
//
//         it('returns a string when a constraint is given.', () => {
//             const query = new MediaQuery('my-awesome-query', ['max-width', '300px']);
//
//             should(query.toString()).type('string');
//             should(query.toString()).equal('max-width 300px');
//         });
//     });
// });

describe('QueryList', () => {
    // describe('#constructor', () => {
    //     it('should not complain when no initial queryList is given.', () => {
    //         should(() => new QueryList()).not.throwError();
    //     });
    //
    //     it('defines the `queries` property.', () => {
    //         should(new QueryList()).have.property('queries');
    //     });
    // });
    //
    // describe('#has', () => {
    //     it('returns false if the given query could not be found.', () => {
    //         const list = new QueryList();
    //
    //         should(list.has('non-existing-query')).type('boolean');
    //         should(list.has('non-existing-query')).equal(false);
    //     });
    //
    //     it('returns true if the given query could be found.', () => {
    //         const list = new QueryList({
    //             desktop: null,
    //         });
    //
    //         should(list.has('desktop')).type('boolean');
    //         should(list.has()).equal(true);
    //     });
    // });

    describe('#get', () => {
        it('returns null when the given query could not be found.', () => {
            const list = new QueryList({
                desktop: ['test'],
            });

            list.get('desktop');
        });

        it('should return the matching query.');
    });

    // describe('#toObject', () => {
    //     it('should return an object with queries.');
    //
    //     it('should sort the object with empty queries first.');
    // });
});

// describe('StyleBrige', () => {
//     describe('#constructor', () => {
//
//     });
//
//     describe('#parse', () => {
//
//     });
//
//     describe('#extractRules', () => {
//
//     });
//
//     describe('#select', () => {
//
//     });
//
//     describe('#toObject', () => {
//
//     });
// });
