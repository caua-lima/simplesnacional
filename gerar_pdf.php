<?php
require('fpdf/fpdf.php'); // Caminho para a biblioteca FPDF

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Captura os dados do formulário
    $csosn = $_POST['csosn'];
    $cfop = $_POST['cfop'];
    $cst_ipi = $_POST['cst_ipi'];
    $aliquota_ipi = $_POST['aliquota_ipi'];
    $cst_issqn = $_POST['cst_issqn'];
    $aliquota_issqn = $_POST['aliquota_issqn'];
    $base_issqn = $_POST['base_issqn'];
    $descontar_iss = $_POST['descontar_iss'];
    $cst_pis = $_POST['cst_pis'];
    $base_pis = $_POST['base_pis'];
    $cst_cofins = $_POST['cst_cofins'];
    $base_cofins = $_POST['base_cofins'];
    $aliquota = $_POST['aliquota'];

    // Cria a instância do FPDF
    $pdf = new FPDF();
    $pdf->AddPage();
    
    // Configurações do PDF
    $pdf->SetFont('Arial', 'B', 16);
    $pdf->Cell(200, 10, 'Formulario de Regime Tributario Simples Nacional', 0, 1, 'C');
    $pdf->Ln(10);

    // Adiciona o conteúdo do formulário ao PDF
    $pdf->SetFont('Arial', '', 12);
    
    // Adiciona os dados do formulário
    $pdf->Cell(0, 10, "Código de Situação da Operação no Simples Nacional (CSOSN): $csosn", 0, 1);
    $pdf->Cell(0, 10, "CFOP: $cfop", 0, 1);
    $pdf->Cell(0, 10, "Situação Tributária (CST) - IPI: $cst_ipi", 0, 1);
    $pdf->Cell(0, 10, "Alíquota IPI: $aliquota_ipi", 0, 1);
    $pdf->Cell(0, 10, "Situação Tributária (CST) - ISSQN: $cst_issqn", 0, 1);
    $pdf->Cell(0, 10, "Alíquota ISSQN: $aliquota_issqn", 0, 1);
    $pdf->Cell(0, 10, "Base (%) - ISSQN: $base_issqn", 0, 1);
    $pdf->Cell(0, 10, "Descontar ISS: $descontar_iss", 0, 1);
    $pdf->Cell(0, 10, "Situação Tributária (CST) - PIS: $cst_pis", 0, 1);
    $pdf->Cell(0, 10, "Base (%) - PIS: $base_pis", 0, 1);
    $pdf->Cell(0, 10, "Situação Tributária (CST) - COFINS: $cst_cofins", 0, 1);
    $pdf->Cell(0, 10, "Base (%) - COFINS: $base_cofins", 0, 1);
    $pdf->Cell(0, 10, "Alíquota (%): $aliquota", 0, 1);

    // Gera o arquivo PDF
    $pdf->Output('D', 'Formulario_Fiscal.pdf');
}
?>
