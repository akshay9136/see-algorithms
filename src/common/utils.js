import { Points } from './graph';
import { showToast } from '../components/toast';
import $ from 'jquery';

const mouseEvents = ['click', 'mousedown', 'mouseup', 'mousemove', 'mouseenter', 'mouseleave'];
const touchEvents = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];

function cursorOffset(e, { left, top }) {
    const out = { x: 0, y: 0 };
    if (touchEvents.includes(e.type)) {
        const { touches, changedTouches } = e.originalEvent;
        const touch = touches[0] || changedTouches[0];
        out.x = touch.pageX - left;
        out.y = touch.pageY - top;
    } else if (mouseEvents.includes(e.type)) {
        out.x = e.pageX - left;
        out.y = e.pageY - top;
    }
    out.x = Math.round(out.x);
    out.y = Math.round(out.y);
    return out;
}

function svgElement(tag, attrs, text) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    Object.entries(attrs).forEach(([key, value]) => {
        el.setAttribute(key, value);
    });
    if (text) el.textContent = text;
    return el;
}

function costInput(p, q, cost) {
    if (!cost) {
        const distance = Points.distance(p, q);
        const baseCost = distance / 20;
        // Generate random cost between 50% and 200% of base cost
        const random = 0.5 + Math.random() * 1.5;
        cost = Math.floor(baseCost * random).toString();
    }
    const parent = svgElement('foreignObject', {
        width: 32,
        height: 24,
        x: (p.x + q.x) / 2,
        y: (p.y + q.y) / 2,
    });
    const input = document.createElement('input');
    input.value = cost;
    input.maxLength = 3;
    input.className = 'cost';

    const handler = (e) => {
        e.stopPropagation();
        input.focus();
    };
    input.addEventListener('click', handler);
    input.addEventListener('touchend', handler);
    parent.append(input);
    return parent;
}

function findCurve(p, q) {
    let mx = (p.x + q.x) / 2;
    let my = (p.y + q.y) / 2;
    let dx = p.x - q.x;
    let dy = p.y - q.y;
    let length = Math.sqrt(dx * dx + dy * dy);
    let offset = length * 0.1; // Adjust curve strength
    // Perpendicular vector
    let nx = -dy / length;
    let ny = dx / length;
    // Control point
    let cx = mx + nx * offset;
    let cy = my + ny * offset;
    return [cx, cy];
}

function fromDistance(start, end, distance) {
    let x = end.x - start.x;
    let y = end.y - start.y;
    let z = Math.sqrt(x * x + y * y);
    let ratio = distance / z;
    let deltaX = Math.round(x * ratio);
    let deltaY = Math.round(y * ratio);
    return { x: end.x - deltaX, y: end.y - deltaY };
}

function createCell(content) {
    const cell = document.createElement('div');
    cell.textContent = content;
    cell.className = 'cell';
    return cell
}

function traverse(node, fn) {
    if (node) {
        fn(node);
        traverse(node.left, fn);
        traverse(node.right, fn);
    }
}

function copyTreeUrl(nodes) {
    const json = JSON.stringify(nodes);
    const pageId = location.pathname.split('/').pop();
    const url = `${location.origin}/data-structures/embed/${pageId}?skeleton=${btoa(json)}`;
    navigator.clipboard.writeText(url);
    showToast({
        message: 'Tree url is copied to clipboard.',
        variant: 'success',
    });
};

function randomNodes(size = 6) {
    const result = new Set();
    while (result.size < size) {
        result.add(randomInt());
    }
    return Array.from(result);
}

function muteSounds() {
    const sound1 = document.getElementById('popSound');
    const sound2 = document.getElementById('swapSound');
    sound1.muted = true;
    sound2.muted = true;
    return () => {
        sound1.muted = false;
        sound2.muted = false;
    };
}

export {
    cursorOffset,
    svgElement,
    costInput,
    findCurve,
    fromDistance,
    createCell,
    traverse,
    copyTreeUrl,
    randomNodes,
    muteSounds,
};

/**
 * Format a date string into a relative time string.
 */
export function timeAgo(dateStr) {
    const date = new Date(dateStr).getTime();
    const seconds = Math.floor((Date.now() - date) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;

    const options = { month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
}

export const sound = (name) => {
    const sound = document.getElementById(`${name}Sound`);
    sound?.play();
};

export const groupBy = (arr, key) => {
    return arr.reduce((acc, x) => {
        (acc[x[key]] ??= []).push(x);
        return acc;
    }, {});
};

export const throttle = (fn, delay) => {
    let prev = 0;
    return (...args) => {
        let now = Date.now();
        if (now - prev > delay) {
            prev = now;
            fn(...args);
        }
    }
};

export const sleep = (t) => {
    return new Promise((resolve) => setTimeout(resolve, t));
};

export const charAt = (code) => String.fromCharCode(code);

export const randomInt = () => Math.floor(Math.random() * 99) + 1;

export const hasValue = (val) => {
    return val !== null && val !== undefined;
};

export const bgcolor = (id, color) => $(id).css('background-color', color);

export const withBoxId = (val, i) => ({ val, id: `#box${i}` });

export const showError = (msg) => {
    showToast({ message: msg, variant: 'error' });
};

export const logError = (error) => {
    window.gtag?.('event', 'error', error);
};

export const fetcher = async (url) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
};

export const baseUrlPg = () => {
    return process.env.NODE_ENV === 'production'
        ? 'https://api.cashfree.com/pg'
        : 'https://sandbox.cashfree.com/pg';
}
