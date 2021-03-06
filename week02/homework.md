# 作业

1. 正则表达式 匹配所有 Number 直接量: 

   > **Numeric Literals  Syntax**
   >
   > ```
   > NumericLiteral ::
   >        DecimalLiteral
   >        BinaryIntegerLiteral
   >        OctalIntegerLiteral
   >        HexIntegerLiteral
   >      
   > DecimalLiteral ::
   >        DecimalIntegerLiteral . DecimalDigits(opt) ExponentPart(opt)
   >        . DecimalDigits ExponentPart(opt)
   >        DecimalIntegerLiteral ExponentPart(opt)
   > 
   > DecimalIntegerLiteral ::
   >        0
   >        NonZeroDigit DecimalDigits(opt)
   >     
   > DecimalDigits ::
   >        DecimalDigit
   >        DecimalDigits DecimalDigit
   >     
   > DecimalDigit :: one of
   >     0 1 2 3 4 5 6 7 8 9
   > 		
   > NonZeroDigit :: one of
   >     1 2 3 4 5 6 7 8 9
   > 		
   > ExponentPart ::
   >     ExponentIndicator SignedInteger
   > 		
   > ExponentIndicator :: one of
   >     e E
   > 
   > SignedInteger ::
   >        DecimalDigits
   >     + DecimalDigits
   >     - DecimalDigits
   >     
   > BinaryIntegerLiteral ::
   >     0b BinaryDigits
   >     0B BinaryDigits
   > 
   > BinaryDigits ::
   >     BinaryDigit
   >     BinaryDigits BinaryDigit
   > 
   > BinaryDigit :: one of
   >     0 1
   >     
   > OctalIntegerLiteral ::
   >     0o OctalDigits
   >     0O OctalDigits
   >     
   > OctalDigits ::
   >     OctalDigit
   >     OctalDigits OctalDigit
   >     
   > OctalDigit :: one of
   >     0 1 2 3 4 5 6 7
   >     
   > HexIntegerLiteral ::
   >     0x HexDigits
   >     0X HexDigits
   >     
   > HexDigits ::
   >     HexDigit
   >     HexDigits HexDigit
   >     
   > HexDigit :: one of
   > 0 1 2 3 4 5 6 7 8 9 a b c d e f A B C D E F
   > ```

```javascript
	// 十进制普通计数         
  // let r1_1 = /^[+-]?(0|[1-9]\d*)\.?\d*$/; // xx.
  // let r1_2 = /^[+-]?(0?|[1-9]\d*)\.?\d+$/; // .xx
  // let r1 = new RegExp(r1_1.source + '|' + r1_2.source);

  // 十进制 普通&科学计数法
  // let r2_1 = /^[+-]?(0|[1-9]\d*)\.?\d*([eE][+-]?\d+)?$/;
  // let r2_2 = /^[+-]?(0?|[1-9]\d*)\.?\d+([eE][+-]?\d+)?$/;
  // let r2 = new RegExp(r2_1.source + '|' + r2_2.source);
  let r2 = /^[+-]?(((0|[1-9]\d*)\.?\d*)|((0?|[1-9]\d*)\.?\d+))([eE][+-]?\d+)?$/;

  // 二进制
  let r3 = /^0[bB][01]+$/;
  // 八进制
  let r4 = /^0[oO][0-7]+$/;
  // 十六进制
  let r5 = /^0[xX][0-9a-fA-F]+$/;

  let regStr = Array.of(r2, r3, r4, r5).map(r => r.source).reduce((pre, curr, i) => {
    return pre + '|' + curr
  });

  let reg = new RegExp(regStr);
```



2. UTF-8 Encoding 的函数

   ```javascript
   function encodeUtf8(text) {
     const code = encodeURIComponent(text);
     const bytes = [];
     for (var i = 0; i < code.length; i++) {
       const c = code.charAt(i);
       if (c === '%') {
         const hex = code.charAt(i + 1) + code.charAt(i + 2);
         const hexVal = parseInt(hex, 16);
         bytes.push(hexVal);
         i += 2;
       } else bytes.push(c.charCodeAt(0));
     }
     return bytes;
   }
   
   function toUTF8Array(str) {
       var utf8 = [];
       for (var i = 0; i < str.length; i++) {
         // UCS-2
         var charcode = str.charCodeAt(i);
         if (charcode < 0x80) {
           // 0x00 - 0x7F 
           utf8.push(charcode);
         } else if (charcode < 0x800) {
           utf8.push(
             0xc0 | (charcode >> 6),
             0x80 | (charcode & 0x3f)
           );
         } else if (charcode < 0xd800 || charcode >= 0xe000) {
           // charcode 小于0xFFFF
           utf8.push(
             0xe0 | (charcode >> 12),
             0x80 | ((charcode >> 6) & 0x3f),
             0x80 | (charcode & 0x3f)
           );
         } else {
           // From 0xd800 to 0xdfff
           i++;
           charcode = ((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff)
           utf8.push(
             0xf0 | (charcode >> 18),
             0x80 | ((charcode >> 12) & 0x3f),
             0x80 | ((charcode >> 6) & 0x3f),
             0x80 | (charcode & 0x3f)
           );
         }
       }
       return utf8;
     }
   
     function toUTF8Str(str) {
       return toUTF8Array(str).map(ele => `\\x${ele.toString(16)}`).join('');
     }
   ```

   

3. 正则表达式，匹配所有的字符串直接量，单引号和双引号

> **String Literals**
>
> ```
> StringLiteral ::
>     " DoubleStringCharacters(opt) " ' SingleStringCharacters(opt) '
> 
> DoubleStringCharacters ::
>     DoubleStringCharacter DoubleStringCharacters(opt)
> 
> SingleStringCharacters ::
>     SingleStringCharacter SingleStringCharacters(opt)
> 
> DoubleStringCharacter ::
>        SourceCharacter but not one of " or \ or LineTerminator
>        <LS>
>        <PS>
>        \ EscapeSequence
>        LineContinuation
>  
> SingleStringCharacter ::
>        SourceCharacter but not one of ' or \ or LineTerminator
>        <LS>
>        <PS>
>        \ EscapeSequence
>        LineContinuation
>  
> LineContinuation ::
>     \ LineTerminatorSequence
> 		
> EscapeSequence ::
>        CharacterEscapeSequence
>        0 [lookahead ∉ DecimalDigit]
>        HexEscapeSequence
>        UnicodeEscapeSequence
>  
> CharacterEscapeSequence ::
>        SingleEscapeCharacter
>        NonEscapeCharacter
>  
> SingleEscapeCharacter :: one of
>     ' " \ b f n r t v    
> 		
> NonEscapeCharacter ::
>     SourceCharacter but not one of EscapeCharacter or LineTerminator
> 
> EscapeCharacter ::
>        SingleEscapeCharacter
>        DecimalDigit
>        x
>        u
> 
> HexEscapeSequence ::
>     x HexDigit HexDigit
> 
> UnicodeEscapeSequence ::
>        u Hex4Digits
>        u{ CodePoint }
> 
> CodePoint ::
>     HexDigits but only if MV of HexDigits ≤ 0x10FFFF
> 
> Hex4Digits ::
>        HexDigit HexDigit HexDigit HexDigit
>     
> LineTerminator ::
>        <LF>
>        <CR>
>        <LS>
>        <PS>
> 
> LineTerminatorSequence ::
>        <LF>
>        <CR>[lookahead ≠ <LF>]
>        <LS>
>        <PS>
>        <CR><LF>
> ```

### Line Terminator Code Points

| **Code Point** | **Unicode Name**     | **Abbreviation** |
| -------------- | -------------------- | ---------------- |
| **U+000A**     | LINE FEED (LF)       | ```<LF>```       |
| **U+000D**     | CARRIAGE RETURN (CR) | ```<CR>```       |
| **U+2028**     | LINE SEPARATOR       | ```<LS>```       |
| **U+2029**     | PARAGRAPH SEPARATOR  | ```<PS>```       |

![](https://raw.githubusercontent.com/ngstyle/Frontend-01-Template/master/week02/String%20Literals.png)

```
  /"(?:[^"\n\\\r\u2028\u2029]|\\(?:['"\\bfnrtv\n\r\u2028\u2029]|\r\n)|\\x[0-9a-fA-F]{2}|\\u[0-9a-fA-F]{4}|\\u\{(10|1)[0-9a-fA-F]{4}}|\\[^0-9ux'"\\bfnrtv\n\\\r\u2028\u2029])*"/

```

