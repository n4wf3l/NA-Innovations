<?php

namespace App\Helpers;

class StatusHelper
{
    public static function leadStatusColor(string $status): string
    {
        return match($status) {
            'new' => 'violet',
            'contacted' => 'blue',
            'brief_pending', 'brief_completed' => 'indigo',
            'call_scheduled', 'qualified' => 'cyan',
            'not_qualified' => 'gray',
            'quote_draft', 'quote_sent' => 'amber',
            'won' => 'emerald',
            'lost' => 'red',
            default => 'gray',
        };
    }

    public static function quoteStatusColor(string $status): string
    {
        return match($status) {
            'draft' => 'gray',
            'sent' => 'blue',
            'viewed' => 'indigo',
            'accepted' => 'emerald',
            'rejected' => 'red',
            'expired' => 'amber',
            default => 'gray',
        };
    }

    public static function invoiceStatusColor(string $status): string
    {
        return match($status) {
            'draft' => 'gray',
            'sent' => 'blue',
            'viewed' => 'indigo',
            'paid' => 'emerald',
            'partially_paid' => 'teal',
            'overdue' => 'red',
            'cancelled' => 'gray',
            'refunded' => 'amber',
            default => 'gray',
        };
    }

    public static function projectStatusColor(string $status): string
    {
        return match($status) {
            'planning' => 'violet',
            'in_progress' => 'blue',
            'review' => 'amber',
            'completed' => 'emerald',
            'on_hold' => 'gray',
            'cancelled' => 'red',
            default => 'gray',
        };
    }

    public static function commissionStatusColor(string $status): string
    {
        return match($status) {
            'estimated' => 'gray',
            'confirmed' => 'blue',
            'scheduled' => 'amber',
            'paid' => 'emerald',
            'cancelled' => 'red',
            default => 'gray',
        };
    }

    public static function serviceStatusColor(string $status): string
    {
        return match($status) {
            'active' => 'emerald',
            'expiring_soon' => 'amber',
            'expired' => 'red',
            'cancelled' => 'gray',
            'suspended' => 'red',
            default => 'gray',
        };
    }

    public static function formatStatus(string $status): string
    {
        return ucwords(str_replace('_', ' ', $status));
    }
}
