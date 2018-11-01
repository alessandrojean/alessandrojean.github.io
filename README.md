# Personal Blog

Files to my personal blog available at https://alessandrojean.github.io/

The theme is initially based on the [willianjusten/cards-jekyll-template]
and [thiagorossener/jekflix-template]. The actual version is based
on the [Rasmus Andersson] website, redone with SASS.

[willianjusten/cards-jekyll-template]: https://github.com/willianjusten/cards-jekyll-template
[thiagorossener/jekflix-template]: https://github.com/thiagorossener/jekflix-template
[Rasmus Andersson]: https://rsms.me/

## Running local

To compile the assets and run Jekyll on local you
need to follow those steps:

- Install last version of [NodeJS];
- Open `_config.yml` and change:

  ```
  baseurl: ""
  url: ""
  ```
- Run above commands:

  ```bash
  # Install dependencies.
  npm install
  # Install gulp v4 global.
  npm install -g gulp@next gulp-cli
  # Run with hot reloading.
  gulp
  ```

[NodeJS]: https://nodejs.org/

## License

    The MIT License (MIT)

    Copyright (c) 2018 Alessandro Jean

    Permission is hereby granted, free of charge, to any person obtaining a copy of
    this software and associated documentation files (the "Software"), to deal in
    the Software without restriction, including without limitation the rights to
    use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
    the Software, and to permit persons to whom the Software is furnished to do so,
    subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
    FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
    COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
    IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.