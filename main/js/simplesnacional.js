document.getElementById('formFiscal').addEventListener('submit', function(e) {
  e.preventDefault();
  const { jsPDF } = window.jspdf;

  const csosn = document.getElementById('csosn');
  const cfop = document.getElementById('cfop');
  const icms_difal = document.getElementById('icms_difal');
  const cst_ipi = document.getElementById('cst_ipi');
  const aliquota_ipi = document.getElementById('aliquota_ipi');
  const cst_issqn = document.getElementById('cst_issqn');
  const aliquota_issqn = document.getElementById('aliquota_issqn');
  const base_issqn = document.getElementById('base_issqn');
  const descontar_iss = document.getElementById('descontar_iss');
  const cst_pis = document.getElementById('cst_pis');
  const base_pis = document.getElementById('base_pis');
  const cst_cofins = document.getElementById('cst_cofins');
  const base_cofins = document.getElementById('base_cofins');
  const aliquota = document.getElementById('aliquota');

  const doc1 = new jsPDF();

  // Função para gerar o PDF com as informações do formulário
  function gen(doc, lines, title) {
    let y = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Adicionar a imagem da logo ao PDF
    const logoSrc = '../imagens/THUB-preto.png';  // Caminho da imagem da logo
    doc.addImage(logoSrc, 'PNG', (pageWidth - 80) / 2, 10, 50, 20); // Adicionando logo no PDF
    
    doc.setFontSize(14);
    doc.setTextColor(40);
    doc.text(title, pageWidth / 2, y + 25, { align: 'center' });  // Ajuste do título após logo
    y += 10;
    
    const rows = lines.map(l => [l.split(':')[0], l.split(':').slice(1).join(':').trim()]);
    doc.autoTable({
      startY: y + 5,
      head: [['Campo', 'Valor']],
      body: rows,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 0, 0], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 240, 240] }
    });
  }

  // Gerar PDF para a Natureza de Operação dentro do Estado
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

  gen(doc1, intra, 'Configuração Fiscal - Dentro do Estado');
  doc1.save('Config. Natureza de Operação - Dentro do Estado.pdf');
});
