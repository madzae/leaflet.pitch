(function () {
  L.Map.include({
    _pitchEnable: function (options) {
      if (this._pitchEnabled) return;
      this._pitchEnabled = true;
      options = options || {};
      var container = this.getContainer();
      var parent = container.parentNode;

      // Save original container styles before we touch anything
      this._pitchOriginalStyles = {
        position:        container.style.position,
        width:           container.style.width,
        height:          container.style.height,
        left:            container.style.left,
        top:             container.style.top,
        transformOrigin: container.style.transformOrigin,
        transition:      container.style.transition,
        transform:       container.style.transform,
        overflow:        parent.style.overflow
      };

      var wrapper = document.createElement('div');
      wrapper.className = 'leaflet-pitch-wrapper';
      wrapper.style.position = 'relative';
      wrapper.style.width = '100%';
      wrapper.style.height = '100%';
      wrapper.style.overflow = 'hidden';
      wrapper.style.perspective = (options.perspective || 1000) + 'px';
      wrapper.style.perspectiveOrigin = options.perspectiveOrigin || '50% 30%';
      wrapper.style.background = options.background || '#e8e6e1';
      parent.insertBefore(wrapper, container);
      wrapper.appendChild(container);

      var overscan = options.overscan != null ? options.overscan : 0.4;
      var size = (1 + overscan * 2) * 100;
      var offset = -overscan * 100;
      container.style.position        = 'absolute';
      container.style.width           = size + '%';
      container.style.height          = size + '%';
      container.style.left            = offset + '%';
      container.style.top             = offset + '%';
      container.style.transformOrigin = '50% 50%';
      container.style.transition      = options.transition || 'transform 0.15s ease-out';

      this._pitchWrapper = wrapper;
      this._pitch = 0;

      var keepBuffer = options.keepBuffer != null ? options.keepBuffer : 6;
      this.eachLayer(function (layer) {
        if (layer.options && 'keepBuffer' in layer.options) {
          layer.options.keepBuffer = Math.max(layer.options.keepBuffer, keepBuffer);
        }
      });

      var self = this;
      this.whenReady(function () { self.invalidateSize(false); });
    },

    setPitch: function (deg, options) {
      this._pitchEnable(options);
      deg = Math.max(0, Math.min(85, deg));
      this._pitch = deg;
      this.getContainer().style.transform = 'rotateX(' + deg + 'deg)';
      this.fire('pitch', { pitch: deg });
      return this;
    },

    getPitch: function () {
      return this._pitch || 0;
    },

    removePitch: function () {
      if (!this._pitchEnabled) return;
      var container  = this.getContainer();
      var wrapper    = this._pitchWrapper;
      var mapParent  = wrapper.parentNode;
      var orig       = this._pitchOriginalStyles || {};

      // Lock overflow on parent before any DOM changes
      mapParent.style.overflow = 'hidden';

      // Restore container to exact state before _pitchEnable ran
      container.style.transform       = orig.transform       || '';
      container.style.transition      = orig.transition      || '';
      container.style.position        = orig.position        || '';
      container.style.width           = orig.width           || '';
      container.style.height          = orig.height          || '';
      container.style.left            = orig.left            || '';
      container.style.top             = orig.top             || '';
      container.style.transformOrigin = orig.transformOrigin || '';

      // Move container back, destroy wrapper
      mapParent.insertBefore(container, wrapper);
      mapParent.removeChild(wrapper);

      this._pitchWrapper        = null;
      this._pitchEnabled        = false;
      this._pitchOriginalStyles = null;
      this._pitch               = 0;

      var self = this;
      setTimeout(function () {
        // Restore parent overflow to what it was originally
        mapParent.style.overflow = orig.overflow || '';
        self.invalidateSize(false);
      }, 50);
    }
  });
})();
