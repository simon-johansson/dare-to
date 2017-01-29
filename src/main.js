
import FastClick from 'fastclick';
FastClick.attach(document.body);

require('scss/main.scss');

if (window.location.pathname.indexOf('artboard') !== -1) {
    require('./artboard');
} else {
    require('./mobile');
}
