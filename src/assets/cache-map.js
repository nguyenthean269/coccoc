L.TileLayer.GoogleMapCache = L.TileLayer.extend({
	s3_domain: 'https://d13dxp8d6go1v2.cloudfront.net',
	cache_server: 'localhost:8080',
	type_map: 'street', // street, label, statellite
	
	initialize: function (s3_domain, cache_server, type_map) {
		this.s3_domain = s3_domain;
		this.cache_server = cache_server;
		var url =  s3_domain + '/data/google_map_data/' + type_map + '/{z}/{x}/{y}';
		L.TileLayer.prototype.initialize.call(this, url, {
			maxZoom: 22
		});
	},
    _tileOnError: function (done, tile, e) {
		var cache_url = tile.src.replace(this.s3_domain + '/data/google_map_data', this.cache_server + '/v2/google-map/cache');
		if (cache_url) {
			console.log(cache_url)
			tile.src = cache_url;
		}
		done(e, tile);
	},
	// stops loading all tiles in the background layer
	_abortLoading: function () {
		// console.log("_abortLoading");
		var i, tile;
		for (i in this._tiles) {
			if (this._tiles[i].coords.z !== this._tileZoom) {
				tile = this._tiles[i].el;

				tile.onload = L.Util.falseFn;
				tile.onerror = L.Util.falseFn;

				if (!tile.complete) {
					L.DomUtil.remove(tile);
					delete this._tiles[i];
				}
			}
		}
	},

	_removeTile: function (key) {
		var tile = this._tiles[key];
		if (!tile) { return; }

		// Cancels any pending http requests associated with the tile
		// unless we're on Android's stock browser,
		// see https://github.com/Leaflet/Leaflet/issues/137
		// if (!androidStock) {
			// console.log("_removeTile");
			// tile.el.setAttribute('src', emptyImageUrl);
		// }

		return L.GridLayer.prototype._removeTile.call(this, key);
	},
});

L.gridLayer.googlemapcache = function (s3_domain, cache_server, type_map) {
	return new L.TileLayer.GoogleMapCache(s3_domain, cache_server, type_map);
};