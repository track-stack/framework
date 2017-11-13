[![CircleCI](https://circleci.com/gh/track-stack/framework.svg?style=svg)](https://circleci.com/gh/track-stack/framework)
[![npm version](https://badge.fury.io/js/trackstack.svg)](https://badge.fury.io/js/trackstack)
# Framework

Shared code between web and mobile

### Development
```bash
$ webpack --watch --colors --progress
```

### Publishing
```bash
$ bin/publish
```

### Trouble shooting

Make sure the code compiles:
```bash
$ uglifyjs index.js
```

https://webpack.js.org/configuration/output/  
https://github.com/webpack/webpack/issues/2030  
https://stackoverflow.com/questions/40188578/webpack-babel-couldnt-find-preset-es2015-relative-to-directory  
https://github.com/mishoo/UglifyJS  
http://ccoenraets.github.io/es6-tutorial/setup-webpack/ 

**TypeScript**  
https://stackoverflow.com/questions/31173738/typescript-getting-error-ts2304-cannot-find-name-require
https://github.com/s-panferov/awesome-typescript-loader/issues/404
https://stackoverflow.com/questions/43595555/webpack-cant-resolve-typescript-modules
