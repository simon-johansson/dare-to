
import $ from 'jquery';
const socket = io('');
// import $ from './jquery';


var preventPullToRefresh = (function preventPullToRefresh(lastTouchY) {
  lastTouchY = lastTouchY || 0;
  var maybePrevent = false;

  function setTouchStartPoint(event) {
    lastTouchY = event.touches[0].clientY;
    // console.log('[setTouchStartPoint]TouchPoint is ' + lastTouchY);
  }
  function isScrollingUp(event) {
    var touchY = event.touches[0].clientY,
        touchYDelta = touchY - lastTouchY;

    // console.log('[isScrollingUp]touchYDelta: ' + touchYDelta);
    lastTouchY = touchY;

    // if touchYDelta is positive -> scroll up
    if(touchYDelta > 0){
      return true;
    }else{
      return false;
    }
  }

  return {
    // set touch start point and check whether here is offset top 0
    touchstartHandler: function(event) {
      if(event.touches.length != 1) return;
      setTouchStartPoint(event);
      maybePrevent = window.pageYOffset === 0;
      // console.log('[touchstartHandler]' + maybePrevent);
    },
    // reset maybePrevent frag and do prevent
    touchmoveHandler: function(event) {
      if(maybePrevent) {
        maybePrevent = false;
        if(isScrollingUp(event)) {
          // console.log('======Done preventDefault!======');
          event.preventDefault();
          return;
        }
      }
    }
  }
})();

// usage
$(document).ready(function() {
  document.addEventListener('touchstart', preventPullToRefresh.touchstartHandler);
  document.addEventListener('touchmove', preventPullToRefresh.touchmoveHandler);

  // Main screen
  const $mainScreen = $('.main-screen');
  const $goToGif = $mainScreen.find('.go-to-gif');
  const $goToText = $mainScreen.find('.go-to-text');
  const $goToEmoji = $mainScreen.find('.go-to-emoji');

  // Emoji screen
  let emoji = '';
  const $partyModeScreen = $('.party-mode');
  const $emojiPicker = $partyModeScreen.find('.emoji-picker');
  const $emojis = $emojiPicker.find('.emoji');
  const $touchArea = $partyModeScreen.find('.touch-area');

  // Gif screen
  const $uploadGifScreen = $('.upload-gif');

  // Text screen
  const $uploadTextScreen = $('.upload-text');

  $goToGif.on('click', () => {
    $mainScreen.addClass('hidden');
    $uploadGifScreen.removeClass('hidden');
    $('.gif-input').focus();
  });
  $goToText.on('click', () => {
    $mainScreen.addClass('hidden');
    $uploadTextScreen.removeClass('hidden');
  });
  $goToEmoji.on('click', () => {
    $mainScreen.addClass('hidden');
    $partyModeScreen.removeClass('hidden');
  });

  $emojis.on('click', function() {
    emoji = $(this).text();
    $emojiPicker.addClass('hidden');
    $touchArea
      .removeClass('hidden')
      .find('p span')
        .text(emoji);
  });

  $touchArea.on('click', function(event) {
    const payload = {
      y: Math.floor((event.clientY / window.innerHeight) * 100),
      x: Math.floor((event.clientX / window.innerWidth) * 100),
      emoji: emoji,
    };

    socket.emit('fireworks', payload);
  });

  $partyModeScreen.find('.back').on('click', function() {
    $partyModeScreen.addClass('hidden');
    $emojiPicker.removeClass('hidden');
    $touchArea.addClass('hidden');

    $mainScreen.removeClass('hidden');
  });

  $uploadTextScreen.find('.back').on('click', function() {
    $uploadTextScreen.addClass('hidden');
    $mainScreen.removeClass('hidden');
  });

  (function() {
    var items = [];
    var itemIndex = 0;
    var $gif = null;
    var $controls = null;
    var preloaded = [];

    function preload(items) {
      items.forEach((item, index) => {
        preloaded[index] = new Image();
        preloaded[index].src = item.images["downsized"].url
      });
    }

    function navigate(difference) {
      if (difference < 0) {
        if (itemIndex >= 1) { itemIndex--; }
      } else if (difference > 0) {
        if (itemIndex < items.length - 1) { itemIndex++; }
      }
      $gif.attr("src", items[itemIndex].images["downsized"].url);
      $controls.attr("data-count", (itemIndex + 1) + " of " + items.length);
      $gif.blur();
    }

    const $input = $('input');
    const $giphy = $input.wrap("<div class='Giphy'></div>").closest(".Giphy");
    const $search = $(`
      <div class='Giphy-search'>
        <span class="iosIcon"></span>
        Search
      </div>
      `).appendTo($giphy);
    $controls = $(`
      <div class='Giphy-controls' tabindex='0'>
      <span class='Giphy-prev iosIcon'></span>
      <span class='Giphy-next iosIcon'></span>
      </div>`).hide().appendTo($giphy);
    const $prev = $controls.find(".Giphy-prev");
    const $next = $controls.find(".Giphy-next");
    const $send = $('.send');
    const $back = $('.back');
    const $sorry = $('.sorry');
    const $sentOverlay = $('.sent');
    const onReset = () => {
      $controls.hide();
      if ($gif && $gif.remove) {
        $gif.remove();
      }
      $send.addClass("hidden");
      $giphy.removeClass("Giphy--search");
      $sorry.addClass('hidden');
      $('input').blur();
    };
    const onSearch = () => {
      $search.off('click');
      onReset();
      $.ajax({
        method: "POST",
        url: "/gif",
        data: {
          q: $input.val(),
          api_key: "dc6zaTOxFJmzC",
          rating: "g"
        }
      }).then(response => {
        $search.on('click', onSearch);
        const res = JSON.parse(response);
        items = (res && res.data) || [];
        const item = items && items.length ? items[0] : {};
        if (item.images) {
          $gif = $("<img />", {
            src: item.images["downsized"].url
          });

          preload(items);

          itemIndex = 0;
          $giphy.addClass("Giphy--search");
          $send.removeClass("hidden");
          $controls.show();
          $gif.appendTo($giphy);
          $controls.attr("data-count", (itemIndex + 1) + " of " + items.length);
        } else {
          $sorry.removeClass('hidden');
        }
      });
    };

    $input.on('click', function() { $(this).focus(); });

    $prev.on("click", () => navigate(-1));
    $next.on("click", () => navigate(+1));

    $search.on('click', onSearch);
    $input.on("keypress", function(e) {
      if (e.which === 13) {
        onSearch();
      }
    });

    $send.on('click', function() {
      const payload = {
        url: items[itemIndex].images["downsized"].url
      };
      socket.emit('contribution', payload, (data) => {
        $sentOverlay.removeClass('hidden');
        // $back.removeClass('hidden');
        onReset();
      });
    });

    $back.on('click', function() {
      // $back.addClass('hidden');
      $sentOverlay.addClass('hidden');
      $('.gif-input').val('');
      onReset();

      $uploadGifScreen.addClass('hidden');
      $mainScreen.removeClass('hidden');
    });
  })();
});
