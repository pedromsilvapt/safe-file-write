# safe-file-write

> Write to a file, making sure it's parent folders exist, and that if the write operation is cancelled mid-writing, it does not corrupt any possible file there previously.

# Installation
You can install this package globally, so that it is accessible everywhere in your system.

```shell
npm install --save safe-file-write
```

# Usage
Just import the module and call the function. Ir returns a function the resolves when the writing has finished.

```typescript
import writeFileSafe from 'write-file-safe';

writeFileSafe( '/path/to/file.txt', contents )
    .then( () => console.log( 'FINISHED' ) )
    .catch( error => console.error( error ) );
```