const $ = s => document.getElementById(s);
const hd = x => { const g = { 0: ['head'] }; for (const k in x) g[k] = (g[k] || []).concat(x[k]); return g; };
const H = hd({});
const nx = (L, i) => i + 1 < L.length ? `next → ${L[i + 1]}` : 'next → NULL';
const ins = (L, i, v) => [...L.slice(0, i), v, ...L.slice(i)];

/* ---------- code shown next to the drawing ---------- */
const K = {
ib: `void InsertAtBeginning(Node*& head, int value)
{
    Node* new_node = new Node();
    new_node->value = value;
    new_node->next = head;
    head = new_node;
}`,
ia: `void InsertAfter(Node* prev_node, int Value) {
    if (prev_node == NULL) {
        cout << "the given previous node cannot be NULL";
        return;
    }
    Node* new_node = new Node();
    new_node->value = Value;
    new_node->next = prev_node->next;
    prev_node->next = new_node;
}`,
ie: `void InsertAtEnd(Node*& head, int Value) {
    Node* new_node = new Node();
    new_node->value = Value;
    new_node->next = NULL;
    if (head == NULL) {
        head = new_node;
        return;
    }
    Node* LastNode = head;
    while (LastNode->next != NULL)
        LastNode = LastNode->next;
    LastNode->next = new_node;
}`,
dv: `void DeleteNode(Node*& head, int Value) {
    Node* Current = head, *Prev = head;
    if (head == NULL) return;
    if (Current->value == Value) {
        head = Current->next;
        delete Current;
        return;
    }
    while (Current != NULL && Current->value != Value) {
        Prev = Current;
        Current = Current->next;
    }
    if (Current == NULL) return;
    Prev->next = Current->next;
    delete Current;
}`,
df: `void DeleteFirstNode(Node*& head) {
    Node* Current = head;
    if (head == NULL) return;
    head = Current->next;
    delete Current;
}`,
dl: `void DeleteLastNode(Node*& head) {
    Node* Current = head, *Prev = head;
    if (head == NULL) return;
    if (Current->next == NULL) {
        head = NULL;
        delete Current;
        return;
    }
    while (Current->next != NULL) {
        Prev = Current;
        Current = Current->next;
    }
    Prev->next = NULL;
    delete Current;
}`,
fd: `Node* Find(Node* head, int Value) {
    while (head != NULL) {
        if (head->value == Value)
            return head;
        head = head->next;
    }
    return NULL;
}`,
pr: `void PrintList(Node* head) {   // Traversing
    while (head != NULL) {
        cout << head->value << " ";
        head = head->next;
    }
}`,
mn: `int main() {
    Node* head = NULL;
    InsertAtEnd(head, 1);
    InsertAtEnd(head, 2);
    InsertAtEnd(head, 3);
    // Traversing: walk over every node
    PrintList(head);
    // Searching
    Node* found = Find(head, 2);
    if (found != NULL) cout << "\\nFound: " << found->value;
    else cout << "\\nNot found";
    return 0;
}`};

/* ---------- step generators: one frame = one highlighted line ---------- */
const ib = (L, v) => [
 { l: 2, t: 'new Node() ← حجزنا عقدة جديدة في الـ Heap', L, g: H, nw: { v: '?', n: 'next → ?' } },
 { l: 3, t: `new_node->value = ${v}`, L, g: H, nw: { v, n: 'next → ?' } },
 { l: 4, t: 'new_node->next = head ← الجديدة بتشاور على أول عقدة', L, g: H, nw: { v, n: L.length ? `next → ${L[0]}` : 'next → NULL' } },
 { l: 5, t: 'head = new_node ← الـ head بقى يشاور على الجديدة', L: [v, ...L], g: H, m: { 0: 'new' } }];

const ia = (L, p, v) => {
  if (p < 0) return [
   { l: 0, t: 'Find رجّعت NULL (القيمة مش موجودة)، يعني prev_node = NULL', L, g: H },
   { l: 1, t: 'prev_node == NULL ← الشرط صح', L, g: H },
   { l: 2, t: 'بيطبع رسالة الخطأ', L, g: H, o: 'the given previous node cannot be NULL' },
   { l: 3, t: 'return ← الليست ما اتغيرتش', L, g: H, o: 'the given previous node cannot be NULL' }];
  const g = hd({ [p]: ['prev_node'] });
  return [
   { l: 0, t: `prev_node بيشاور على العقدة ${L[p]}`, L, g },
   { l: 5, t: 'new Node() ← عقدة جديدة', L, g, nw: { v: '?', n: 'next → ?' } },
   { l: 6, t: `new_node->value = ${v}`, L, g, nw: { v, n: 'next → ?' } },
   { l: 7, t: 'new_node->next = prev_node->next ← الجديدة بتشاور على اللي بعد prev', L, g, nw: { v, n: nx(L, p) }, hl: p },
   { l: 8, t: 'prev_node->next = new_node ← prev بيشاور على الجديدة', L: ins(L, p + 1, v), g, m: { [p + 1]: 'new' } }];
};

const ie = (L, v) => {
  const nw = { v, n: 'next → NULL' };
  const f = [
   { l: 1, t: 'new Node()', L, g: H, nw: { v: '?', n: 'next → ?' } },
   { l: 2, t: `new_node->value = ${v}`, L, g: H, nw: { v, n: 'next → ?' } },
   { l: 3, t: 'new_node->next = NULL ← هتبقى آخر عقدة', L, g: H, nw }];
  if (!L.length) return f.concat([
   { l: 4, t: 'head == NULL ← صح، الليست فاضية', L, g: H, nw },
   { l: 5, t: 'head = new_node', L: [v], g: H, m: { 0: 'new' } },
   { l: 6, t: 'return', L: [v], g: H, m: { 0: 'new' } }]);
  f.push({ l: 4, t: 'head == NULL ← غلط، الليست فيها عناصر', L, g: H, nw },
         { l: 8, t: 'LastNode = head', L, g: hd({ 0: ['LastNode'] }), nw });
  for (let i = 0; i < L.length - 1; i++)
    f.push({ l: 10, t: 'LastNode->next != NULL ← نتحرك للعقدة اللي بعدها', L, g: hd({ [i + 1]: ['LastNode'] }), nw });
  const e = L.length - 1;
  f.push({ l: 9, t: 'LastNode->next == NULL ← وقفنا عند آخر عقدة', L, g: hd({ [e]: ['LastNode'] }), nw },
         { l: 11, t: 'LastNode->next = new_node ← ربطنا الجديدة بالآخر', L: [...L, v], g: hd({ [e]: ['LastNode'] }), m: { [e + 1]: 'new' }, hl: e });
  return f;
};

const dv = (L, val) => {
  const n = L.length, i = L.indexOf(val), e = i < 0 ? n : i;
  const g0 = hd({ 0: ['Current', 'Prev'] });
  const f = [{ l: 1, t: 'Current = head, Prev = head', L, g: g0 }];
  if (i === 0) return f.concat([
   { l: 3, t: `Current->value == ${val} ← صح، دي العقدة الأولى`, L, g: g0 },
   { l: 4, t: 'head = Current->next ← الـ head اتحرك للتانية', L, g: { 0: ['Current'], 1: ['head'] }, m: { 0: 'del' } },
   { l: 5, t: 'delete Current ← اتمسحت من الذاكرة', L: L.slice(1), g: H },
   { l: 6, t: 'return', L: L.slice(1), g: H }]);
  f.push({ l: 3, t: `الأولى مش ${val} ← نكمّل بحث`, L, g: g0 });
  for (let k = 0; k < e; k++)
    f.push({ l: 10, t: 'Prev = Current ثم Current = Current->next', L, g: hd({ [k]: ['Prev'], [k + 1]: ['Current'] }) });
  const g = hd({ [e - 1]: ['Prev'], [e]: ['Current'] });
  if (i < 0) return f.concat([
   { l: 8, t: 'Current == NULL ← وصلنا لآخر الليست وخرجنا من الـ while', L, g },
   { l: 12, t: `${val} مش موجودة ← return من غير أي تغيير`, L, g }]);
  return f.concat([
   { l: 8, t: `Current->value == ${val} ← وقفنا عند العقدة المطلوبة`, L, g },
   { l: 13, t: 'Prev->next = Current->next ← Prev بيتخطى العقدة', L, g, m: { [i]: 'del' }, hl: i - 1 },
   { l: 14, t: 'delete Current ← اتمسحت من الذاكرة', L: [...L.slice(0, i), ...L.slice(i + 1)], g: hd({ [i - 1]: ['Prev'] }) }]);
};

const df = L => L.length ? [
  { l: 1, t: 'Current = head', L, g: hd({ 0: ['Current'] }) },
  { l: 2, t: 'head != NULL ← نكمّل', L, g: hd({ 0: ['Current'] }) },
  { l: 3, t: 'head = Current->next ← الـ head اتحرك للتانية', L, g: { 0: ['Current'], 1: ['head'] }, m: { 0: 'del' } },
  { l: 4, t: 'delete Current ← اتمسحت من الذاكرة', L: L.slice(1), g: H }
] : [
  { l: 1, t: 'Current = head (وهو NULL)', L, g: hd({ 0: ['Current'] }) },
  { l: 2, t: 'head == NULL ← صح، return (مفيش حاجة تتمسح)', L, g: hd({ 0: ['Current'] }) }];

const dl = L => {
  const n = L.length;
  if (!n) return [
   { l: 1, t: 'Current = Prev = head (وهو NULL)', L, g: hd({ 0: ['Current', 'Prev'] }) },
   { l: 2, t: 'head == NULL ← صح، return', L, g: hd({ 0: ['Current', 'Prev'] }) }];
  const g0 = hd({ 0: ['Current', 'Prev'] });
  const f = [{ l: 1, t: 'Current = head, Prev = head', L, g: g0 }];
  if (n === 1) return f.concat([
   { l: 3, t: 'Current->next == NULL ← صح، عقدة واحدة بس', L, g: g0 },
   { l: 4, t: 'head = NULL ← الليست بقت فاضية', L, g: { 0: ['Current'], 1: ['head'] }, m: { 0: 'del' } },
   { l: 5, t: 'delete Current ← اتمسحت من الذاكرة', L: [], g: H }]);
  f.push({ l: 3, t: 'Current->next != NULL ← فيه عقد تانية، نكمّل', L, g: g0 });
  for (let k = 0; k < n - 1; k++)
    f.push({ l: 10, t: 'Prev = Current ثم Current = Current->next', L, g: hd({ [k]: ['Prev'], [k + 1]: ['Current'] }) });
  const g = hd({ [n - 2]: ['Prev'], [n - 1]: ['Current'] });
  return f.concat([
   { l: 8, t: 'Current->next == NULL ← وقفنا عند آخر عقدة', L, g },
   { l: 12, t: 'Prev->next = NULL ← Prev بقى هو الآخر', L, g, m: { [n - 1]: 'del' }, hl: n - 2 },
   { l: 13, t: 'delete Current ← اتمسحت من الذاكرة', L: L.slice(0, -1), g: hd({ [n - 2]: ['Prev'] }) }]);
};

const fd = (L, val) => {
  const f = [];
  for (let k = 0; k < L.length; k++) {
    if (L[k] === val) return f.concat([
     { l: 2, t: `${L[k]} == ${val} ← لقيناه`, L, g: { [k]: ['head'] }, m: { [k]: 'hit' } },
     { l: 3, t: 'return head ← بيرجّع عنوان العقدة', L, g: { [k]: ['head'] }, m: { [k]: 'hit' }, o: `Found: ${val}` }]);
    f.push({ l: 2, t: `${L[k]} == ${val} ؟ لأ ← head = head->next`, L, g: { [k]: ['head'] } });
  }
  return f.concat([
   { l: 1, t: 'head == NULL ← خرجنا من الـ while', L, g: { [L.length]: ['head'] } },
   { l: 6, t: 'return NULL ← القيمة مش موجودة', L, g: { [L.length]: ['head'] }, o: 'Not found' }]);
};

const pr = L => {
  const f = []; let o = '';
  L.forEach((v, k) => {
    f.push({ l: 1, t: 'head != NULL ← صح، العقدة دي لسه موجودة', L, g: { [k]: ['head'] }, o });
    o += v + ' ';
    f.push({ l: 2, t: `cout << ${v}`, L, g: { [k]: ['head'] }, o },
           { l: 3, t: 'head = head->next ← نتحرك للعقدة اللي بعدها', L, g: { [k + 1]: ['head'] }, o });
  });
  return f.concat([{ l: 1, t: 'head == NULL ← وصلنا لآخر الليست، الـ Traversing خلص', L, g: { [L.length]: ['head'] }, o }]);
};

const mn = () => {
  const g = { 0: ['head'] };
  return [
   { l: 1, t: 'الليست فاضية', L: [], g: H },
   { l: 2, t: 'InsertAtEnd(head, 1)', L: [1], g, m: { 0: 'new' } },
   { l: 3, t: 'InsertAtEnd(head, 2)', L: [1, 2], g, m: { 1: 'new' } },
   { l: 4, t: 'InsertAtEnd(head, 3)', L: [1, 2, 3], g, m: { 2: 'new' } },
   { l: 6, t: 'PrintList(head) ← Traversing: بنمشي على كل العقد ونطبعها', L: [1, 2, 3], g, o: '1 2 3 ' },
   { l: 8, t: 'Find(head, 2) ← رجّعت pointer على العقدة 2', L: [1, 2, 3], g: { 0: ['head'], 1: ['found'] }, m: { 1: 'hit' }, o: '1 2 3 ' },
   { l: 9, t: 'found != NULL ← بيطبع القيمة', L: [1, 2, 3], g: { 0: ['head'], 1: ['found'] }, m: { 1: 'hit' }, o: '1 2 3 \nFound: 2' }];
};

/* ---------- operations menu ---------- */
const OPS = {
 ib: { gr: 'Insertion', n: 'At Beginning', ti: 'Insert At Beginning — إضافة في الأول', d: 'العقدة الجديدة بتبقى هي الـ head. سريعة: O(1) لأنها مش بتمشي على الليست.',
  cs: [['ليست فيها عناصر', 'InsertAtBeginning(head, 3);', () => ib([5, 8, 12], 3)], ['ليست فاضية', 'InsertAtBeginning(head, 3);', () => ib([], 3)]] },
 ia: { gr: 'Insertion', n: 'After a Node', ti: 'Insert After — إضافة بعد عقدة', d: 'بتاخد pointer على العقدة اللي قبلها. نربط الجديدة باللي بعد prev الأول، وبعدين prev بالجديدة (الترتيب مهم!).',
  cs: [['بعد عقدة في النص', 'InsertAfter(Find(head, 2), 9);', () => ia([1, 2, 3], 1, 9)], ['بعد آخر عقدة', 'InsertAfter(Find(head, 3), 9);', () => ia([1, 2, 3], 2, 9)], ['prev_node = NULL', 'InsertAfter(Find(head, 7), 9);', () => ia([1, 2, 3], -1, 9)]] },
 ie: { gr: 'Insertion', n: 'At End', ti: 'Insert At End — إضافة في الآخر', d: 'لازم نمشي لحد آخر عقدة (LastNode) وبعدين نربطها بالجديدة. O(n).',
  cs: [['ليست فاضية', 'InsertAtEnd(head, 4);', () => ie([], 4)], ['ليست فيها عناصر', 'InsertAtEnd(head, 4);', () => ie([1, 2, 3], 4)]] },
 dv: { gr: 'Deletion', n: 'By Value', ti: 'Delete Node — مسح بالقيمة', d: 'بندوّر على العقدة ومعانا Prev ورا Current، وبعدين Prev بيتخطى العقدة وبنعمل delete.',
  cs: [['العقدة الأولى', 'DeleteNode(head, 1);', () => dv([1, 2, 3], 1)], ['عقدة في النص', 'DeleteNode(head, 2);', () => dv([1, 2, 3], 2)], ['العقدة الأخيرة', 'DeleteNode(head, 3);', () => dv([1, 2, 3], 3)], ['القيمة مش موجودة', 'DeleteNode(head, 9);', () => dv([1, 2, 3], 9)]] },
 df: { gr: 'Deletion', n: 'First Node', ti: 'Delete First Node — مسح أول عقدة', d: 'نحرّك الـ head للعقدة التانية وبعدين نمسح القديمة. O(1).',
  cs: [['ليست فيها عناصر', 'DeleteFirstNode(head);', () => df([1, 2, 3])], ['ليست فاضية', 'DeleteFirstNode(head);', () => df([])]] },
 dl: { gr: 'Deletion', n: 'Last Node', ti: 'Delete Last Node — مسح آخر عقدة', d: 'لازم نمشي بـ Prev و Current لحد الآخر، وبعدين Prev->next = NULL. O(n).',
  cs: [['كذا عقدة', 'DeleteLastNode(head);', () => dl([1, 2, 3])], ['عقدة واحدة', 'DeleteLastNode(head);', () => dl([7])], ['ليست فاضية', 'DeleteLastNode(head);', () => dl([])]] },
 fd: { gr: 'Search', n: 'Find', ti: 'Find — بحث', d: 'بنمشي من أول عقدة لحد ما نلاقي القيمة ونرجّع pointer عليها، أو نوصل NULL ونرجّع NULL.',
  cs: [['القيمة موجودة', 'Node* found = Find(head, 2);', () => fd([1, 2, 3], 2)], ['القيمة مش موجودة', 'Node* found = Find(head, 9);', () => fd([1, 2, 3], 9)]] },
 pr: { gr: 'Traversing', n: 'PrintList', ti: 'PrintList — Traversing', d: 'الـ Traversing هو إننا نزور كل عقدة في الليست مرة واحدة من أول الـ head لحد NULL، وهنا بنطبع قيمة كل عقدة.',
  cs: [['ليست من 3 عناصر', 'PrintList(head);', () => pr([1, 2, 3])]] },
 mn: { gr: 'main()', n: 'Full main', ti: 'main() كامل', d: 'إضافة، Traversing بالطباعة، وبعدين Find.', cs: [['شغّل البرنامج', '', mn]] }
};

/* ---------- UI ---------- */
let op, ci = 0, fi = 0, fr = [], timer = null;

function el(tag, cls, txt) { const e = document.createElement(tag); if (cls) e.className = cls; if (txt !== undefined) e.textContent = txt; return e; }

function buildNav() {
  const groups = {};
  Object.keys(OPS).forEach(k => (groups[OPS[k].gr] = groups[OPS[k].gr] || []).push(k));
  for (const gname in groups) {
    const box = el('div', 'grp'); box.appendChild(el('span', '', gname));
    groups[gname].forEach(k => { const b = el('button', '', OPS[k].n); b.dataset.k = k; b.onclick = () => load(k); box.appendChild(b); });
    $('nav').appendChild(box);
  }
}

function load(k) {
  op = k; ci = 0;
  document.querySelectorAll('#nav button').forEach(b => b.classList.toggle('on', b.dataset.k === k));
  $('ttl').textContent = OPS[k].ti; $('dsc').textContent = OPS[k].d;
  $('cases').replaceChildren(...OPS[k].cs.map((c, i) => { const b = el('button', '', c[0]); b.onclick = () => pick(i); return b; }));
  $('code').replaceChildren(...K[k].split('\n').map(t => el('span', 'ln', t || ' ')));
  pick(0);
}

function pick(i) {
  stop(); ci = i; fi = 0;
  [...$('cases').children].forEach((b, j) => b.classList.toggle('on', j === i));
  const c = OPS[op].cs[i];
  $('call').textContent = c[1]; fr = c[2](); show();
}

function show() {
  const f = fr[fi], L = f.L, g = f.g || {}, m = f.m || {};
  let h = '<div class="row">';
  for (let i = 0; i <= L.length; i++) {
    h += '<div class="col"><div class="tags">' + (g[i] || []).map(t => `<b class="tg">${t}</b>`).join('') + '</div>';
    h += i < L.length ? `<div class="nd ${m[i] || ''}"><i>${L[i]}</i><u></u></div>` : '<div class="null">NULL</div>';
    h += '</div>';
    if (i < L.length) h += `<div class="ar${f.hl === i ? ' on' : ''}"></div>`;
  }
  h += '</div>';
  if (f.nw) h += `<div class="heap"><span>new_node</span><div class="nd new"><i>${f.nw.v}</i><u></u></div><em>${f.nw.n}</em></div>`;
  $('view').innerHTML = h;
  $('out').textContent = f.o || '';
  [...$('code').children].forEach((s, i) => s.classList.toggle('on', i === f.l));
  $('step').textContent = f.t;
  $('cnt').textContent = `خطوة ${fi + 1} / ${fr.length}`;
  $('bk').disabled = fi === 0; $('nx').disabled = fi === fr.length - 1;
}

function stop() { clearInterval(timer); timer = null; $('pl').textContent = 'تشغيل'; }
function go(d) { fi = Math.max(0, Math.min(fr.length - 1, fi + d)); show(); }

$('nx').onclick = () => { stop(); go(1); };
$('bk').onclick = () => { stop(); go(-1); };
$('rs').onclick = () => { stop(); fi = 0; show(); };
$('pl').onclick = () => {
  if (timer) return stop();
  if (fi === fr.length - 1) fi = 0;
  $('pl').textContent = 'إيقاف'; show();
  timer = setInterval(() => { if (fi >= fr.length - 1) return stop(); go(1); }, 1300);
};

buildNav(); load('ib');
