
import $ from 'jquery';
import jQueryBridget from 'jquery-bridget';
import Masonry from 'masonry-layout';
jQueryBridget( 'masonry', Masonry, $ );

// import './fireworks';

const socket = io('');
// const refreshInterval = 1800000; // 30 minutes

// setTimeout(() => {
//   location.reload();
// }, refreshInterval);

const $grid = $('.grid');
// const stampElem = grid.querySelector('.stamp');
$grid.masonry({
  // options
  itemSelector: '.grid-item',
  columnWidth: '.grid-sizer',
  percentPosition: true,
  // gutter: 10
}).masonry('layout');

// let msnry = new Masonry( grid, {
//   itemSelector: '.grid-item',
//   columnWidth: '.grid-sizer',
//   percentPosition: true,
//   gutter: 10
// });
// msnry.stamp( stampElem );
// msnry.layout();

$(window).on('load', function() {
  $grid.masonry('layout');
});

socket.on('new contribution', data => {
  console.log(data);
  const $element = $(`
    <div class="grid-item">
      <img src="${data.url}"/>
    </div>`
  );
  console.log(data, $element);
  $grid
    .append($element)
    .masonry('appended', $element)
    .masonry('layout');
});

// socket.on('disconnect', () => {
//   location.reload();
// });

setInterval(function() {
  // console.log($(document).height(), $('.grid').height());
  if ($(document).height() - 5 <= $('.grid').height()) {
    $('.grid-item')
      .addClass('grid-item-small')
      .removeClass('grid-item');

    $('.grid-sizer')
      .addClass('grid-sizer-small')
      .removeClass('grid-sizer');

    $grid.masonry({
      itemSelector: '.grid-item-small',
      columnWidth: '.grid-sizer-small',
      percentPosition: true,
      // gutter: 10
    }).masonry('layout');
  }
}, 3000);

// setInterval(function() {
// }, 2000);

// ----------------------------------------------------

socket.on('new fireworks', data => {
  // console.log(data);

  const $el = $(`
    <div class="fireworks" style="top:${data.y}%; left: ${data.x}%">
      <span>${data.emoji}</span> <span>${data.emoji}</span> <span>${data.emoji}</span> <span>${data.emoji}</span>
      <span>${data.emoji}</span> <span>${data.emoji}</span> <span>${data.emoji}</span> <span>${data.emoji}</span>
    </div>
  `).appendTo('body');

  setTimeout(() => {
    $el.remove();
  }, 1000);
});
