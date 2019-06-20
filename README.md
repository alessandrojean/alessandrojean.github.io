# alessandrojean.github.io

Files to my personal blog.

The theme is based on the Gilles Castel's [website].

[website]: https://castel.dev/

## Running local

To compile the assets and run Jekyll on local you
need to follow those steps:

- Install last version of [NodeJS];
- Open `_config.yml` and change:

  ```yml
  baseurl: ""
  url: ""
  ```
- Run above commands:

  ```bash
  # Install dependencies.
  $ yarn
  # Install gulp v4 global.
  $ yarn global add gulp
  # Run with hot reloading.
  $ gulp
  ```

[NodeJS]: https://nodejs.org/

## License

> You can check out the full license [here](LICENSE).

This repository is licensed under the terms of the **MIT** license.
