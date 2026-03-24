@props(['headers' => []])

<div class="overflow-x-auto">
    <table class="w-full">
        <thead class="bg-gray-50">
            <tr>
                @foreach($headers as $header)
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {{ $header }}
                    </th>
                @endforeach
            </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
            {{ $slot }}
        </tbody>
    </table>
</div>
