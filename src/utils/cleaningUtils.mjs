export const cleanData = (text) => {
  if (!text) {
    return "";
  }
  return text.split("(")[0].trim();
};

export const cleanPercent = (text) => {
  if (!text) {
    return "";
  }
  return text.replace("%", "").trim();
};

export const cleanMetricTons = (text) => {
  if (!text) {
    return "";
  }
  return text.replace("metric tons", "").trim();
};

export const removeCommas = (text) => {
  if (!text) {
    return "";
  }
  return text.replace(/,/g, "");
};

export const removeDollars = (text) => {
  if (!text) {
    return "";
  }
  return text.replace(/\$/g, "");
}

export const parseNumber = (str) => {
  if (!str) return "";
  if (str === "") return "";

  let [num, unit] = str.split(" ");

  num = parseFloat(num);

  switch (unit?.toLowerCase()) {
    case "trillion":
      num *= 1e12;
      break;
    case "billion":
      num *= 1e9;
      break;
    case "million":
      num *= 1e6;
      break;
    case "thousand":
      num *= 1e3;
      break;
    default:

    // add more cases if needed
  }

  if (isNaN(num)) {
    return "";
  }

  return num;
};
