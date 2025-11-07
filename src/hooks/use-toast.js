let count = 0;
const TOAST_REMOVE_DELAY = 4000;
const toastTimeouts = new Map();
const listeners = [];
let memoryState = { toasts: [] };

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return String(count);
}

function notify() {
  listeners.forEach((l) => {
    try {
      l(memoryState);
    } catch (_) {}
  });
}

function addToRemoveQueue(id) {
  if (toastTimeouts.has(id)) return;
  const t = setTimeout(() => {
    toastTimeouts.delete(id);
    removeToast(id);
  }, TOAST_REMOVE_DELAY);
  toastTimeouts.set(id, t);
}

export function toast({ title, description, variant = "default" }) {
  const id = genId();
  const newToast = {
    id,
    title,
    description,
    variant,
    createdAt: Date.now(),
  };
  memoryState = { toasts: [newToast, ...memoryState.toasts] };
  notify();
  addToRemoveQueue(id);
  return {
    id,
    dismiss: () => removeToast(id),
  };
}

export function removeToast(id) {
  if (!id) {
    memoryState = { toasts: [] };
  } else {
    memoryState = { toasts: memoryState.toasts.filter((t) => t.id !== id) };
  }
  const timeout = toastTimeouts.get(id);
  if (timeout) {
    clearTimeout(timeout);
    toastTimeouts.delete(id);
  }
  notify();
}

export function useToast() {
  const [state, setState] = require("react").useState(memoryState);

  require("react").useEffect(() => {
    listeners.push(setState);
    // sync initial
    setState(memoryState);
    return () => {
      const idx = listeners.indexOf(setState);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }, []);

  return {
    toasts: state.toasts,
    toast,
    dismiss: removeToast,
  };
}
