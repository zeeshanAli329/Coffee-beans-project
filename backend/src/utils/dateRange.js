const { timezone } = require('../config/env');
const ApiError = require('./ApiError');

function partsOf(date, tz) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    }).formatToParts(date).map((x) => [x.type, x.value])
  );
  return { y: +p.year, m: +p.month, d: +p.day, h: +p.hour, mi: +p.minute, s: +p.second };
}
function offsetMs(date, tz) {
  const p = partsOf(date, tz);
  return Date.UTC(p.y, p.m - 1, p.d, p.h, p.mi, p.s) - Math.floor(date.getTime() / 1000) * 1000;
}
// Midnight (start of day) in the shop's timezone. Day/month overflow is normalised by Date.UTC.
function zonedMidnight(y, m, d, tz) {
  const guess = Date.UTC(y, m - 1, d);
  return new Date(guess - offsetMs(new Date(guess), tz));
}

const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

function resolveRange(q = {}, tz = timezone) {
  const t = partsOf(new Date(), tz);
  const mid = (y, m, d) => zonedMidnight(y, m, d, tz);
  const range = q.range || 'last30';
  let start, end;
  switch (range) {
    case 'today': start = mid(t.y, t.m, t.d); end = mid(t.y, t.m, t.d + 1); break;
    case 'yesterday': start = mid(t.y, t.m, t.d - 1); end = mid(t.y, t.m, t.d); break;
    case 'last7': start = mid(t.y, t.m, t.d - 6); end = mid(t.y, t.m, t.d + 1); break;
    case 'last30': start = mid(t.y, t.m, t.d - 29); end = mid(t.y, t.m, t.d + 1); break;
    case 'thisMonth': start = mid(t.y, t.m, 1); end = mid(t.y, t.m + 1, 1); break;
    case 'lastMonth': start = mid(t.y, t.m - 1, 1); end = mid(t.y, t.m, 1); break;
    case 'thisYear': start = mid(t.y, 1, 1); end = mid(t.y + 1, 1, 1); break;
    case 'custom': {
      const f = DATE_RE.exec(q.from || '');
      const e = DATE_RE.exec(q.to || '');
      if (!f || !e) throw new ApiError(400, 'Custom range needs "from" and "to" dates (YYYY-MM-DD).');
      start = mid(+f[1], +f[2], +f[3]);
      end = mid(+e[1], +e[2], +e[3] + 1);
      if (end <= start) throw new ApiError(400, 'The end date must be after the start date.');
      break;
    }
    default: throw new ApiError(400, 'Unknown date range.');
  }
  return { start, end, range, timezone: tz };
}

// Fill days with no orders so charts show a continuous axis.
function fillDays(series, { start, end, timezone: tz }, empty) {
  const map = new Map(series.map((s) => [s.label, s]));
  const t = partsOf(new Date(), tz);
  const limit = Math.min(end.getTime(), zonedMidnight(t.y, t.m, t.d + 1, tz).getTime());
  const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' });
  const s = partsOf(start, tz);
  const out = [];
  for (let i = 0; i < 400; i++) {
    const cur = zonedMidnight(s.y, s.m, s.d + i, tz);
    if (cur.getTime() >= limit) break;
    const label = fmt.format(cur);
    out.push(map.get(label) || { label, ...empty });
  }
  return out;
}

module.exports = { resolveRange, fillDays, zonedMidnight, partsOf };
