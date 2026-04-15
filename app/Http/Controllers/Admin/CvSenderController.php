<?php

namespace App\Http\Controllers\Admin;

use App\Mail\TemplateMail;
use App\Models\AdminCv;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CvSenderController extends BaseAdminController
{
    public const MAX_FILES = 4;

    private const DEFAULT_SUBJECT = 'Candidature — {{ sender_name }}';
    private const DEFAULT_BODY = "<p>Bonjour,</p><p>Vous trouverez ci-joint mon CV pour votre considération.</p><p>Je reste à votre disposition pour toute question ou entretien.</p><p>Cordialement,<br>{{ sender_name }}</p>";

    public function index()
    {
        $cvs = AdminCv::orderBy('created_at', 'desc')->get()->map(fn ($cv) => [
            'id' => $cv->id,
            'name' => $cv->name,
            'size' => $cv->size,
            'created_at' => $cv->created_at?->toIso8601String(),
        ]);

        return Inertia::render('Admin/Settings/CvSender', [
            'cvs' => $cvs,
            'maxFiles' => self::MAX_FILES,
            'template' => [
                'subject' => Setting::get('cv_sender.subject', self::DEFAULT_SUBJECT),
                'body' => Setting::get('cv_sender.body', self::DEFAULT_BODY),
            ],
        ]);
    }

    public function upload(Request $request)
    {
        $request->validate([
            'cv' => 'required|file|mimes:pdf|max:10240',
        ]);

        if (AdminCv::count() >= self::MAX_FILES) {
            return redirect()->back()->with('error', __('Limite de :max CV atteinte. Supprimez-en un avant d\'en ajouter un nouveau.', ['max' => self::MAX_FILES]));
        }

        $file = $request->file('cv');
        $path = $file->store('cvs', 'local');

        AdminCv::create([
            'name' => $file->getClientOriginalName(),
            'file_path' => $path,
            'size' => $file->getSize(),
            'uploaded_by' => auth()->id(),
        ]);

        return redirect()->back()->with('success', __('CV ajouté avec succès.'));
    }

    public function destroy(AdminCv $cv)
    {
        if (Storage::disk('local')->exists($cv->file_path)) {
            Storage::disk('local')->delete($cv->file_path);
        }
        $cv->delete();

        return redirect()->back()->with('success', __('CV supprimé.'));
    }

    public function download(AdminCv $cv)
    {
        abort_unless(Storage::disk('local')->exists($cv->file_path), 404);
        return Storage::disk('local')->download($cv->file_path, $cv->name);
    }

    public function updateTemplate(Request $request)
    {
        $data = $request->validate([
            'subject' => 'required|string|max:255',
            'body' => 'required|string',
        ]);

        Setting::set('cv_sender.subject', $data['subject']);
        Setting::set('cv_sender.body', $data['body']);

        return redirect()->back()->with('success', __('Modèle d\'email mis à jour.'));
    }

    public function send(Request $request)
    {
        $data = $request->validate([
            'recipient_email' => 'required|email',
            'recipient_name' => 'nullable|string|max:255',
            'cv_id' => 'required|exists:admin_cvs,id',
            'subject' => 'nullable|string|max:255',
            'body' => 'nullable|string',
        ]);

        $cv = AdminCv::findOrFail($data['cv_id']);

        if (!Storage::disk('local')->exists($cv->file_path)) {
            return redirect()->back()->with('error', __('Le fichier CV est introuvable.'));
        }

        $sender = auth()->user();
        $subjectTemplate = $data['subject'] ?? Setting::get('cv_sender.subject', self::DEFAULT_SUBJECT);
        $bodyTemplate = $data['body'] ?? Setting::get('cv_sender.body', self::DEFAULT_BODY);

        $variables = [
            'sender_name' => $sender->name ?? '',
            'sender_email' => $sender->email ?? '',
            'recipient_name' => $data['recipient_name'] ?? '',
            'recipient_email' => $data['recipient_email'],
        ];

        $subject = self::replaceVariables($subjectTemplate, $variables);
        $body = self::replaceVariables($bodyTemplate, $variables);

        try {
            Mail::to($data['recipient_email'])->send(
                new TemplateMail($subject, $body, $cv->file_path, $cv->name)
            );
        } catch (\Exception $e) {
            Log::error("CvSenderController: Failed to send CV: {$e->getMessage()}");
            return redirect()->back()->with('error', __('Échec de l\'envoi : :error', ['error' => $e->getMessage()]));
        }

        return redirect()->back()->with('success', __('CV envoyé à :email.', ['email' => $data['recipient_email']]));
    }

    private static function replaceVariables(string $text, array $variables): string
    {
        foreach ($variables as $key => $value) {
            $text = preg_replace('/\{\{\s*' . preg_quote($key, '/') . '\s*\}\}/', $value ?? '', $text);
        }
        return $text;
    }
}
