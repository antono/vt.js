# VT100 Implemented in pure JS

HTML5 backend is work in progress.
[Clutter](http://clutter-project.org) backend planned.

## Documentation

- [vt100.net](http://vt100.net/)
- [A parser for DEC’s ANSI-compatible video terminals](http://vt100.net/emu/dec_ansi_parser)

## Testing

We use [jasmine](https://jasmine.github.io/) and [should.js](http://github.com/visionmedia/should.js) for testing.

    git submodule update --init
    make test

For vt100 compatability use `vttest`

    sudo apt-get install vttest && vttest

