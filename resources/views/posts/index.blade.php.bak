
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>News — NA</title>
    <link rel="icon" href="{{ asset('NAlogo2.png') }}" type="image/x-icon" />
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,600&display=swap" rel="stylesheet" />
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="//unpkg.com/alpinejs" defer></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js"></script>
<link href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css" rel="stylesheet">

    <!-- Styles -->
    <link rel="stylesheet" href="{{ asset('/posts.css') }}">
    @vite('resources/js/public.ts')
</head>

<body>
<div id="site">
        <!-- Header avec le logo et le menu hamburger (qui remplace les nav links sur les petits écrans) -->
        <div class="flex flex-col py-12 bg-gray-900">
            <div class="flex justify-between items-center self-center mt-1 w-full max-w-[1298px] px-4 relative" data-aos="zoom-in"> <!-- Ajoutez relative ici pour positionner les éléments absolus par rapport à celui-ci -->
                <div class="text-3xl font-bold text-white">NA
                    @auth <!-- Vérifie si l'utilisateur est connecté -->
                    <span id="logoutMenuBtn" class="ml-2 text-teal-300 cursor-pointer"> <!-- Ajoutez un ID pour le bouton de déconnexion -->
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 inline-block transform rotate-90"
                                viewBox="0 0 20 20" fill="currentColor"> <!-- Ajoute une icône de flèche déroulante -->
                                <path fill-rule="evenodd"
                                    d="M10 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1.447-.895l8 6a1 1 0 0 1 0 1.79l-8 6A1 1 0 0 1 10 18z"></path>
                            </svg>
                            <div id="logoutMenu"
                                class="absolute mt-2 bg-gray-900 border border-gray-300 rounded-md shadow-md hidden"> <!-- Utilisez top-full pour positionner le menu en dessous de la flèche déroulante -->
                                <a href="{{ route('logout') }}"
                                    class="block px-4 py-2 text-sm text-white hover:bg-red-800 hover:text-white transition duration-500" onclick="event.preventDefault(); document.getElementById('logout-form').submit();"> <!-- Lien de déconnexion -->
                                    {{ __('Log Out') }}
                                </a>
                                <form id="logout-form" action="{{ route('logout') }}" method="POST"
                                    style="display: none;">
                                    @csrf
                                </form>
                            </div>
                        </span>
                        @endauth
                </div>
                <button id="hamburgerBtn" class="md:hidden block text-white">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                </button>
                <div id="navLinks" class="hidden md:flex gap-5 justify-between pr-5 text-lg font-medium text-white whitespace-nowrap bebas-neue-regular" style="letter-spacing: 2px" ><div>
                <a href="{{ url('/') }}"  class="hover:text-teal-300">Home</a>
            </div>

            <div>
    <a href="{{ url('/') }}#about" class="hover:text-teal-300">Services</a>
</div>

<div>
    <a href="{{ url('/') }}#projects" class="hover:text-teal-300">Projects</a>
</div>

<div>
    <a href="{{ route('about') }}" class="hover:text-teal-300">About</a>
</div>

<div>
    <a href="{{ route('posts.index') }}" class="text-teal-300 hover:text-teal-300 transition duration-500">News</a>
</div>

<div>
    <a href="{{ route('contact') }}" class="hover:text-teal-300 border border-solid rounded-[20.5px] p-3"> <i class="fas fa-envelope"></i> Contact</a>
</div>

@auth
<div>
    | <a href="{{ url('/dashboard') }}"  class="hover:text-teal-300">Dashboard</a>
</div>
@endauth
    </div>
    </div>

    <div class="flex gap-5 justify-between self-center mt-44 w-full max-w-[1012px] max-md:flex-wrap max-md:mt-10 max-md:max-w-full w-full max-w-[1012px] mx-auto" data-aos="zoom-in">
                <div class="flex flex-col flex-1 px-5 max-md:max-w-full">
                    <div class="text-center mb-10 mt-11 text-9xl font-bold text-white max-md:mt-10 max-md:max-w-full max-md:text-4xl">
                        News
                    </div>
                    <div class="text-center mb-10 mt-11 text-4xl font-bold text-white max-md:mt-10 max-md:max-w-full max-md:text-2xl">
                    <em>Stay up-to-date with all my latest news and updates to get the full picture of my portfolio's evolution.</em>
                    </div>
                 <div class="hidden mt-10 md:flex flex-wrap gap-5 justify-between self-center mb-20 max-w-[1070px]">
        <img loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/88cfe832740fbad72af762269deeb7853d23d146e7bb9ebd24562abdc05bfcb1?apiKey=d3784f4c52b7403885832573b3287702&"
            class="flex-1 w-full aspect-[1.49] fill-sky-200" /> <img loading="lazy"
                                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/88cfe832740fbad72af762269deeb7853d23d146e7bb9ebd24562abdc05bfcb1?apiKey=d3784f4c52b7403885832573b3287702&"
                                class="flex-1 shrink-0 w-full aspect-[1.49] fill-sky-200" />
                    <img loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/88cfe832740fbad72af762269deeb7853d23d146e7bb9ebd24562abdc05bfcb1?apiKey=d3784f4c52b7403885832573b3287702&"
                            class="flex-1 shrink-0 w-full aspect-[1.49] fill-sky-200" />
                    <img loading="lazy"
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/88cfe832740fbad72af762269deeb7853d23d146e7bb9ebd24562abdc05bfcb1?apiKey=d3784f4c52b7403885832573b3287702&"
                            class="flex-1 shrink-0 w-full aspect-[1.49] fill-sky-200" />
                    <img loading="lazy"
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/88cfe832740fbad72af762269deeb7853d23d146e7bb9ebd24562abdc05bfcb1?apiKey=d3784f4c52b7403885832573b3287702&"
                            class="flex-1 shrink-0 w-full aspect-[1.49] fill-sky-200" />
                </div>
            </div>
        </div>

        <div class="flex flex-col items-center px-16 py-12 max-md:px-5 bg-gray-900 text-white">
    <div class="justify-center w-full max-w-[1267px] border border-white p-6" data-aos="zoom-in">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                @forelse ($posts as $post)
                    <div class="bg-white overflow-hidden shadow-md rounded-lg transition-transform transform hover:scale-105 hover:bg-gray-200">
                        @if ($post->photo)
                            <img class="w-full h-64 object-cover object-center" src="{{ asset('storage/' . $post->photo) }}" alt="Post Image">
                            <div class=" inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white font-bold text-lg">

            </div>
                        @endif
                        <div class="px-6 py-4">
                            <div class="font-bold text-xl mb-2 text-black">{{ $post->title }}</div>
                            <p class="text-gray-500 text-base">{{ Illuminate\Support\Str::limit($post->description, 100) }}</p>
                        </div>
                        <div class="px-6 py-4">
                            <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">#{{ $post->subject }}</span>
                            <a href="{{ route('posts.show', $post->id) }}" class="inline-block bg-gray-900 rounded-full px-3 py-1 text-sm font-semibold text-white hover:bg-teal-300 hover:text-gray-900">See Details</a>
                        </div>
                        @auth <!-- Check if the user is authenticated -->
                            <form action="{{ route('posts.destroy', $post->id) }}" method="POST" class="absolute top-2 right-2">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600">Delete</button>
                            </form>
                        @endauth
                    </div>
                @empty
                    <div class="col-span-full text-center py-16">
                        <p class="text-2xl text-gray-400 bebas-neue-regular" style="letter-spacing: 2px">No news published yet.</p>
                    </div>
                @endforelse
            </div>
        </div>

    </div>
</div>
</div>


@include('components.footer')
<script src="{{ asset('/posts.js') }}"></script>
</body>
</html>