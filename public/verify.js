// verify.js
const form = document.getElementById('verifyForm');
const out = document.getElementById('result');

const p = new URLSearchParams(location.search);
['name','idNumber','issueDate'].forEach(k => { if (p.get(k)) form[k].value = p.get(k); });

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const params = new URLSearchParams(new FormData(form));

  const r = await fetch('/api/certs/verify?' + params.toString());
  const data = await r.json();

  if (!data.ok) return showError(out, 'Verification failed.');
  if (!data.match) return showError(out, `No match. Hash: ${data.hash}`);

  showSuccess(out, `
    <p class="success"><strong>Valid Certificate</strong></p>
    <p><b>Hash:</b> ${data.hash}</p>
  `);
});
