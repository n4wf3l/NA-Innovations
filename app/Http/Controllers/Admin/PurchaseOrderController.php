<?php

namespace App\Http\Controllers\Admin;

use App\Models\PurchaseOrder;
use App\Services\PdfService;
use Illuminate\Support\Facades\Storage;

class PurchaseOrderController extends BaseAdminController
{
    /**
     * Télécharger le PDF du bon de commande.
     */
    public function downloadPdf(PurchaseOrder $po)
    {
        if (!$po->pdf_path || !Storage::disk('local')->exists($po->pdf_path)) {
            PdfService::generatePurchaseOrderPdf($po);
            $po->refresh();
        }

        return Storage::disk('local')->download($po->pdf_path, "{$po->po_number}.pdf");
    }

    /**
     * Prévisualiser le PDF du bon de commande.
     */
    public function previewPdf(PurchaseOrder $po)
    {
        if (!$po->pdf_path || !Storage::disk('local')->exists($po->pdf_path)) {
            PdfService::generatePurchaseOrderPdf($po);
            $po->refresh();
        }

        return response(Storage::disk('local')->get($po->pdf_path), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline',
        ]);
    }
}
