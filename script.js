document.getElementById('has_exceptions_ncm').addEventListener('change', function(){
  document.getElementById('ncm_exceptions_group').style.display =
    this.value === 'Sim' ? 'block' : 'none';
  document.getElementById('exceptions_block').style.display =
    this.value === 'Sim' ? 'block' : 'none';
  if (this.value !== 'Sim') document.getElementById('ncm_tags').innerHTML = '';
});

document.getElementById('ncm_exceptions').addEventListener('keypress', function(e){
  if (e.key === 'Enter') {
    e.preventDefault();
    const val = this.value.trim();
    if (/^\d{8}$/.test(val)) {
      const span = document.createElement('span');
      span.className = 'tag';
      span.textContent = val;
      document.getElementById('ncm_tags').appendChild(span);
      this.value = '';
    } else {
      alert('NCM deve ter exatamente 8 dígitos');
    }
  }
});

document.getElementById('has_natureza_fora').addEventListener('change', function(){
  document.getElementById('natureza_fora').style.display =
    this.value === 'Sim' ? 'block' : 'none';
});

document.getElementById('formFiscal').addEventListener('submit', function(e){
  e.preventDefault();
  const { jsPDF } = window.jspdf;
  const logoImg = document.getElementById('logopdf');
  const logoSrc = logoImg.src;

  // 1) Definição de todas as variáveis de formulário
  const csosn           = document.getElementById('csosn');
  const cfop            = document.getElementById('cfop');
  const icms_difal      = document.getElementById('icms_difal');
  const cst_ipi         = document.getElementById('cst_ipi');
  const aliquota_ipi    = document.getElementById('aliquota_ipi');
  const cst_issqn       = document.getElementById('cst_issqn');
  const aliquota_issqn  = document.getElementById('aliquota_issqn');
  const base_issqn      = document.getElementById('base_issqn');
  const descontar_iss   = document.getElementById('descontar_iss');
  const cst_pis         = document.getElementById('cst_pis');
  const base_pis        = document.getElementById('base_pis');
  const cst_cofins      = document.getElementById('cst_cofins');
  const base_cofins     = document.getElementById('base_cofins');
  const aliquota        = document.getElementById('aliquota');

  const csosn_exc        = document.getElementById('csosn_exc');
  const cfop_exc         = document.getElementById('cfop_exc');
  const icms_difal_exc   = document.getElementById('icms_difal_exc');
  const cst_ipi_exc      = document.getElementById('cst_ipi_exc');
  const aliquota_ipi_exc = document.getElementById('aliquota_ipi_exc');
  const cst_issqn_exc    = document.getElementById('cst_issqn_exc');
  const aliquota_issqn_exc = document.getElementById('aliquota_issqn_exc');
  const base_issqn_exc     = document.getElementById('base_issqn_exc');
  const descontar_iss_exc   = document.getElementById('descontar_iss_exc');
  const cst_pis_exc         = document.getElementById('cst_pis_exc');
  const base_pis_exc        = document.getElementById('base_pis_exc');
  const cst_cofins_exc      = document.getElementById('cst_cofins_exc');
  const base_cofins_exc     = document.getElementById('base_cofins_exc');
  const aliquota_exc        = document.getElementById('aliquota_exc');

  const csosn_fora        = document.getElementById('csosn_fora');
  const cfop_fora         = document.getElementById('cfop_fora');
  const icms_difal_fora   = document.getElementById('icms_difal_fora');
  const cst_ipi_fora      = document.getElementById('cst_ipi_fora');
  const aliquota_ipi_fora = document.getElementById('aliquota_ipi_fora');
  const cst_issqn_fora    = document.getElementById('cst_issqn_fora');
  const aliquota_issqn_fora = document.getElementById('aliquota_issqn_fora');
  const base_issqn_fora     = document.getElementById('base_issqn_fora');
  const descontar_iss_fora   = document.getElementById('descontar_iss_fora');
  const cst_pis_fora         = document.getElementById('cst_pis_fora');
  const base_pis_fora        = document.getElementById('base_pis_fora');
  const cst_cofins_fora      = document.getElementById('cst_cofins_fora');
  const base_cofins_fora     = document.getElementById('base_cofins_fora');
  const aliquota_fora        = document.getElementById('aliquota_fora');

  const hasExceptionsNCM  = document.getElementById('has_exceptions_ncm').value;
  const hasNaturezaFora   = document.getElementById('has_natureza_fora').value;

  // 2) Função gen() permanece inalterada
  function gen(doc, lines, title){
    let y = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    if (logoSrc) {
      doc.addImage(logoSrc, 'PNG', (pageWidth - 80) / 2, 10, 50, 20);
      y = 35;
    }
    doc.setFontSize(14);
    doc.setTextColor(40);
    doc.text(title, pageWidth / 2, y, { align: 'center' });
    y += 10;
    const rows = lines.map(l => [ l.split(':')[0], l.split(':').slice(1).join(':').trim() ]);
    doc.autoTable({
      startY: y + 5,
      head: [['Campo','Valor']],
      body: rows,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0,0,0], textColor: 255 },
      alternateRowStyles: { fillColor: [240,240,240] }
    });
  }

  // 3) Gera SEMPRE o PDF "Dentro do Estado"
  const intra = [
    'Natureza de Operação dentro do Estado',
    `CSOSN: ${csosn.value}`, `CFOP: ${cfop.value}`, `ICMS DIFAL: ${icms_difal.value}`,
    `CST IPI: ${cst_ipi.value}`, `Alíquota IPI: ${aliquota_ipi.value}%`,
    `CST ISSQN: ${cst_issqn.options[cst_issqn.selectedIndex].text}`, `Alíquota ISSQN: ${aliquota_issqn.value}%`,
    `Base ISSQN: ${base_issqn.value}%`, `Descontar ISS: ${descontar_iss.value}`,
    `CST PIS: ${cst_pis.value}`, `Base PIS: ${base_pis.value}%`,
    `CST COFINS: ${cst_cofins.value}`, `Base COFINS: ${base_cofins.value}%`,
    `Alíquota COFINS: ${aliquota.value}%`
  ];
  const doc1 = new jsPDF();
  gen(doc1, intra, 'Configuração Fiscal - Dentro do Estado');
  doc1.save('Config. Natureza de Operação - Dentro do Estado.pdf');

  // 4) Gera "Exceções de NCM" apenas se marcado
  if (hasExceptionsNCM === 'Sim') {
    const tags = document.querySelectorAll('#ncm_tags .tag');
    if (tags.length === 0) {
      alert('Por favor, adicione ao menos um NCM para gerar exceções!');
      return;
    }
    const exc = [
      'Natureza para NCM’s Exceções',
      `CSOSN: ${csosn_exc.value}`, `CFOP: ${cfop_exc.value}`, `ICMS DIFAL: ${icms_difal_exc.value}`,
      `CST IPI: ${cst_ipi_exc.value}`, `Alíquota IPI: ${aliquota_ipi_exc.value}%`,
      `CST ISSQN: ${cst_issqn_exc.value}`, `Alíquota ISSQN: ${aliquota_issqn_exc.value}%`,
      `Base ISSQN: ${base_issqn_exc.value}%`, `Descontar ISS: ${descontar_iss_exc.value}`,
      `CST PIS: ${cst_pis_exc.value}`, `Base PIS: ${base_pis_exc.value}%`,
      `CST COFINS: ${cst_cofins_exc.value}`, `Base COFINS: ${base_cofins_exc.value}%`,
      `Alíquota: ${aliquota_exc.value}%`
    ];
    tags.forEach(t => exc.push(`NCM: ${t.textContent}`));
    const docExc = new jsPDF();
    gen(docExc, exc, 'Configuração Fiscal - Exceções de NCM');
    docExc.save('Config. Natureza de Operação - Exceções de NCM.pdf');
  }

  // 5) Gera "Fora do Estado" apenas se marcado
  if (hasNaturezaFora === 'Sim') {
    const fora = [
      'Natureza de Operação Fora do Estado',
      `CSOSN: ${csosn_fora.value}`, `CFOP: ${cfop_fora.value}`, `ICMS DIFAL: ${icms_difal_fora.value}`,
      `CST IPI: ${cst_ipi_fora.value}`, `Alíquota IPI: ${aliquota_ipi_fora.value}%`,
      `CST ISSQN: ${cst_issqn_fora.options[cst_issqn_fora.selectedIndex].text}`, `Alíquota ISSQN: ${aliquota_issqn_fora.value}%`,
      `Base ISSQN: ${base_issqn_fora.value}%`, `Descontar ISS: ${descontar_iss_fora.value}`,
      `CST PIS: ${cst_pis_fora.value}`, `Base PIS: ${base_pis_fora.value}%`,
      `CST COFINS: ${cst_cofins_fora.value}`, `Base COFINS: ${base_cofins_fora.value}%`,
      `Alíquota COFINS: ${aliquota_fora.value}%`
    ];
    const docFora = new jsPDF();
    gen(docFora, fora, 'Configuração Fiscal - Fora do Estado');
    docFora.save('Config. Natureza de Operação - Fora do Estado.pdf');
  }
});
