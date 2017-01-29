
import $ from './jquery';
const socket = io('');

$(document).ready(function() {
  $('input')
    .giphy(socket)
    .focus();
});
