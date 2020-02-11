/**
 * Product Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Product template.
 *
 * @namespace product
 */

import $ from 'jquery';
import Variants from '@shopify/theme-variants';
import {formatMoney} from '@shopify/theme-currency';
import {register} from '@shopify/theme-sections';

const selectors = {
  addToCart: '[data-add-to-cart]',
  addToCartText: '[data-add-to-cart-text]',
  comparePrice: '[data-compare-price]',
  comparePriceText: '[data-compare-text]',
  originalSelectorId: '[data-product-select]',
  priceWrapper: '[data-price-wrapper]',
  productImageWrapper: '[data-product-image-wrapper]',
  productFeaturedImage: '[data-product-featured-image]',
  productJson: '[data-product-json]',
  productPrice: '[data-product-price]',
  productThumbs: '[data-product-single-thumbnail]',
  singleOptionSelector: '[data-single-option-selector]',
};

const cssClasses = {
  activeThumbnail: 'active-thumbnail',
  hide: 'hide',
};

const keyboardKeys = {
  ENTER: 13,
};

/**
 * Product section constructor. Runs on page load as well as Theme Editor
 * `section:load` events.
 * @param {string} container - selector for the section container DOM element
 */


register('product', {
  onLoad() {
    this.$container = $(this.container);
    this.namespace = `.${this.id}`;

    // Stop parsing if we don't have the product json script tag when loading
    // section in the Theme Editor
    if (!$(selectors.productJson, this.$container).html()) {
      return;
    }

    this.productSingleObject = JSON.parse(
      $(selectors.productJson, this.$container).html(),
    );

    const options = {
      $container: this.$container,
      enableHistoryState: this.$container.data('enable-history-state') || false,
      singleOptionSelector: selectors.singleOptionSelector,
      originalSelectorId: selectors.originalSelectorId,
      product: this.productSingleObject,
    };

    this.settings = {};
    this.variants = new Variants(options);
    this.$featuredImage = $(selectors.productFeaturedImage, this.$container);

    this.$container.on(
      `variantChange${this.namespace}`,
      this.updateAddToCartState.bind(this),
    );
    this.$container.on(
      `variantPriceChange${this.namespace}`,
      this.updateProductPrices.bind(this),
    );

    if (this.$featuredImage.length > 0) {
      this.$container.on(
        `variantImageChange${this.namespace}`,
        this.updateImages.bind(this),
      );
    }

    this.initImageSwitch();
  },

  initImageSwitch() {
    const $productThumbs = $(selectors.productThumbs, this.$container);

    if (!$productThumbs.length) {
      return;
    }

    $productThumbs
      .on('click', (evt) => {
        evt.preventDefault();
        const imageId = $(evt.currentTarget).data('thumbnail-id');
        this.switchImage(imageId);
        this.setActiveThumbnail(imageId);
      })
      .on('keyup', this.handleImageFocus.bind(this));
  },

  handleImageFocus(evt) {
    if (evt.keyCode !== keyboardKeys.ENTER) {
      return;
    }

    this.$featuredImage.filter(':visible').focus();
  },

  setActiveThumbnail(imageId) {
    let newImageId = imageId;

    // If "imageId" is not defined in the function parameter, find it by the current product image
    if (typeof newImageId === 'undefined') {
      newImageId = $(
        `${selectors.productImageWrapper}:not('.${cssClasses.hide}')`,
      ).data('image-id');
    }

    const $thumbnail = $(
      `${selectors.productThumbs}[data-thumbnail-id='${newImageId}']`,
    );

    $(selectors.productThumbs)
      .removeClass(cssClasses.activeThumbnail)
      .removeAttr('aria-current');

    $thumbnail.addClass(cssClasses.activeThumbnail);
    $thumbnail.attr('aria-current', true);
  },

  switchImage(imageId) {
    const $newImage = $(
      `${selectors.productImageWrapper}[data-image-id='${imageId}']`,
      this.$container,
    );
    const $otherImages = $(
      `${selectors.productImageWrapper}:not([data-image-id='${imageId}'])`,
      this.$container,
    );
    $newImage.removeClass(cssClasses.hide);
    $otherImages.addClass(cssClasses.hide);
  },

  /**
   * Updates the DOM state of the add to cart button
   *
   * @param {boolean} enabled - Decides whether cart is enabled or disabled
   * @param {string} text - Updates the text notification content of the cart
   */
  updateAddToCartState(evt) {
    const variant = evt.variant;

    if (variant) {
      $(selectors.priceWrapper, this.$container).removeClass(cssClasses.hide);
    } else {
      $(selectors.addToCart, this.$container).prop('disabled', true);
      $(selectors.addToCartText, this.$container).html(
        theme.strings.unavailable,
      );
      $(selectors.priceWrapper, this.$container).addClass(cssClasses.hide);
      return;
    }

    if (variant.available) {
      $(selectors.addToCart, this.$container).prop('disabled', false);
      $(selectors.addToCartText, this.$container).html(theme.strings.addToCart);
    } else {
      $(selectors.addToCart, this.$container).prop('disabled', true);
      $(selectors.addToCartText, this.$container).html(theme.strings.soldOut);
    }
  },

  updateImages(evt) {
    const variant = evt.variant;
    const imageId = variant.featured_image.id;

    this.switchImage(imageId);
    this.setActiveThumbnail(imageId);
  },

  /**
   * Updates the DOM with specified prices
   *
   * @param {string} productPrice - The current price of the product
   * @param {string} comparePrice - The original price of the product
   */
  updateProductPrices(evt) {
    const variant = evt.variant;
    const $comparePrice = $(selectors.comparePrice, this.$container);
    const $compareEls = $comparePrice.add(
      selectors.comparePriceText,
      this.$container,
    );

    $(selectors.productPrice, this.$container).html(
      formatMoney(variant.price, theme.moneyFormat),
    );

    if (variant.compare_at_price > variant.price) {
      $comparePrice.html(
        formatMoney(variant.compare_at_price, theme.moneyFormat),
      );
      $compareEls.removeClass(cssClasses.hide);
    } else {
      $comparePrice.html('');
      $compareEls.addClass(cssClasses.hide);
    }
  },

  /**
   * Event callback for Theme Editor `section:unload` event
   */
  onUnload() {
    this.$container.off(this.namespace);
  },
});


// own slider 

const imgsOfproduct = document.querySelectorAll('.slider img');
const dotsOfImages = document.querySelectorAll('.dots ul li a');

// console.log(imgsOfproduct[0]);
// console.log(dotsOfImages);


if (imgsOfproduct.length >= 1) {
  
  imgsOfproduct[0].classList.remove("hide");

  dotsOfImages.forEach( (el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
  
      const id = el.getAttribute('data-thumbnail-id');
  
      imgsOfproduct.forEach( (el) => {el.classList.add('hide')} );
      imgsOfproduct.forEach( (el) => {
        if (el.getAttribute('data-id') === id){
          el.classList.remove('hide');
        };
      });
  
    }, true);
  });
}


(function (root, factory) {
  'use strict';
  if(typeof define === 'function' && define.amd) {
      define(['jquery'], function($){
          factory($);
      });
  } else if(typeof module === 'object' && module.exports) {
      module.exports = (root.EasyZoom = factory(require('jquery')));
  } else {
      root.EasyZoom = factory(root.jQuery);
  }
}(this, function ($) {

  'use strict';

  var zoomImgOverlapX;
  var zoomImgOverlapY;
  var ratioX;
  var ratioY;
  var pointerPositionX;
  var pointerPositionY;

  var defaults = {

      // The text to display within the notice box while loading the zoom image.
      loadingNotice: 'Loading image',

      // The text to display within the notice box if an error occurs when loading the zoom image.
      errorNotice: 'The image could not be loaded',

      // The time (in milliseconds) to display the error notice.
      errorDuration: 2500,

      // Attribute to retrieve the zoom image URL from.
      linkAttribute: 'href',

      // Prevent clicks on the zoom image link.
      preventClicks: true,

      // Callback function to execute before the flyout is displayed.
      beforeShow: $.noop,

      // Callback function to execute before the flyout is removed.
      beforeHide: $.noop,

      // Callback function to execute when the flyout is displayed.
      onShow: $.noop,

      // Callback function to execute when the flyout is removed.
      onHide: $.noop,

      // Callback function to execute when the cursor is moved while over the image.
      onMove: $.noop

  };

  /**
   * EasyZoom
   * @constructor
   * @param {Object} target
   * @param {Object} options (Optional)
   */
  function EasyZoom(target, options) {
      this.$target = $(target);
      this.opts = $.extend({}, defaults, options, this.$target.data());

      this.isOpen === undefined && this._init();
  }

  /**
   * Init
   * @private
   */
  EasyZoom.prototype._init = function() {
      this.$link   = this.$target.find('a');
      this.$image  = this.$target.find('img');

      this.$flyout = $('<div class="easyzoom-flyout" />');
      this.$notice = $('<div class="easyzoom-notice" />');

      this.$target.on({
          'mousemove.easyzoom touchmove.easyzoom': $.proxy(this._onMove, this),
          'mouseleave.easyzoom touchend.easyzoom': $.proxy(this._onLeave, this),
          'mouseenter.easyzoom touchstart.easyzoom': $.proxy(this._onEnter, this)
      });

      this.opts.preventClicks && this.$target.on('click.easyzoom', function(e) {
          e.preventDefault();
      });
  };

  /**
   * Show
   * @param {MouseEvent|TouchEvent} e
   * @param {Boolean} testMouseOver (Optional)
   */
  EasyZoom.prototype.show = function(e, testMouseOver) {
      var self = this;

      if (this.opts.beforeShow.call(this) === false) return;

      if (!this.isReady) {
          return this._loadImage(this.$link.attr(this.opts.linkAttribute), function() {
              if (self.isMouseOver || !testMouseOver) {
                  self.show(e);
              }
          });
      }

      this.$target.append(this.$flyout);

      var targetWidth = this.$target.outerWidth();
      var targetHeight = this.$target.outerHeight();

      var flyoutInnerWidth = this.$flyout.width();
      var flyoutInnerHeight = this.$flyout.height();

      var zoomImgWidth = this.$zoom.width();
      var zoomImgHeight = this.$zoom.height();

      zoomImgOverlapX = zoomImgWidth - flyoutInnerWidth;
      zoomImgOverlapY = zoomImgHeight - flyoutInnerHeight;

      // For when the zoom image is smaller than the flyout element.
      if (zoomImgOverlapX < 0) zoomImgOverlapX = 0;
      if (zoomImgOverlapY < 0) zoomImgOverlapY = 0;

      ratioX = zoomImgOverlapX / targetWidth;
      ratioY = zoomImgOverlapY / targetHeight;

      this.isOpen = true;

      this.opts.onShow.call(this);

      e && this._move(e);
  };

  /**
   * On enter
   * @private
   * @param {Event} e
   */
  EasyZoom.prototype._onEnter = function(e) {
      var touches = e.originalEvent.touches;

      this.isMouseOver = true;

      if (!touches || touches.length == 1) {
          e.preventDefault();
          this.show(e, true);
      }
  };

  /**
   * On move
   * @private
   * @param {Event} e
   */
  EasyZoom.prototype._onMove = function(e) {
      if (!this.isOpen) return;

      e.preventDefault();
      this._move(e);
  };

  /**
   * On leave
   * @private
   */
  EasyZoom.prototype._onLeave = function() {
      this.isMouseOver = false;
      this.isOpen && this.hide();
  };

  /**
   * On load
   * @private
   * @param {Event} e
   */
  EasyZoom.prototype._onLoad = function(e) {
      // IE may fire a load event even on error so test the image dimensions
      if (!e.currentTarget.width) return;

      this.isReady = true;

      this.$notice.detach();
      this.$flyout.html(this.$zoom);
      this.$target.removeClass('is-loading').addClass('is-ready');

      e.data.call && e.data();
  };

  /**
   * On error
   * @private
   */
  EasyZoom.prototype._onError = function() {
      var self = this;

      this.$notice.text(this.opts.errorNotice);
      this.$target.removeClass('is-loading').addClass('is-error');

      this.detachNotice = setTimeout(function() {
          self.$notice.detach();
          self.detachNotice = null;
      }, this.opts.errorDuration);
  };

  /**
   * Load image
   * @private
   * @param {String} href
   * @param {Function} callback
   */
  EasyZoom.prototype._loadImage = function(href, callback) {
      var zoom = new Image();

      this.$target
          .addClass('is-loading')
          .append(this.$notice.text(this.opts.loadingNotice));

      this.$zoom = $(zoom)
          .on('error', $.proxy(this._onError, this))
          .on('load', callback, $.proxy(this._onLoad, this));

      zoom.style.position = 'absolute';
      zoom.src = href;
  };

  /**
   * Move
   * @private
   * @param {Event} e
   */
  EasyZoom.prototype._move = function(e) {

      if (e.type.indexOf('touch') === 0) {
          var touchlist = e.touches || e.originalEvent.touches;
          pointerPositionX = touchlist[0].pageX;
          pointerPositionY = touchlist[0].pageY;
      } else {
          pointerPositionX = e.pageX || pointerPositionX;
          pointerPositionY = e.pageY || pointerPositionY;
      }

      var targetOffset  = this.$target.offset();
      var relativePositionX = pointerPositionY - targetOffset.top;
      var relativePositionY = pointerPositionX - targetOffset.left;
      var moveX = Math.ceil(relativePositionX * ratioY);
      var moveY = Math.ceil(relativePositionY * ratioX);

      // Close if outside
      if (moveY < 0 || moveX < 0 || moveY > zoomImgOverlapX || moveX > zoomImgOverlapY) {
          this.hide();
      } else {
          var top = moveX * -1;
          var left = moveY * -1;

          this.$zoom.css({
              top: top,
              left: left
          });

          this.opts.onMove.call(this, top, left);
      }

  };

  /**
   * Hide
   */
  EasyZoom.prototype.hide = function() {
      if (!this.isOpen) return;
      if (this.opts.beforeHide.call(this) === false) return;

      this.$flyout.detach();
      this.isOpen = false;

      this.opts.onHide.call(this);
  };

  /**
   * Swap
   * @param {String} standardSrc
   * @param {String} zoomHref
   * @param {String|Array} srcset (Optional)
   */
  EasyZoom.prototype.swap = function(standardSrc, zoomHref, srcset) {
      this.hide();
      this.isReady = false;

      this.detachNotice && clearTimeout(this.detachNotice);

      this.$notice.parent().length && this.$notice.detach();

      this.$target.removeClass('is-loading is-ready is-error');

      this.$image.attr({
          src: standardSrc,
          srcset: $.isArray(srcset) ? srcset.join() : srcset
      });

      this.$link.attr(this.opts.linkAttribute, zoomHref);
  };

  /**
   * Teardown
   */
  EasyZoom.prototype.teardown = function() {
      this.hide();

      this.$target
          .off('.easyzoom')
          .removeClass('is-loading is-ready is-error');

      this.detachNotice && clearTimeout(this.detachNotice);

      delete this.$link;
      delete this.$zoom;
      delete this.$image;
      delete this.$notice;
      delete this.$flyout;

      delete this.isOpen;
      delete this.isReady;
  };

  // jQuery plugin wrapper
  $.fn.easyZoom = function(options) {
      return this.each(function() {
          var api = $.data(this, 'easyZoom');

          if (!api) {
              $.data(this, 'easyZoom', new EasyZoom(this, options));
          } else if (api.isOpen === undefined) {
              api._init();
          }
      });
  };

  return EasyZoom;
}));


// Instantiate EasyZoom instances
// var $easyzoom = $('.easyzoom').easyZoom();
// // Setup thumbnails example
// var api1 = $easyzoom.filter('.easyzoom--with-thumbnails').data('easyZoom');
// $('.thumbnails').on('click', 'a', function(e) {
//   var $this = $(this);
//   e.preventDefault();
//   // Use EasyZoom's `swap` method
//   api1.swap($this.data('standard'), $this.attr('href'));
// });
// Setup toggles example
// var api2 = $easyzoom.filter('.easyzoom--with-toggle').data('easyZoom');
// $('.toggle').on('click', function() {
//   var $this = $(this);
//   if ($this.data("active") === true) {
//     $this.text("Switch on").data("active", false);
//     api2.teardown();
//   } else {
//     $this.text("Switch off").data("active", true);
//     api2._init();
//   }
// });
