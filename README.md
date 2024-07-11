# alchemist
A simple command line wrapper for Javascript expressions and more

> [!NOTE]
> This tool is still in its development stage. Feel free to contribute.

## Installation
Clone this repository
```
git clone https://github.com/vaexey/alchemist.git
cd alchemist
```
Install as a global module
```
npm install -g
```

## Usage
```
alc|alchemist <javascript expression> [// arg1 [arg2 ...]]
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
alc "content = file(stdin); content ? content.length : log('-1')"
```

4. Handle errors
```
alc "(file(stdin) ?? error(\`Could not read file ${stdin}\`)).length"
```

5. Calculate documented arithmetic operations
```
alc "address = args[0]; opcode = args[1]; address_width = 5; (opcode << address_width) + address + CRLF" // 85 4
```

6. Any valid NodeJS expression you can come up with
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

## Javascript extensions
Alchemist provides a couple of extensions to the NodeJS environment - mainly to shorten the expressions.  
*Note: You can peek at the extensions by opening the file `fills.js`*  

Constants:
```js
const CR = "\r"
const LF = "\n"
const CRLF = CR + LF
```

Runtime variables:
```js
// Contains all data read to stdin (if any)
// type: string
const stdin;

// Contains command line arguments provided after // symbols (if any)
// type: string[]
const args;
```

Aliases:
```js
function log(...args) // console.log wrapper
function error(...args) // console.error wrapper that throws exception on call
function file(path, options?) // fs.readFileSync wrapper
```

Prototype extensions:
```js
Object.prototype.json(reviver?) // JSON.parse wrapper for 'this' casted to string
Object.prototype.toJson(pretty?) // JSON.stringify wrapper with pretty print switch for 'this' object
Object.prototype.toFile(path, options?) // fs.writeFileSync wrapper with 'this' casted to string as the file contents
```

## Why?
Someone may ask *Why would one use alchemist when there are already tools like sed and awk?*  
As far as I am concerned, these tools are widely used and loved by the community, but they pose certain entry barriers for newbies. Alchemist provides ease of use for those who already had written some code in Javascript and do not want to spend time reading manuals.

## License
The software is licensed under 3-Clause BSD NON-AI License