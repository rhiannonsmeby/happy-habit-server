{
    /** 
    * ESLint: http://eslint.org/docs/user-guide/configuring
    */

    // "env:" supplies predefined global variables
    "env": {
        "browser": true,
        "es6": true,
        "node": true,
        "mocha": true,
        "mongo": true
    },
    // our configuration extends the recommended base configuration
    "extends": "eslint:recommended",
    // define the type of file `script` or `module` for ES6 Modules
    "parserOptions": {
        "sourceType": "script"
    },
    //ESLint rules: Severity Levels: off = 0 | warn = 1 | error = 2
    // "rules": {
    //     "strict": ["error", "safe"],   //prefer `'use-strict';` pragma
    //     "eqeqeq":"error",              //prefer strict equality `===`
    //     "no-console": "warn",          //allows but warn about console like `console.log()`
    //     "no-unused-vars": "warn",      //warns about unused variables
    //     "no-eval": "error",            //disallows `eval()` usage
    //     "indent": ["error", 2],        //enforce 2 space indents (not tabs)        
    //     "quotes": ["error", "single"], //prefer single quotes over double quotes
    //     "semi": ["error", "always"]    //enforce semi-colon usage
    // },

    "globals": {
        "supertest": true,
        "expect": true
    }
}
