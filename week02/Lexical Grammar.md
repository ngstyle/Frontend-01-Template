

# **Lexical Grammar**

> There are several situations where the identification of lexical input elements is sensitive to the syntactic grammar context that is consuming the input elements. This requires multiple goal symbols for the lexical grammar. The InputElementRegExpOrTemplateTail goal is used in syntactic grammar contexts where a RegularExpressionLiteral, a TemplateMiddle, or a TemplateTail is permitted. The InputElementRegExp goal symbol is used in all syntactic grammar contexts where a RegularExpressionLiteral is permitted but neither a TemplateMiddle, nor a TemplateTail is permitted. The InputElementTemplateTail goal is used in all syntactic grammar contexts where a TemplateMiddle or a TemplateTail is permitted but a RegularExpressionLiteral is not permitted. In all other contexts, InputElementDiv is used as the lexical goal symbol.

with the key part up front:

> There are several situations where the identification of lexical input elements is sensitive to the syntactic grammar context

Keep in mind that this is the lexical grammar definition, so all it aims to do is produce a set of tokens.

So let's break that down more. Consider a snippet like this:

```js
/foo/g
```
With no context given, there are two ways to interpret this:

1. [DivPunctuator](https://www.ecma-international.org/ecma-262/8.0/index.html#prod-DivPunctuator) [IdentifierName](https://www.ecma-international.org/ecma-262/8.0/index.html#prod-IdentifierName) [DivPunctuator](https://www.ecma-international.org/ecma-262/8.0/index.html#prod-DivPunctuator) [IdentifierName](https://www.ecma-international.org/ecma-262/8.0/index.html#prod-IdentifierName)

   ```js
   "/" "foo" "/" "g"
   ```

2. [RegularExpressionLiteral](https://www.ecma-international.org/ecma-262/8.0/index.html#prod-RegularExpressionLiteral)

   ```js
   "/foo/g"
   ```
   

From the standpoint of a lexer, it does not have enough information to know which of these to select. This means the lexer needs to have a flag like `expectRegex` or something, that toggles the behavior not just based on the current sequence of characters, but also on previously encountered tokens. *Something* needs to say "expect an operator next" or "expect a regex literal next".

The same is true for the following:

```js
}foo${
```

1. [RightBracePunctuator](https://www.ecma-international.org/ecma-262/8.0/index.html#prod-RightBracePunctuator) [IdentifierName](https://www.ecma-international.org/ecma-262/8.0/index.html#prod-IdentifierName) [Punctuator](https://www.ecma-international.org/ecma-262/8.0/index.html#prod-Punctuator)

   ```js
   "}" "foo$" "{"
   ```

2. [TemplateMiddle](https://www.ecma-international.org/ecma-262/8.0/index.html#prod-TemplateMiddle)

   ```js
   "}foo${"
   ```

A second toggle needs to be used for this case.

So that leaves us with a nice table of the 4 options that you've seen

| expectRegex | expectTemplate | InputElement                     |
| ----------- | -------------- | -------------------------------- |
| false       | false          | InputElementDiv                  |
| false       | true           | InputElementTemplateTail         |
| true        | false          | InputElementRegExp               |
| true        | true           | InputElementRegExpOrTemplateTail |

And the spec then covers when these flags toggle:

- `InputElementRegExpOrTemplateTail`: This goal is used in syntactic grammar contexts where a RegularExpressionLiteral, a TemplateMiddle, or a TemplateTail is permitted.

- `InputElementRegExp`: This goal symbol is used in all syntactic grammar contexts where a RegularExpressionLiteral is permitted but neither a TemplateMiddle, nor a TemplateTail is permitted.

- `InputElementTemplateTail`: This goal is used in all syntactic grammar contexts where a TemplateMiddle or a TemplateTail is permitted but a RegularExpressionLiteral is not permitted.

- `InputElementDiv`: This goal is used in all other contexts.



> [What does `InputElementDiv` stand for in ECMAScript lexical grammar](https://stackoverflow.com/questions/45722082/what-does-inputelementdiv-stand-for-in-ecmascript-lexical-grammar)

