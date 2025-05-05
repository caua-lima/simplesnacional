document.addEventListener('DOMContentLoaded', function () {
    // 1) Toggle de exibição do bloco “Dentro do Estado”
    document.getElementById('has_natureza_dentro').addEventListener('change', function(){
      document.getElementById('natureza_padrao').style.display =
        this.value === 'Sim' ? 'block' : 'none';
    });
  
    // 2) Listener de exceções de NCM
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
  
    // 3) Listener de “Fora do Estado”
    document.getElementById('has_natureza_fora').addEventListener('change', function(){
      document.getElementById('natureza_fora').style.display =
        this.value === 'Sim' ? 'block' : 'none';
    });
  
    // 4) Submit handler
    document.getElementById('formFiscal').addEventListener('submit', function(e){
      e.preventDefault();
      const { jsPDF } = window.jspdf;
      const logoSrc = document.getElementById('logopdf')?.src || '';
  
      const hasNdoDentro = document.getElementById('has_natureza_dentro').value;
      const hasExceptionsNCM = document.getElementById('has_exceptions_ncm').value;
      const hasNaturezaFora = document.getElementById('has_natureza_fora').value;
  
      if (hasNdoDentro === '') {
        alert('Por favor, selecione Sim ou Não para Natureza de Operação dentro do Estado.');
        return;
      } else if (hasNdoDentro === 'Não') {
        alert('Você marcou "Não" para Natureza de Operação dentro do Estado; nenhum PDF será gerado.');
        return;
      }
  
      // Função utilitária para obter valor de campo
      const g = id => document.getElementById(id)?.value || '';
      const gt = id => {
        const el = document.getElementById(id);
        return el ? el.options[el.selectedIndex]?.text || '' : '';
      }
  
      function gen(doc, lines, title){
        let y = 20;
        const w = doc.internal.pageSize.getWidth();
        if (logoSrc) {
          doc.addImage(logoSrc, 'PNG', (w - 80) / 2, 10, 50, 20);
          y = 35;
        }
        doc.setFontSize(14);
        doc.setTextColor(40);
        doc.text(title, w / 2, y, { align: 'center' });
        y += 10;
        const body = lines.map(l => [ l.split(':')[0], l.split(':').slice(1).join(':').trim() ]);
        doc.autoTable({
          startY: y + 5,
          head: [['Campo','Valor']],
          body,
          theme: 'grid',
          styles: { fontSize: 10 },
          headStyles: { fillColor: [0,0,0], textColor: 255 },
          alternateRowStyles: { fillColor: [240,240,240] }
        });
      }
  
      const tags = document.querySelectorAll('#ncm_tags .tag');
      const tagTexts = Array.from(tags).map(t => `NCM: ${t.textContent}`);
  
      const blockData = (prefix = '') => [
        `CSOSN: ${g(prefix + 'csosn')}`,
        `CFOP: ${g(prefix + 'cfop')}`,
        `ICMS DIFAL: ${g(prefix + 'icms_difal')}`,
        `CST IPI: ${g(prefix + 'cst_ipi')}`,
        `Alíquota IPI: ${g(prefix + 'aliquota_ipi')}%`,
        `CST ISSQN: ${gt(prefix + 'cst_issqn')}`,
        `Alíquota ISSQN: ${g(prefix + 'aliquota_issqn')}%`,
        `Base ISSQN: ${g(prefix + 'base_issqn')}%`,
        `Descontar ISS: ${g(prefix + 'descontar_iss')}`,
        `CST PIS: ${g(prefix + 'cst_pis')}`,
        `Base PIS: ${g(prefix + 'base_pis')}%`,
        `CST COFINS: ${g(prefix + 'cst_cofins')}`,
        `Base COFINS: ${g(prefix + 'base_cofins')}%`,
        `Alíquota COFINS: ${g(prefix + 'aliquota') || g(prefix + 'aliquota_fora') || g(prefix + 'aliquota_exc')}%`
      ];
  
      const doc1 = new jsPDF();
      gen(doc1, ['Natureza de Operação dentro do Estado', ...blockData()], 'Configuração Fiscal - Dentro do Estado');
      doc1.save('Config. Natureza de Operação - Dentro do Estado.pdf');
  
      if (hasExceptionsNCM === 'Sim' && tagTexts.length === 0) {
        alert('Adicione ao menos um NCM para gerar o PDF de exceções!');
        return;
      }
  
      if (hasExceptionsNCM === 'Sim') {
        const docExc = new jsPDF();
        gen(docExc, ['Natureza para NCM’s Exceções', ...blockData(''), ...tagTexts], 'Configuração Fiscal - Exceções de NCM');
        docExc.save('Config. Natureza de Operação - Exceções de NCM.pdf');
      }
  
      if (hasNaturezaFora === 'Sim') {
        const docFora = new jsPDF();
        gen(docFora, ['Natureza de Operação Fora do Estado', ...blockData('fora_')], 'Configuração Fiscal - Fora do Estado');
        docFora.save('Config. Natureza de Operação - Fora do Estado.pdf');
      }
    });
  });
  