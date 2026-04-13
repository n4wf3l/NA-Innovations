<?php

namespace App\Http\Controllers\Client;

use App\Models\PurchaseOrder;
use App\Services\PdfService;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PurchaseOrderController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Liste des bons de commande du client connecté.
     */
    public function index()
    {
        $purchaseOrders = PurchaseOrder::where('client_id', auth()->id())
            ->with('quote')
            ->latest()
            ->paginate(15);

        return Inertia::render('Client/PurchaseOrders/Index', [
            'purchaseOrders' => $purchaseOrders,
        ]);
    }

    /**
     * Télécharger le PDF du bon de commande.
     */
    public function downloadPdf(PurchaseOrder $po)
    {
        if ($po->client_id !== auth()->id()) {
            abort(403);
        }

        if (!$po->pdf_path || !Storage::disk('local')->exists($po->pdf_path)) {
            PdfService::generatePurchaseOrderPdf($po);
            $po->refresh();
        }

        return Storage::disk('local')->download($po->pdf_path, "{$po->po_number}.pdf");
    }
}
