# @sealsystems/stream-assembler

Assemble data from multiple read streams into a single write stream.

## Installation

```bash
npm install @sealsystems/stream-assembler
```

## Quick start

First you need to add a reference to `@sealsystems/stream-assembler` within your application.

```javascript
const Assembler = require('@sealsystems/stream-assembler');
```

Then you can create an assembler object.

```javascript
const assembler = new Assembler(readables);
```

## API

### constructor(readables[, options])

- `readables` &lt;array&gt; | &lt;function&gt; Creates an object of type `Assembler`.
- `options` &lt;Object&gt; Pipe options
  - `end` &lt;boolean&gt; End the writer after all readers end. Defaults to true.

The `readables` array has to contain objects implementing the `stream.Readable` interface.

The `readables` function has to be either a synchronous or an `async` function for which the assembler object can `await` for. The function is called without any parameter and has to return the next read stream at each call or null if no read streams left.

### assembler.pipe(writeable)

- `writeable` <stream.Writeable> The destination for writing data.

Throws on error and returns null on success.

The `pipe` function attaches the `writeable` stream to all readable streams one at a time in the order the readable streams are given.

```javascript
const assembler = new Assembler(readables);

await assembler.pipe(writeable);
```
