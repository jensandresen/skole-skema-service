const mocha = require("mocha");
const { assert } = require("chai");

const sut = require("../events-utils");

describe("events-utils", async function () {
  describe("exclude ignored", async function () {
    it("returns expected when empty event list is passed", async function () {
      const result = await sut.excludeIgnored([]);
      assert.isEmpty(result);
    });

    it("returns expected events when ignore list is empty", async function () {
      const expected = [
        {
          id: 1,
          title: "foo",
        },
      ];
      const result = await sut.excludeIgnored(expected, []);
      assert.deepEqual(result, expected);
    });

    it("returns expected events when ignore list contains a non-targeting pattern", async function () {
      const expected = [
        {
          id: 1,
          title: "foo",
        },
      ];
      const result = await sut.excludeIgnored(expected, ["dummy"]);
      assert.deepEqual(result, expected);
    });

    it("returns expected events when event list contains single event and ignore list contains a targeting full-match pattern", async function () {
      const stubEvents = [
        {
          id: 1,
          title: "foo",
        },
      ];
      const result = await sut.excludeIgnored(stubEvents, ["foo"]);
      assert.deepEqual(result, []);
    });

    it("returns expected events when event list contains multiple events and ignore list contains a single targeting full-match pattern", async function () {
      const expected = [
        {
          id: 1,
          title: "foo",
        },
      ];
      const stubEvents = [
        ...expected,
        {
          id: 2,
          title: "bar",
        },
      ];
      const result = await sut.excludeIgnored(stubEvents, ["bar"]);
      assert.deepEqual(result, expected);
    });

    it("returns expected events when event list contains single event and ignore list contains a targeting end-match pattern", async function () {
      const stubEvents = [
        {
          id: 1,
          title: "foo",
        },
      ];
      const result = await sut.excludeIgnored(stubEvents, ["o$"]);
      assert.deepEqual(result, []);
    });
  });
});
