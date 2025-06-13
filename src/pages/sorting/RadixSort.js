import React, { useEffect } from 'react';
import { createGrid, sound } from '@/common/utils';
import Numbers from '@/components/numbers/input-numbers';
import Timer from '@/common/timer';

var a, n, cells;
var max, exp;
var out, b;
var delay = 700;

function nextDigit() {
    for (let i = 0; i < n; i++) {
        let html = '</div>';
        let t = a[i];
        let j = 1;
        while (t !== 0) {
            let r = t % 10;
            if (j === exp) {
                html = `<span style="color:#e91e63">${r}</span>${html}`;
            } else {
                html = r + html;
            }
            t = Math.floor(t / 10);
            j = j * 10;
        }
        cells[i].innerHTML = '<div>' + html;
    }
}

function enqueue(i) {
    let j = Math.floor(a[i] / exp) % 10;
    b[j]++;
    cells[i].style.backgroundColor = 'white';
    cells[i].firstChild.setAttribute(
        'style',
        `
        margin-top:5px;
        background-color:#ffea00;
        border:thin solid;
        border-radius:8px;`
    );
    cells[j + n].innerHTML =
        cells[i].innerHTML + cells[j + n].innerHTML;
    cells[i++].innerHTML = '';
}

async function radixSort() {
    nextDigit();
    if (Math.floor(max / exp) > 0) {
        b = new Array();
        for (let j = 0; j < 10; j++) b[j] = 0;
        for (let i = 0; i < n; i++) {
            await Timer.sleep(delay);
            cells[i].style.backgroundColor = '#ffea00';
            await Timer.sleep(delay);
            sound('pop');
            enqueue(i);
        }
        await Timer.sleep(delay);
        for (let j = 1; j < 10; j++) b[j] += b[j - 1];
        for (let i = n - 1; i >= 0; i--) {
            out[--b[Math.floor(a[i] / exp) % 10]] = a[i];
        }
        for (let i = 0; i < n; i++) a[i] = out[i];
        exp *= 10;
        await putBack(n - 1);
        await Timer.sleep(delay);
        for (let i = 0; i < n; i++) {
            cells[i].style.backgroundColor = 'white';
        }
        await Timer.sleep(delay);
        radixSort();
    }
}

async function putBack(i, j = 9) {
    let bkt = cells[n + j];
    while (bkt.childNodes.length > 0) {
        await Timer.sleep(delay);
        sound('pop');
        bkt.firstChild.removeAttribute('style');
        cells[i].innerHTML = bkt.firstChild.outerHTML;
        cells[i].style.backgroundColor = '#ffea00';
        bkt.removeChild(bkt.firstChild);
        i--;
    }
    if (j > 0) await putBack(i, --j);
}

function RadixSort() {
    const start = (values) => {
        a = [...values];
        n = a.length;
        createGrid(n, '#numbers');
        createGrid(10, '#buckets');
        createGrid(10, '#buckets');
        cells = document.querySelectorAll('.cell');
        for (let i = 0; i < n; i++) {
            cells[i].textContent = a[i];
            cells[i].style.border = '2px solid';
        }
        cells[n].parentNode.style = 'align-items:end;'
        max = a[0];
        for (let i = 1; i < n; i++) {
            if (a[i] > max) max = a[i];
        }
        for (let i = 0; i < 10; i++) {
            let npn = i + 10 + n;
            cells[npn].textContent = i;
            cells[npn].setAttribute(
                'style',
                `
                font-weight:600;
                border-top:2px solid;
                border-radius:8px;
                text-align:center;`
            );
            cells[n + i].setAttribute(
                'style',
                `
                padding:0;
                display:flex;
                flex-direction:column;
                justify-content:flex-end;
                margin-bottom:7px;`
            );
        }
        exp = 1;
        out = new Array();
        Timer.sleep(delay).then(radixSort);
    };

    const stop = () => {
        Timer.clear();
        try {
            document.getElementById('numbers').innerHTML = '';
            document.getElementById('buckets').innerHTML = '';
        } catch (e) {}
    };

    useEffect(() => () => stop(), []);

    return (
        <>
            <p>
                <strong>Radix Sort</strong> organizes numbers by sorting them
                digit by digit. It starts with the least significant digit
                (rightmost) and works to the most significant digit (leftmost).
                Numbers are placed into buckets based on each digit&apos;s
                value, then collected back together in order. This process is
                repeated for each digit, leading to a sorted list.
            </p>
            <Numbers onStart={start} onStop={stop} />
            <div id="numbers" className="numGrid mb-5" />
            <br />
            <div id="buckets" className="numGrid" />
        </>
    );
}

export default RadixSort;
