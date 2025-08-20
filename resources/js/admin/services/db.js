const NAMESPACE = 'admin';

const withNs = (key) => `${NAMESPACE}.${key}`;

const read = (key, fallback = []) => {
  try {
    const raw = localStorage.getItem(withNs(key));
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.error('DB read error', key, e);
    return fallback;
  }
};

const write = (key, value) => {
  try {
    localStorage.setItem(withNs(key), JSON.stringify(value));
  } catch (e) {
    console.error('DB write error', key, e);
  }
};

export const db = {
  getCollection(key) {
    return read(key, []);
  },
  setCollection(key, items) {
    write(key, items ?? []);
  },
  upsert(key, entity, idField = 'id') {
    const list = read(key, []);
    const idx = list.findIndex((x) => x[idField] === entity[idField]);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...entity };
    } else {
      list.push(entity);
    }
    write(key, list);
    return entity;
  },
  remove(key, id, idField = 'id') {
    const list = read(key, []);
    const next = list.filter((x) => x[idField] !== id);
    write(key, next);
    return next;
  },
  reset(keys = []) {
    for (const key of keys) {
      localStorage.removeItem(withNs(key));
    }
  }
};

export const uid = () => (crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}_${Math.random().toString(16).slice(2)}`);


