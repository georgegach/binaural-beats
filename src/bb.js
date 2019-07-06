(function () {

  var Beats = (function () {

    function Beats(ctx) {
      this.input = ctx.createGain();
      this.output = ctx.createGain();
      this.createNodes(ctx);
      this.setFrequencies([80, 90]);
    }

    Beats.prototype.createNodes = function (ctx) {
      this.left = ctx.createOscillator();
      this.right = ctx.createOscillator();
      this.left.type = this.right.type = 'sine';
      this.channelMerger = ctx.createChannelMerger();
      this.compressor = ctx.createDynamicsCompressor();
      this.input.connect(this.output);
      this.channelMerger.connect(this.output);
      return this;
    };

    Beats.prototype.setFrequencies = function (v) {
      this.left.frequency.value = v[0];
      this.right.frequency.value = v[1];
      return this;
    };


    Beats.prototype.start = function () {
      this.left.start(0);
      this.right.start(0);
      this.left.connect(this.channelMerger, 0, 0);
      this.right.connect(this.channelMerger, 0, 1);
      return this;
    };

    Beats.prototype.stop = function () {
      this.left.disconnect();
      this.right.disconnect();
      return this;
    };

    Beats.prototype.connect = function (d) {
      return this.output.connect(d.input ? d.input : d);
    };

    Beats.prototype.disconnect = function () {
      return this.output.disconnect();
    };

    return Beats;

  })();

  if (typeof define === 'function' && define.amd) {
    define(function () {
      return Beats;
    });
  } else {
    if (typeof window === "object" && typeof window.document === "object") {
      window.Beats = Beats;
    }
  }

}).call(this);
