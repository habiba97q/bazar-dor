const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

export function toBengaliNumber(number) {
  if (number === null || number === undefined || isNaN(number)) {
    return "০";
  }
  const str = number.toString();
  return str.replace(/[0-9]/g, (digit) => bengaliDigits[parseInt(digit, 10)]);
}

export function fromBengaliNumber(str) {
  if (!str) return 0;
  const englishStr = str.toString().replace(/[০-৯]/g, (digit) =>
    bengaliDigits.indexOf(digit).toString()
  );
  const num = parseFloat(englishStr);
  return isNaN(num) ? 0 : num;
}

export function formatPrice(num) {
  if (num === null || num === undefined || isNaN(num)) return "০ টাকা";
  // Check if decimal
  const isDecimal = num % 1 !== 0;
  const formatted = isDecimal ? num.toFixed(2) : Math.round(num).toString();
  // Add commas
  const parts = formatted.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const result = parts.join(".");
  return `${toBengaliNumber(result)} টাকা`;
}

export function formatUnit(unit) {
  if (!unit) return "প্রতি কেজি";
  const lower = unit.toLowerCase();
  if (lower === "kg" || lower === "কেজি") return "প্রতি কেজি";
  if (lower === "litre" || lower === "liter" || lower === "লিটার") return "প্রতি লিটার";
  if (lower === "dozen" || lower === "ডজন") return "প্রতি ডজন";
  if (lower === "piece" || lower === "পিস" || lower === "টি") return "প্রতি পিস";
  if (lower === "gm" || lower === "gram" || lower === "গ্রাম") return "প্রতি গ্রাম";
  return `প্রতি ${unit}`;
}

export function getBengaliDate(inputDate = new Date()) {
  const bengaliDays = [
    "রবিবার",
    "সোমবার",
    "মঙ্গলবার",
    "বুধবার",
    "বৃহস্পতিবার",
    "শুক্রবার",
    "শনিবার",
  ];

  const bengaliMonths = [
    "জানুয়ারি",
    "ফেব্রুয়ারি",
    "মার্চ",
    "এপ্রিল",
    "মে",
    "জুন",
    "জুলাই",
    "আগস্ট",
    "সেপ্টেম্বর",
    "অক্টোবর",
    "নভেম্বর",
    "ডিসেম্বর",
  ];

  const date = new Date(inputDate);
  const dayName = bengaliDays[date.getDay()];
  const day = toBengaliNumber(date.getDate());
  const monthName = bengaliMonths[date.getMonth()];
  const year = toBengaliNumber(date.getFullYear());

  return `${dayName}, ${day} ${monthName}, ${year}`;
}
