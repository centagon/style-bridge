# style-bridge

[![NPM Version](https://badge.fury.io/js/style-bridge.svg)](https://badge.fury.io/js/style-bridge)
[![Build Status](https://travis-ci.org/centagon/style-bridge.svg?branch=master)](https://travis-ci.org/centagon/style-bridge)

## Basic Usage

```js
import StyleBridge from 'style-bridge';

const bridge = new StyleBridge('my-stylesheet-selector', {
    desktop: [null],
    tablet: ['screen and (max-width: 991px)'],
    ...
});
```

To use StyleBrige, you will primarily use the `StyleBridge` constructor. Pass the constructor a selector expression
and an object consisting of the media-queries that you want to have parsed.

Nothing hapens until the `parse` method will be called. This let's the you decide when to (re-)parse the document or when.

```js
new StyleBridge(..., { ... }).parse();
```

### Interacting with selectors

#### Settings a css property

```js
bridge.select('.my-element', 'desktop').set('background-color', 'red');
```

#### Remove a property

```js
bridge.select('.my-element', 'desktop').remove('background-color');
```

#### Removing all properties

```js
brige.select('.my-element').remove();
```

### Exporting to object

```js
bridge.toObject();
// {
//     mediaqueries: {
//         desktop: '',
//         tablet: 'screen and (max-width: 991px)'
//     },
//     rules: {
//         desktop: {
//             body: {
//                 'background-color': 'red',
//                 'margin-top': '0px'
//             },
//         },
//         tablet: { ... }
//     }
// }
```

## Contributing

Have a bug? Please create an issue here on GitHub that conforms with
[our contributing guidelines](https://github.com/centagon/guidelines/blob/master/contributing.md).
You can also browse the [Help Wanted](https://github.com/centagon/primer/labels/help%20wanted)
tag in our issue tracker to find things to do.

## Security

If you discover a security vulnerability within this package, please send an e-mail directly to the Centagon
Developers at [developers@centagon.com](mailto:developers@centagon.com). All security vulnerabilities will be
promptly addressed.

## License

This package is available under the [MIT license](https://github.com/centagon/style-bridge/blob/master/LICENSE.md).

Copyright (c) 2018 Centagon, B.V.
