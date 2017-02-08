
import $ from 'jquery';
import jQueryBridget from 'jquery-bridget';
import Masonry from 'masonry-layout';
import store from 'store';
jQueryBridget( 'masonry', Masonry, $ );

const socket = io('');
const $grid = $('.grid');
let gridSize = 2;

const gridIsFull = () => {
  // console.log($(window).height() - 50, $grid.height());
  return $(window).height() - 50 <= $grid.height();
};
const setGrid = () => {
  $grid.masonry({
    itemSelector: '.grid-item-' + gridSize,
    columnWidth: '.grid-sizer-' + gridSize,
    percentPosition: true,
  }).masonry('layout');
};
const gridResize = () => {
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
};
const addContribution = (data) => {
  const contributions = store.get('contributions') || [];
  store.set('contributions', [...contributions, data]);
};
const newGifContribution = (data) => {
  const $element = $(`
    <div class="grid-item grid-item-${gridSize}">
      <img src="${data.url}"/>
    </div>`
  );
  addElementToGrid($element);
};
const newTextContribution = (data) => {
  const $element = $(`
    <div class="grid-item grid-item-${gridSize}">
      <span class="${data.className}">${data.text}</span>
    </div>`
  );
  addElementToGrid($element);
};
const addElementToGrid = ($el) => {
  $grid
    .append($el)
    .masonry('appended', $el)
    .masonry('layout');

  gridResize();
};
window.log = () => {
  const contributions = store.get('contributions');
  console.log(JSON.stringify(contributions));
};

socket.on('new contribution', data => {
  addContribution(data);
  newGifContribution(data);
});

socket.on('new text contribution', data => {
  addContribution(data);
  newTextContribution(data);
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

$(window).on('keypress', function(event) {
  event.preventDefault();
  if (event.which === 100) {
    if (confirm('Delete all grid items?')) {
      store.clear();
      window.location.reload();
    }
  }
});

(function() {
  setGrid();
  const contributions = store.get('contributions') || [];
  contributions.forEach((data) => {
    if (data.text) {
      newTextContribution(data);
    } else {
      newGifContribution(data);
    }
  });
})();

$(window).on('load', function() {
  $grid.masonry('layout');

  setInterval(function() {
    gridResize();
  }, 1000);
});

