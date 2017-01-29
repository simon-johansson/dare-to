
import $ from './jquery';
const socket = io('');

// socket.emit('answers', payload, (data) => {
//   $('body').css({
//     height: '100%',
//     overflow: 'hidden',
//     width: '100%',
//     position: 'fixed'
//   });

$(document).ready(function() {
  $('input').giphy();
});
