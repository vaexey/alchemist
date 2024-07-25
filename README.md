# alchemist

[![npm version](https://badge.fury.io/js/alchemist-cli.svg)](https://badge.fury.io/js/alchemist-cli)  
> [!NOTE]
> This tool is still in its development stage. Feel free to contribute.

A simple command line wrapper for Javascript expressions and more  

**snake_case** to **PascalCase** conversion comparison between `sed` and `alchemist`:
```
$ cat snake_case | sed -E 's/[_]([a-z])/\U\1/gi;s/^([a-z])/\U\1/'
```
```
$ cat snake_case | alc "stdin.split('_').map((w,i) => {w = w.ss; w[0] = w[0].toUpperCase(); return w}).join('')"
```

## Prerequisites
This project requires [NodeJS and NPM](https://nodejs.org/en).

## Installation

#### A. Stable version
Install as a global module from [npm registry](https://www.npmjs.com/package/alchemist-cli)
```
npm install -g alchemist-cli
```

#### B. Latest features from git
Clone this repository
```
git clone https://github.com/vaexey/alchemist.git
cd alchemist
```
Install as a global module from source
```
npm install -g
```

## Usage
Full command line syntax:
```
alc|alchemist <javascript expression> [// arg1 [arg2 ...]]
```
Quick start:
```
$ echo GHI | alc "'Hello world! ' + args[0] + CRLF + stdin" // ABC DEF
Hello world! ABC
GHI
```

## Examples

1. Replace newlines in stdin with ; and print to stdout  
*Notice: Expression starting with a dot refer to a "stdin" string by default*
```
cat file | alc ".split('\n').join(';')"
```

2. Extract JSON value from file passed in command line arguments
```json
// file.json
{
    "key1": {
        "key2": [
            1,
            2
        ]
    }
}
```

```
alc "file(args[0]).json().key1.key2[1].toFile(args[1])" // file.json output.txt
```

```js
// output.txt
2
```

3. Create variables and conditionals
```
alc "content = file(tstdin); content ? content.length : log('-1')"
```

4. Handle errors
```
alc "(file(tstdin) ?? error(\`Could not read file \${tstdin}\`)).length"

alc "content = file(tstdin); assert(content != null, \`Could not read file \${tstdin}\`, content).length"
```

5. Calculate documented arithmetic operations
```
alc "address = args[0]; opcode = args[1]; address_width = 5; (opcode << address_width) + address + CRLF" // 85 4
```

6. Use `return` keyword in a function expression  
*Notice: Prepending an expression with an `@` wraps it into a function body that is immediately called which allows using this keyword*
```
alc "@if(args[0] > args[1]) return 'left\n'; return 'right\n';" // 1 2
```

7. Remove second to last character in string if it matches
```
alc "str = args[0].ss; if(str[-2] === '.') str[-2] = ''; str" // abc
```

8. Return an exit code
```
alc "exitCode(args[0]);EMPTY" // -1
```

9. Any valid NodeJS expression you can come up with
```
alc "require('crypto').createHash('sha256').update(args.join(' ')).digest('base64') + CRLF" // some text to be hashed
```

## Important notes

1. Javascript code usually must be surrounded by quotes  
This is caused by bash treating certain special characters as bash syntax (eg. brackets)  
Example:
```
// Bad - throws a bash error
alc log(args[0]) // abc
// Good
alc "log(args[0])" // abc
```

2. Certain characters must be escaped with `\` regardless of being inside quotes.  
This is caused by bash treating backticks and dollar sign variables as bash syntax.  
Example:
```
// Bad - unexpected behaviour
alc "`abc`"
alc "`${args.length} ${456}`"
// Good
alc "\`abc\`"
alc "\`\${args.length} \${456}\`"
```


3. It is usually a good practice to end data written to stdout with a new line.  
Alchemist provides a bunch of constants that can solve this issue as no new line symbols are placed by default.
Example:
```
// Bad - does not end with a newline and may cause cerain terminal emulators to display a malformed prompt
alc "args[0]" // abc
// Good - ends in (a) newline character(s)
alc "args[0] + LF" // abc
alc "args[0] + CRLF" // abc
```

4. Usually, the `stdin` constant contains stray whitespace characters, such as new line at the end.  
To prevent these from malforming the input, use the `tstdin` variable to reference the result of `.trim()` function on the `stdin` value.
```
// Bad - stray new line character makes the path invalid
echo file.json | alc "file(stdin)"
// Good
echo file.json | alc "file(tstdin)"
```

## Flasks
Alchemist provides a couple of extensions to the NodeJS environment - mainly to shorten the expressions. These extensions are packed in atomic units called *flasks*.  
A flask is loaded before expression evaluation and can contain functions that are called before certain events (load, before variable generation, before evaluation, after evauation) and expose global variables that will be available to the expression. Flasks can also have dependencies and/or conflicting flasks.  
  
Currently the only way to select which flasks are loaded is to define them in a config file stored in one of the valid locations eg. current working directory of `alc`.
```json
// alchemist.json
{
    "flasks": ["flask1", "flask2", "..."]
}
```

Alchemist comes pre-built with a couple of available flasks.  
*Note: You can peek at the extensions by opening directory `/src/flasks`*  

### alc
Flask that contains every basic alchemist flask as a depencency. Makes it easy to require all of them with a single keyword.

### base
The base alchemist flask - it is not advised to run alchemist without it.  
Main features:
* `help`/`help()` function that allows calling help like `alc help`
* basic constants:
```js
const CR = "\r";
const LF = "\n";
const CRLF = CR + LF;
const EMPTY = "";
```
* globalizing `alchemist` variable (which contains `args` and `stdin` by default)
  eg. `alc alchemist.args[0]` becomes `args[0]`

### alias
Contains basic function aliases and a couple of useful snippets  
Aliases:
```js
log -> console.log
error -> console.error
file -> fs.readFileSync
```
Functions:
```js
// Throws an exception with message when 'expected' value is not === true
function assert(expected, message?, chain?);

// Sets the process.exitCode to `code` if set or `0` otherwise
function exitCode(code?, chain?);
```

### proto
A more invasive flask that defines new properties on existing prototypes.  
```js
// JSON.parse wrapper for 'this' casted to string
Object.prototype.json(reviver?);

// JSON.stringify wrapper with pretty print switch for 'this' object
Object.prototype.toJson(pretty?);

// fs.writeFileSync wrapper with 'this' casted to string as the file contents
Object.prototype.toFile(path, options?);

// isNaN wrapper with 'this' as the main argument
Object.prototype.isNaN();

// Calls parseInt from 'this' casted to string with specified radix (default: 16)
Object.prototype.fromBase(radix?);

// Converts 'this' casted to number from base 10 to base specified by radix (default: 16)
Object.prototype.toBase(radix?);

// Calls the alias `assert` on this object as `chain` with the `delegate` function
Object.prototype.assert(delegate, message?)

// Calls the alias `assert` on this object as `chain` asserting that `this == expected`
Object.prototype.assertEqual(expected, message?)

// Calls the alias `assert` on this object as `chain` asserting that `this === expected`
Object.prototype.assertIs(expected, message?)
```

### exex
Flask that extends shortened expressions.  
Main features:
* append `stdin` to an expression starting with a dot
* wrap expression starting with a `@` in an anonymous function

### ss
Flask that implements powerful string extensions.  
*TODO: docs*

### dynflask
Flask that provides CLI to view available/loaded flasks.  
Commands:
```
alc flasks.help
alc flasks.list
```

## Why?
Someone may ask *Why would one use alchemist when there are already tools like sed and awk?*  
As far as I am concerned, these tools are widely used and loved by the community, but they pose certain entry barriers for newbies. Alchemist provides ease of use for those who already had written some code in Javascript and do not want to spend time reading manuals.
###### TLDR: Manuals bad, Javascript good

## License
The software is licensed under [3-Clause BSD NON-AI License](https://github.com/vaexey/alchemist/blob/master/LICENSE).