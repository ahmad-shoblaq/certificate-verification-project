const form = document.getElementById('issueForm');
const out = document.getElementById('result');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const body = Object.fromEntries(new FormData(form).entries());

  const r = await fetch('/api/certs/issue', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  const data = await r.json();
  if (!data.ok) return showError(out, 'Failed to issue certificate');

  showSuccess(out, `
    <p class="success"><strong>Saved!</strong></p>
    <p><b>Hash:</b> ${data.hash}</p>
    <p><a class="btn outline" href="verify.html${data.verifyUrl.replace('/api/certs/verify','?')}">Verify now</a></p>
  `);
});
