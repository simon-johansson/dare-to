
import $ from 'jquery';
import jQueryBridget from 'jquery-bridget';
import Masonry from 'masonry-layout';
jQueryBridget( 'masonry', Masonry, $ );

const socket = io('');
const $grid = $('.grid');
var gridSize = 2;

const gridIsFull = () => $(document).height() - 10 <= $grid.height();
const setGrid = () => {
  $grid.masonry({
    itemSelector: '.grid-item-' + gridSize,
    columnWidth: '.grid-sizer-' + gridSize,
    percentPosition: true,
  }).masonry('layout');
};

setGrid();

$(window).on('load', function() {
  $grid.masonry('layout');
});

setInterval(function() {
  if (gridSize < 10 && gridIsFull()) {
    gridSize += 1;

    $('.grid-item')
      .removeClass((index, className) => (className.match (/(^|\s)grid-item-\S+/g) || []).join(' '))
      .addClass('grid-item-' + gridSize);

    $('.grid-sizer')
      .removeClass((index, className) => (className.match (/(^|\s)grid-sizer-\S+/g) || []).join(' '))
      .addClass('grid-sizer-' + gridSize);

    setGrid();
  }
}, 1000);

socket.on('new contribution', data => {
  const $element = $(`
    <div class="grid-item grid-item-${gridSize}">
      <img src="${data.url}"/>
    </div>`
  );

  $grid
    .append($element)
    .masonry('appended', $element)
    .masonry('layout');
});

socket.on('new text contribution', data => {
  const $element = $(`
    <div class="grid-item grid-item-${gridSize}">
      <span class="${data.className}">${data.text}</span>
    </div>`
  );

  $grid
    .append($element)
    .masonry('appended', $element)
    .masonry('layout');
});

socket.on('new fireworks', data => {
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
