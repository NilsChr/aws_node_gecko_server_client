const ASSET_MANAGER = {
  assets: [],
  loadAsset: function (p, key, asset) {
    this.assets[key] = p.loadImage(asset);
  },
  getAsset: function (key) {
    return this.assets[key];
  },
};

export const ASSET_KEYS = {
  UNITS: 'units',
  GRAVEYARD: 'graveyard'
}

export default ASSET_MANAGER;
