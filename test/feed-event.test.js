const Ajv = require("ajv");
const schema = require("../schema/feed-event.json");
const basicTypesSchema = require("../schema/basic-types.json");

const createValidateFunc = () => {
  const ajv = new Ajv({ allErrors: true });
  ajv.addSchema(basicTypesSchema);
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
  entity: "event",
  venueId: "venue-id",
  venueEntityId: "venue-entity-id",
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
  rawContent: "the raw content",
  ...customizations
});

const buildPerformanceEvent = (customizations = {}) => ({
  entity: "event",
  venueId: "venue-id",
  venueEntityId: "venue-entity-id",
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
  rawContent: "the raw content",
  ...customizations
});

it("should be a valid schema", () => {
  createValidateFunc();
});

const VALID_EXHIBITIONS = {
  valid: buildExhibitionEvent(),
  "with summary": buildExhibitionEvent({ summary: "The summary" }),
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
  "booking required with no opening date": buildExhibitionEvent({
    bookingDetails: { type: "Required" }
  }),
  "booking required": buildExhibitionEvent({
    bookingDetails: { type: "Required", dateBookingOpens: "2018-01-18" }
  }),
  "with images": buildExhibitionEvent({
    images: ["https://test.com/image.png"]
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
      ],
      closureRules: []
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
      closureRules: [
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
      closureRules: [
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
      ],
      closureRules: []
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
      closureRules: [
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
      closureRules: [
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
      ],
      closureRules: []
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
      closureRules: [
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
      closureRules: [
        {
          type: "Preset",
          dateForType: "ChristmasEve"
        }
      ]
    })
  })
};

const VALID_PERFORMANCES = {
  valid: buildPerformanceEvent(),
  "with summary": buildPerformanceEvent({ summary: "The summary" }),
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
  "booking required with no opening date": buildPerformanceEvent({
    bookingDetails: { type: "Required" }
  }),
  "booking required": buildPerformanceEvent({
    bookingDetails: { type: "Required", dateBookingOpens: "2018-01-18" }
  }),
  "with images": buildPerformanceEvent({
    images: ["https://test.com/image.png"]
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
  "no entity value": buildExhibitionEvent({ entity: undefined }),
  "empty entity value": buildExhibitionEvent({ entity: "" }),
  "wrong entity value": buildExhibitionEvent({ entity: "venue" }),
  "no venue ID": buildExhibitionEvent({ venueId: null }),
  "empty venue ID": buildExhibitionEvent({ venueId: "" }),
  "no venue entity ID": buildExhibitionEvent({ venueEntityId: undefined }),
  "empty venue entity ID": buildExhibitionEvent({ venueEntityId: "" }),
  "no raw content": buildExhibitionEvent({ rawContent: undefined }),
  "empty raw content": buildExhibitionEvent({ rawContent: "" }),
  "invalid event type": buildExhibitionEvent({ eventType: "Invalid" }),
  "no url": buildExhibitionEvent({ url: undefined }),
  "empty url value": buildExhibitionEvent({ url: "" }),
  "wrong url value": buildExhibitionEvent({ url: "venue" }),
  "no title": buildExhibitionEvent({ title: undefined }),
  "empty title value": buildExhibitionEvent({ title: "" }),
  "empty summary value": buildExhibitionEvent({ summary: "" }),
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
  "empty images": buildExhibitionEvent({ images: [] }),
  "invalid image url": buildExhibitionEvent({ images: [""] }),
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
        closureRules: []
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
      openingRules: [],
      closureRules: []
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
      ],
      closureRules: []
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
      ],
      closureRules: []
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
      closureRules: [
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
      ],
      closureRules: []
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
      ],
      closureRules: []
    })
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
