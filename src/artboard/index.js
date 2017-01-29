
import $ from 'jquery';
import Masonry from 'masonry-layout';

const socket = io('');
// const refreshInterval = 1800000; // 30 minutes

socket.on('new contribution', data => {
  console.log(data);
});

socket.on('disconnect', () => {
  location.reload();
});

// setTimeout(() => {
//   location.reload();
// }, refreshInterval);

const grid = document.querySelector('.grid');
const stampElem = grid.querySelector('.stamp');
let msnry = new Masonry( grid, {
  // options
  itemSelector: '.grid-item',
  columnWidth: '.grid-sizer',
  percentPosition: true,
  gutter: 10
});
msnry.stamp( stampElem );
msnry.layout();

$(window).on('load', function() {
  msnry.layout();
});

setInterval(function() {
  if ($(document).height() <= $('.grid').height()) {
    $('.grid-item')
      .addClass('grid-item-small')
      .removeClass('grid-item');

    $('.grid-sizer')
      .addClass('grid-sizer-small')
      .removeClass('grid-sizer');

    msnry = new Masonry( grid, {
      // options
      itemSelector: '.grid-item-small',
      columnWidth: '.grid-sizer-small',
      percentPosition: true,
      gutter: 10
    });

    msnry.layout();
  }
}, 3000);

// setInterval(function() {
// }, 2000);
