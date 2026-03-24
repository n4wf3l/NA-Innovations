@props(['label', 'value', 'trend' => null, 'trendUp' => true])

<x-admin.card>
    <div class="p-6">
        <div class="flex items-center justify-between">
            <div>
                <p class="text-sm text-gray-500">{{ $label }}</p>
                <p class="mt-1 text-3xl font-bold text-gray-900">{{ $value }}</p>

                @if($trend)
                    <div class="mt-2 flex items-center text-sm">
                        @if($trendUp)
                            <svg class="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                            <span class="ml-1 text-emerald-600">{{ $trend }}</span>
                        @else
                            <svg class="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                            <span class="ml-1 text-red-600">{{ $trend }}</span>
                        @endif
                    </div>
                @endif
            </div>

            @if(isset($icon))
                <div class="bg-teal-300/10 text-teal-300 rounded-full p-3">
                    {{ $icon }}
                </div>
            @endif
        </div>
    </div>
</x-admin.card>
