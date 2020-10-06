const defaultExcludePatterns = [".*[Tt]ilsyn.*"];

exports.excludeIgnored = function (events, ignored) {
  const ignorePatterns = ignored || defaultExcludePatterns;
  return new Promise((resolve) => {
    const result = events.filter((x) => {
      if (ignorePatterns.length === 0) {
        return true;
      }
      const title = x.title || "";

      let shouldInclude = true;

      ignorePatterns.forEach((pattern) => {
        const matches = title.match(pattern) || [];
        if (matches.length > 0) {
          shouldInclude = false;
        }
      });

      return shouldInclude;
    });
    resolve(result);
  });
};
