
import $ from 'jquery';

 $.fn.giphy = function() {
   var items = [];
   var itemIndex = 0;
   var $gif = null;
   var $controls = null;
   var preloaded = [];

   function preload(items) {
     items.forEach( ( item, index ) => {
       preloaded[ index ] = new Image();
       preloaded[ index ].src = item.images["downsized"].url
     } );
   }

   function navigate( difference ) {
     if ( difference < 0 ) {
       if ( itemIndex >= 1 ) { itemIndex--; }
     } else if ( difference > 0 ) {
       if ( itemIndex < items.length - 1 ) { itemIndex++; }
     }
     $gif.attr("src", items[itemIndex].images["downsized"].url);
     $controls.attr("data-count", (itemIndex + 1) + " of " + items.length);
     $gif.blur();
   }

   return this.each(function() {
     const $input = $(this);
     const $giphy = $input.wrap("<div class='Giphy'></div>").closest(".Giphy");
     const $search = $("<div class='Giphy-toggle'>Search</div>").appendTo($giphy);
     $controls = $("<div class='Giphy-controls' tabindex='0'><span class='Giphy-prev'></span><span class='Giphy-next'></span></div>").hide().appendTo($giphy);
     const $prev = $controls.find(".Giphy-prev");
     const $next = $controls.find(".Giphy-next");

     $prev.on("click", () => navigate(-1));
     $next.on("click", () => navigate(+1));

     $input.on("keypress", function(e) {
       if (e.which === 13) {
          $controls.hide();
          if ($gif && $gif.remove) {
           $gif.remove();
          }
          $giphy.removeClass("Giphy--search");

         $.ajax({
           url: "http://api.giphy.com/v1/gifs/search",
           data: {
             q: this.value,
             api_key: "dc6zaTOxFJmzC",
             rating: "g"
           }
         }).then(response => {
           items = (response && response.data) || [];
           const item = items && items.length ? items[0] : {};
           $gif = $("<img />", {
             src: item.images["downsized"].url
           });

           preload(items);

           $giphy.addClass("Giphy--search");
           $(".upload").removeClass("hidden");
           $controls.show();
           $gif.appendTo($giphy);
           $controls.attr("data-count", (itemIndex + 1) + " of " + items.length);
         });
       }
     });
   });
 };

export default $;
