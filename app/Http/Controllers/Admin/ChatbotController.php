<?php

namespace App\Http\Controllers\Admin;

use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ChatbotController extends BaseAdminController
{
    public function index()
    {
        return Inertia::render('Admin/Settings/Chatbot', [
            'settings' => [
                'enabled' => Setting::get('chatbot.enabled', 'false') === 'true',
                'knowledge_text' => Setting::get('chatbot.knowledge_text', ''),
                'pdf_filename' => Setting::get('chatbot.pdf_filename', ''),
                'api_status' => $this->checkApiStatus(),
            ],
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'enabled' => 'required|boolean',
            'knowledge_text' => 'nullable|string|max:50000',
        ]);

        Setting::set('chatbot.enabled', $request->boolean('enabled') ? 'true' : 'false');
        if ($request->has('knowledge_text')) {
            Setting::set('chatbot.knowledge_text', $request->knowledge_text);
        }

        return redirect()->back()->with('success', 'Paramètres du chatbot mis à jour.');
    }

    public function uploadPdf(Request $request)
    {
        $request->validate(['pdf' => 'required|file|mimes:pdf,txt|max:5120']);

        $file = $request->file('pdf');
        $path = $file->store('chatbot', 'local');
        $filename = $file->getClientOriginalName();

        // Extract text for .txt files
        if ($file->getClientOriginalExtension() === 'txt') {
            $text = file_get_contents($file->getRealPath());
            Setting::set('chatbot.knowledge_text', $text);
        }

        Setting::set('chatbot.pdf_path', $path);
        Setting::set('chatbot.pdf_filename', $filename);

        return redirect()->back()->with('success', 'Fichier importé : ' . $filename);
    }

    public function testApi()
    {
        $status = $this->checkApiStatus();
        return response()->json($status);
    }

    private function checkApiStatus(): array
    {
        // Check Gemini first, then OpenAI
        $geminiKey = config('services.gemini.api_key');
        $openaiKey = config('services.openai.api_key');

        if ($geminiKey) {
            return $this->checkGemini($geminiKey);
        } elseif ($openaiKey) {
            return $this->checkOpenAI($openaiKey);
        }

        return ['status' => 'no_key', 'message' => 'Aucune clé API configurée'];
    }

    private function checkGemini(string $apiKey): array
    {
        try {
            $model = config('services.gemini.model', 'gemini-2.0-flash');
            $response = Http::timeout(10)->post(
                "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}",
                ['contents' => [['parts' => [['text' => 'Hi']]]]]
            );

            if ($response->successful()) return ['status' => 'active', 'message' => 'Gemini API fonctionnelle'];
            if ($response->status() === 429) return ['status' => 'quota_exceeded', 'message' => 'Quota Gemini dépassé'];
            if ($response->status() === 403) return ['status' => 'invalid_key', 'message' => 'Clé Gemini invalide'];
            return ['status' => 'error', 'message' => 'Erreur Gemini : ' . $response->status()];
        } catch (\Exception $e) {
            return ['status' => 'error', 'message' => 'Connexion Gemini échouée'];
        }
    }

    private function checkOpenAI(string $apiKey): array
    {
        try {
            $response = Http::withHeaders(['Authorization' => 'Bearer ' . $apiKey])
                ->timeout(10)->get('https://api.openai.com/v1/models');

            if ($response->successful()) return ['status' => 'active', 'message' => 'OpenAI API fonctionnelle'];
            if ($response->status() === 429) return ['status' => 'quota_exceeded', 'message' => 'Quota OpenAI dépassé'];
            if ($response->status() === 401) return ['status' => 'invalid_key', 'message' => 'Clé OpenAI invalide'];
            return ['status' => 'error', 'message' => 'Erreur OpenAI : ' . $response->status()];
        } catch (\Exception $e) {
            return ['status' => 'error', 'message' => 'Connexion OpenAI échouée'];
        }
    }
}
