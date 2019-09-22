const Ajv = require("ajv");
const schema = require("../schema/event.json");
const basicTypesSchema = require("../schema/basic-types.json");
const rulesTypesSchema = require("../schema/rules-types.json");
const imageTypesSchema = require("../schema/image-types.json");

const createValidateFunc = () => {
  const ajv = new Ajv({ allErrors: true });
  ajv.addSchema(basicTypesSchema);
  ajv.addSchema(rulesTypesSchema);
  ajv.addSchema(imageTypesSchema);
  return ajv.compile(schema);
};

const buildExhibitionDetails = (customizations = {}) => ({
  dateFrom: "2018-01-10",
  dateTo: "2018-02-20",
  useVenueOpeningTimes: true,
  hasTimedEntry: true,
  ...customizations
});

const buildPerformanceDetails = (customizations = {}) => ({
  isWorkshop: false,
  ...customizations
});

const buildPerformance = (customizations = {}) => ({
  date: "2019-01-18",
  time: "19:30",
  isSoldOut: false,
  isCancelled: false,
  ...customizations
});

const buildExhibitionEvent = (customizations = {}) => ({
  venueId: "venue-id",
  venueEntityId: "venue-entity-id",
  version: 999,
  entityStatus: "Publishable",
  eventType: "Exhibition",
  url: "http://test.com",
  title: "The Title",
  ageDetails: {
    minAge: 0,
    maxAge: 99
  },
  costDetails: {
    type: "Unknown"
  },
  bookingDetails: {
    type: "Unknown"
  },
  exhibitionDetails: buildExhibitionDetails(),
  currentWatchedContent: "the watched content",
  ...customizations
});

const buildPerformanceEvent = (customizations = {}) => ({
  venueId: "venue-id",
  venueEntityId: "venue-entity-id",
  version: 999,
  entityStatus: "Publishable",
  eventType: "Performance",
  url: "http://test.com",
  title: "The Title",
  ageDetails: {
    minAge: 0,
    maxAge: 99
  },
  costDetails: {
    type: "Unknown"
  },
  bookingDetails: {
    type: "Unknown"
  },
  performanceDetails: buildPerformanceDetails(),
  currentWatchedContent: "the watched content",
  ...customizations
});

it("should be a valid schema", () => {
  createValidateFunc();
});

const VALID_EXHIBITIONS = {
  valid: buildExhibitionEvent(),
  "with encoded character in venue entity id": buildExhibitionEvent({
    venueEntityId: "exhibitions%2Fsome_event"
  }),
  "with summary": buildExhibitionEvent({
    summary: {
      mimeType: "text/plain",
      value: "The summary"
    }
  }),
  "unknown cost": buildExhibitionEvent({ costDetails: { type: "Unknown" } }),
  free: buildExhibitionEvent({ costDetails: { type: "Free" } }),
  "paid with unknown cost": buildExhibitionEvent({
    costDetails: { type: "Paid" }
  }),
  "paid with cost": buildExhibitionEvent({
    costDetails: { type: "Paid", minCost: 1000, maxCost: 2000 }
  }),
  "unknown booking": buildExhibitionEvent({
    bookingDetails: { type: "Unknown" }
  }),
  "booking not required": buildExhibitionEvent({
    bookingDetails: { type: "NotRequired" }
  }),
  "booking required": buildExhibitionEvent({
    bookingDetails: { type: "Required" }
  }),
  "booking required and booking is not open": buildExhibitionEvent({
    bookingDetails: { type: "Required", openForBooking: false }
  }),
  "booking required and booking is open": buildExhibitionEvent({
    bookingDetails: { type: "Required", openForBooking: true }
  }),
  "booking required and booking opens on a date": buildExhibitionEvent({
    bookingDetails: {
      type: "Required",
      openForBooking: false,
      dateBookingOpens: "2018-01-18"
    }
  }),
  "with images": buildExhibitionEvent({
    images: [{ id: "11111111222222223333333344444444", ratio: 1 }]
  }),
  "with dominantColor prop on images": buildExhibitionEvent({
    images: [
      {
        id: "11111111222222223333333344444444",
        ratio: 1,
        dominantColor: "FF00FF"
      }
    ]
  }),
  "with tags": buildExhibitionEvent({
    tags: [{ id: "audience/families", label: "families" }]
  }),
  "has day opening rule": buildExhibitionEvent({
    exhibitionDetails: buildExhibitionDetails({
      useVenueOpeningTimes: false,
      openingRules: [
        {
          type: "Day",
          dateForType: "Monday",
          timeFrom: "12:00",
          timeTo: "18:00"
        }
      ]
    })
  }),
  "has day closure opening rule with times": buildExhibitionEvent({
    exhibitionDetails: buildExhibitionDetails({
      useVenueOpeningTimes: false,
      openingRules: [
        {
          type: "Day",
          dateForType: "Monday",
          timeFrom: "12:00",
          timeTo: "18:00"
        }
      ],
      closingRules: [
        {
          type: "Day",
          dateForType: "Tuesday",
          timeFrom: "12:00",
          timeTo: "18:00"
        }
      ]
    })
  }),
  "has day closure opening rule without times": buildExhibitionEvent({
    exhibitionDetails: buildExhibitionDetails({
      useVenueOpeningTimes: false,
      openingRules: [
        {
          type: "Day",
          dateForType: "Monday",
          timeFrom: "12:00",
          timeTo: "18:00"
        }
      ],
      closingRules: [
        {
          type: "Day",
          dateForType: "Tuesday"
        }
      ]
    })
  }),
  "has date opening rule": buildExhibitionEvent({
    exhibitionDetails: buildExhibitionDetails({
      useVenueOpeningTimes: false,
      openingRules: [
        {
          type: "Date",
          dateForType: "2019-10-22",
          timeFrom: "12:00",
          timeTo: "18:00"
        }
      ]
    })
  }),
  "has date closure rule with times": buildExhibitionEvent({
    exhibitionDetails: buildExhibitionDetails({
      useVenueOpeningTimes: false,
      openingRules: [
        {
          type: "Date",
          dateForType: "2019-10-22",
          timeFrom: "12:00",
          timeTo: "18:00"
        }
      ],
      closingRules: [
        {
          type: "Date",
          dateForType: "2019-10-23",
          timeFrom: "12:00",
          timeTo: "18:00"
        }
      ]
    })
  }),
  "has date closure rule without times": buildExhibitionEvent({
    exhibitionDetails: buildExhibitionDetails({
      useVenueOpeningTimes: false,
      openingRules: [
        {
          type: "Date",
          dateForType: "2019-10-22",
          timeFrom: "12:00",
          timeTo: "18:00"
        }
      ],
      closingRules: [
        {
          type: "Date",
          dateForType: "2019-10-23"
        }
      ]
    })
  }),
  "has preset opening rule": buildExhibitionEvent({
    exhibitionDetails: buildExhibitionDetails({
      useVenueOpeningTimes: false,
      openingRules: [
        {
          type: "Preset",
          dateForType: "ChristmasEve",
          timeFrom: "12:00",
          timeTo: "18:00"
        }
      ]
    })
  }),
  "has preset closure rule with times": buildExhibitionEvent({
    exhibitionDetails: buildExhibitionDetails({
      useVenueOpeningTimes: false,
      openingRules: [
        {
          type: "Day",
          dateForType: "Monday",
          timeFrom: "12:00",
          timeTo: "18:00"
        }
      ],
      closingRules: [
        {
          type: "Preset",
          dateForType: "ChristmasEve",
          timeFrom: "12:00",
          timeTo: "18:00"
        }
      ]
    })
  }),
  "has preset closure rule without times": buildExhibitionEvent({
    exhibitionDetails: buildExhibitionDetails({
      useVenueOpeningTimes: false,
      openingRules: [
        {
          type: "Day",
          dateForType: "Monday",
          timeFrom: "12:00",
          timeTo: "18:00"
        }
      ],
      closingRules: [
        {
          type: "Preset",
          dateForType: "ChristmasEve"
        }
      ]
    })
  }),
  "with published watched content": buildExhibitionEvent({
    publishedWatchedContent: "Published watched content"
  })
};

const VALID_PERFORMANCES = {
  valid: buildPerformanceEvent(),
  "with summary": buildPerformanceEvent({
    summary: {
      mimeType: "text/plain",
      value: "The summary"
    }
  }),
  "unknown cost": buildPerformanceEvent({ costDetails: { type: "Unknown" } }),
  free: buildPerformanceEvent({ costDetails: { type: "Free" } }),
  "paid with unknown cost": buildPerformanceEvent({
    costDetails: { type: "Paid" }
  }),
  "paid with cost": buildPerformanceEvent({
    costDetails: { type: "Paid", minCost: 1000, maxCost: 2000 }
  }),
  "unknown booking": buildPerformanceEvent({
    bookingDetails: { type: "Unknown" }
  }),
  "booking not required": buildPerformanceEvent({
    bookingDetails: { type: "NotRequired" }
  }),
  "booking required": buildPerformanceEvent({
    bookingDetails: { type: "Required" }
  }),
  "booking required and booking is not open": buildPerformanceEvent({
    bookingDetails: { type: "Required", openForBooking: false }
  }),
  "booking required and booking is open": buildPerformanceEvent({
    bookingDetails: { type: "Required", openForBooking: true }
  }),
  "booking required and booking opens on a date": buildPerformanceEvent({
    bookingDetails: {
      type: "Required",
      openForBooking: false,
      dateBookingOpens: "2018-01-18"
    }
  }),
  "with images": buildPerformanceEvent({
    images: [{ id: "11111111222222223333333344444444", ratio: 1 }]
  }),
  "with tags": buildPerformanceEvent({
    tags: [{ id: "audience/families", label: "families" }]
  }),
  "has performances": buildPerformanceEvent({
    performanceDetails: buildPerformanceDetails({
      performances: [buildPerformance()]
    })
  })
};

describe("valid exhibitions", () => {
  Object.keys(VALID_EXHIBITIONS).forEach(key => {
    it(`should validate ${key}`, () => {
      const entity = VALID_EXHIBITIONS[key];
      const validate = createValidateFunc();
      const valid = validate(entity);
      expect(valid).toBeTruthy();
    });
  });
});

describe("valid performances", () => {
  Object.keys(VALID_PERFORMANCES).forEach(key => {
    it(`should validate ${key}`, () => {
      const entity = VALID_PERFORMANCES[key];
      const validate = createValidateFunc();
      const valid = validate(entity);
      expect(valid).toBeTruthy();
    });
  });
});

const INVALID_EXHIBITIONS = {
  "no venue ID": buildExhibitionEvent({ venueId: null }),
  "empty venue ID": buildExhibitionEvent({ venueId: "" }),
  "invalid venue ID": buildExhibitionEvent({ venueId: "has/slash" }),
  "no venue entity ID": buildExhibitionEvent({ venueEntityId: undefined }),
  "empty venue entity ID": buildExhibitionEvent({ venueEntityId: "" }),
  "invalid venue entity ID": buildExhibitionEvent({
    venueEntityId: "has/slash"
  }),
  "no entity status": buildExhibitionEvent({ entityStatus: undefined }),
  "empty entity status": buildExhibitionEvent({ entityStatus: "" }),
  "invalid entity status": buildExhibitionEvent({ entityStatus: "Invalid" }),
  "no current watched content": buildExhibitionEvent({
    currentWatchedContent: undefined
  }),
  "empty current watched content": buildExhibitionEvent({
    currentWatchedContent: ""
  }),
  "invalid event type": buildExhibitionEvent({ eventType: "Invalid" }),
  "no url": buildExhibitionEvent({ url: undefined }),
  "empty url value": buildExhibitionEvent({ url: "" }),
  "wrong url value": buildExhibitionEvent({ url: "venue" }),
  "no title": buildExhibitionEvent({ title: undefined }),
  "empty title value": buildExhibitionEvent({ title: "" }),
  "empty summary": buildExhibitionEvent({ summary: {} }),
  "empty summary type": buildExhibitionEvent({
    summary: {
      mimeType: "",
      value: "The summary"
    }
  }),
  "invalid summary type": buildExhibitionEvent({
    summary: {
      mimeType: "Invalid",
      value: "The summary"
    }
  }),
  "empty summary value": buildExhibitionEvent({
    summary: {
      mimeType: "text/plain",
      value: ""
    }
  }),
  "no age details": buildExhibitionEvent({ ageDetails: undefined }),
  "partial age details": buildExhibitionEvent({ ageDetails: { minAge: 10 } }),
  "invalid age details": buildExhibitionEvent({
    ageDetails: { minAge: -10, maxAge: 300 }
  }),
  "no cost details": buildExhibitionEvent({ costDetails: undefined }),
  "invalid cost details type": buildExhibitionEvent({
    costDetails: { type: "Invalid" }
  }),
  "paid with invalid costs": buildExhibitionEvent({
    costDetails: { type: "Paid", minCost: -10, maxCost: 100000 }
  }),
  "no booking details": buildExhibitionEvent({ bookingDetails: undefined }),
  "invalid booking details type": buildExhibitionEvent({
    bookingDetails: { type: "Invalid" }
  }),
  "booking required with invalid date booking opens": buildExhibitionEvent({
    bookingDetails: { type: "Required", dateBookingOpens: "invalid" }
  }),
  "booking required with invalid open for booking value": buildExhibitionEvent({
    bookingDetails: { type: "Required", openForBooking: "invalid" }
  }),
  "empty images": buildExhibitionEvent({ images: [] }),
  "invalid image id": buildExhibitionEvent({
    images: [{ id: "Invalid", ratio: 1 }]
  }),
  "missing image id": buildExhibitionEvent({
    images: [{ id: undefined, ratio: 1 }]
  }),
  "invalid image ratio": buildExhibitionEvent({
    images: [{ id: "11111111222222223333333344444444", ratio: "Invalid" }]
  }),
  "missing image ratio": buildExhibitionEvent({
    images: [{ id: "11111111222222223333333344444444", ratio: undefined }]
  }),
  "empty tags": buildExhibitionEvent({ tags: [] }),
  "invalid tag id": buildExhibitionEvent({
    tags: [{ id: "invalid", label: "families" }]
  }),
  "invalid tag label": buildExhibitionEvent({
    tags: [{ id: "audience/families", label: "" }]
  }),
  "invalid tag": buildExhibitionEvent({
    tags: [{}]
  }),
  "missing exhibition details": buildExhibitionEvent({
    exhibitionDetails: undefined
  }),
  "empty exhibition details": buildExhibitionEvent({
    exhibitionDetails: {}
  }),
  "missing use venue opening times flag": buildExhibitionEvent({
    exhibitionDetails: buildExhibitionDetails({
      useVenueOpeningTimes: undefined
    })
  }),
  "missing has timed entry": buildExhibitionEvent({
    exhibitionDetails: buildExhibitionDetails({ hasTimedEntry: undefined })
  }),
  "missing exhibition date from": buildExhibitionEvent({
    exhibitionDetails: buildExhibitionDetails({ dateFrom: undefined })
  }),
  "missing exhibition date to": buildExhibitionEvent({
    exhibitionDetails: buildExhibitionDetails({ dateTo: undefined })
  }),
  "opening rules incorrectly present when using venue opening times": buildExhibitionEvent(
    {
      exhibitionDetails: buildExhibitionDetails({
        useVenueOpeningTimes: true,
        openingRules: [],
        closingRules: []
      })
    }
  ),
  "opening rules not present when not using venue opening times": buildExhibitionEvent(
    {
      exhibitionDetails: buildExhibitionDetails({
        useVenueOpeningTimes: false
      })
    }
  ),
  "empty opening rules": buildExhibitionEvent({
    exhibitionDetails: buildExhibitionDetails({
      useVenueOpeningTimes: false,
      openingRules: []
    })
  }),
  "empty closing rules": buildExhibitionEvent({
    exhibitionDetails: buildExhibitionDetails({
      useVenueOpeningTimes: false,
      closingRules: []
    })
  }),
  "invalid date from": buildExhibitionEvent({
    exhibitionDetails: buildExhibitionDetails({ dateFrom: "Invalid" })
  }),
  "invalid date to": buildExhibitionEvent({
    exhibitionDetails: buildExhibitionDetails({ dateTo: "Invalid" })
  }),
  "invalid date type for day opening rule": buildExhibitionEvent({
    exhibitionDetails: buildExhibitionDetails({
      useVenueOpeningTimes: false,
      openingRules: [
        {
          type: "Day",
          dateForType: "Invalid",
          timeFrom: "12:00",
          timeTo: "18:00"
        }
      ]
    })
  }),
  "no times for day opening rule": buildExhibitionEvent({
    exhibitionDetails: buildExhibitionDetails({
      useVenueOpeningTimes: false,
      openingRules: [
        {
          type: "Day",
          dateForType: "Monday"
        }
      ]
    })
  }),
  "invalid date type for day closure rule": buildExhibitionEvent({
    exhibitionDetails: buildExhibitionDetails({
      useVenueOpeningTimes: false,
      openingRules: [
        {
          type: "Day",
          dateForType: "Monday",
          timeFrom: "12:00",
          timeTo: "18:00"
        }
      ],
      closingRules: [
        {
          type: "Day",
          dateForType: "Invalid",
          timeFrom: "12:00",
          timeTo: "18:00"
        }
      ]
    })
  }),
  "invalid date type for date opening rule": buildExhibitionEvent({
    exhibitionDetails: buildExhibitionDetails({
      useVenueOpeningTimes: false,
      openingRules: [
        {
          type: "Date",
          dateForType: "Invalid",
          timeFrom: "12:00",
          timeTo: "18:00"
        }
      ]
    })
  }),
  "no times for date opening rule": buildExhibitionEvent({
    exhibitionDetails: buildExhibitionDetails({
      useVenueOpeningTimes: false,
      openingRules: [
        {
          type: "Date",
          dateForType: "2018-01-18"
        }
      ]
    })
  }),
  "empty published watched content": buildExhibitionEvent({
    publishedWatchedContent: ""
  })
};

const INVALID_PERFORMANCES = {
  "missing isWorkshop flag": buildPerformanceEvent({
    performanceDetails: buildPerformanceDetails({ isWorkshop: undefined })
  }),
  "invalid performance date": buildPerformanceEvent({
    performanceDetails: buildPerformanceDetails({
      performances: [buildPerformance({ date: "Invalid" })]
    })
  }),
  "missing performance date": buildPerformanceEvent({
    performanceDetails: buildPerformanceDetails({
      performances: [buildPerformance({ date: undefined })]
    })
  }),
  "invalid performance time": buildPerformanceEvent({
    performanceDetails: buildPerformanceDetails({
      performances: [buildPerformance({ time: "Invalid" })]
    })
  }),
  "missing performance time": buildPerformanceEvent({
    performanceDetails: buildPerformanceDetails({
      performances: [buildPerformance({ time: undefined })]
    })
  }),
  "missing performance sold out flag": buildPerformanceEvent({
    performanceDetails: buildPerformanceDetails({
      performances: [buildPerformance({ isSoldOut: undefined })]
    })
  }),
  "missing performance cancelled flag": buildPerformanceEvent({
    performanceDetails: buildPerformanceDetails({
      performances: [buildPerformance({ isCancelled: undefined })]
    })
  })
};

describe("invalid exhibitions", () => {
  Object.keys(INVALID_EXHIBITIONS).forEach(key => {
    it(`should validate ${key}`, () => {
      const entity = INVALID_EXHIBITIONS[key];
      const validate = createValidateFunc();
      const valid = validate(entity);
      expect(valid).toBeFalsy();
    });
  });
});

describe("invalid performances", () => {
  Object.keys(INVALID_PERFORMANCES).forEach(key => {
    it(`should validate ${key}`, () => {
      const entity = INVALID_PERFORMANCES[key];
      const validate = createValidateFunc();
      const valid = validate(entity);
      expect(valid).toBeFalsy();
    });
  });
});