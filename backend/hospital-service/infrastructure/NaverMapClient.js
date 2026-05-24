class NaverMapClient {
  constructor({
    clientId = process.env.NAVER_MAP_CLIENT_ID,
    clientSecret = process.env.NAVER_MAP_CLIENT_SECRET,
    searchClientId = process.env.NAVER_SEARCH_CLIENT_ID || process.env.NAVER_CLIENT_ID,
    searchClientSecret = process.env.NAVER_SEARCH_CLIENT_SECRET || process.env.NAVER_CLIENT_SECRET,
  } = {}) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.searchClientId = searchClientId;
    this.searchClientSecret = searchClientSecret;
  }

  get enabled() {
    return Boolean(this.clientId && this.clientSecret);
  }

  get searchEnabled() {
    return Boolean(this.searchClientId && this.searchClientSecret);
  }

  async reverseGeocode(latitude, longitude) {
    if (!this.enabled) {
      return null;
    }

    const url = new URL(
      "https://maps.apigw.ntruss.com/map-reversegeocode/v2/gc",
    );
    url.searchParams.set("coords", `${longitude},${latitude}`);
    url.searchParams.set("sourcecrs", "epsg:4326");
    url.searchParams.set("orders", "roadaddr,addr");
    url.searchParams.set("output", "json");

    const response = await fetch(url, {
      headers: {
        "X-NCP-APIGW-API-KEY-ID": this.clientId,
        "X-NCP-APIGW-API-KEY": this.clientSecret,
      },
    });

    if (!response.ok) {
      throw new Error(`Naver Reverse Geocoding failed: ${response.status}`);
    }

    const data = await response.json();
    const result = data.results?.[0];
    if (!result) {
      return null;
    }

    return {
      address: this.formatAddress(result),
      region1: result.region?.area1?.name || "",
      region2: result.region?.area2?.name || "",
      region3: result.region?.area3?.name || "",
      source: "naver",
    };
  }

  formatAddress(result) {
    const region = result.region || {};
    const areaNames = [
      region.area1?.name,
      region.area2?.name,
      region.area3?.name,
      region.area4?.name,
    ].filter(Boolean);

    if (result.name === "roadaddr" && result.land?.name) {
      const number = [
        result.land.number1,
        result.land.number2,
      ].filter(Boolean).join("-");
      return [...areaNames.slice(0, 2), result.land.name, number]
        .filter(Boolean)
        .join(" ");
    }

    return areaNames.join(" ");
  }

  async searchLocalHospitals({ address, keyword = "피부과", display = 5 } = {}) {
    if (!this.searchEnabled || !address) {
      return [];
    }

    const url = new URL("https://openapi.naver.com/v1/search/local.json");
    url.searchParams.set("query", `${address} ${keyword}`.trim());
    url.searchParams.set("display", String(Math.min(Math.max(display, 1), 5)));
    url.searchParams.set("start", "1");
    url.searchParams.set("sort", "comment");

    const response = await fetch(url, {
      headers: {
        "X-Naver-Client-Id": this.searchClientId,
        "X-Naver-Client-Secret": this.searchClientSecret,
      },
    });

    if (!response.ok) {
      throw new Error(`Naver Local Search failed: ${response.status}`);
    }

    const data = await response.json();
    return (data.items || [])
      .filter((item) => this.isHospitalResult(item))
      .map((item) => this.toHospital(item))
      .filter(Boolean);
  }

  isHospitalResult(item) {
    const category = this.stripHtml(item.category || "");
    const title = this.stripHtml(item.title || "");
    return /병원|의원|피부과/.test(`${category} ${title}`);
  }

  toHospital(item) {
    const longitude = this.parseCoordinate(item.mapx, "longitude");
    const latitude = this.parseCoordinate(item.mapy, "latitude");
    if (!this.isValidCoordinate(latitude, longitude)) {
      return null;
    }

    return {
      name: this.stripHtml(item.title || ""),
      address: item.roadAddress || item.address || "",
      phone: item.telephone || null,
      latitude,
      longitude,
      rating: null,
      open_hours: null,
      specialties: this.stripHtml(item.category || "") || null,
    };
  }

  parseCoordinate(value, type) {
    const coordinate = Number(value);
    if (!Number.isFinite(coordinate)) {
      return null;
    }
    const normalized =
      Math.abs(coordinate) > 1000 ? coordinate / 10000000 : coordinate;
    const rounded = Number(normalized.toFixed(7));

    if (type === "latitude" && (rounded < 30 || rounded > 45)) {
      return null;
    }
    if (type === "longitude" && (rounded < 120 || rounded > 135)) {
      return null;
    }
    return rounded;
  }

  isValidCoordinate(latitude, longitude) {
    return latitude !== null && longitude !== null;
  }

  stripHtml(value) {
    return String(value).replace(/<[^>]*>/g, "").trim();
  }
}

module.exports = NaverMapClient;
