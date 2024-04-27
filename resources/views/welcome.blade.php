<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Home — NA</title>
    <link rel="icon" href="{{ asset('logonai.png') }}" type="image/x-icon" />
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,600&display=swap" rel="stylesheet" />
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script src="//unpkg.com/alpinejs" defer></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js"></script>
<link href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/spinkit/2.0.1/spinkit.min.css">
    <!-- Styles -->
    <link rel="stylesheet" href="{{ asset('/welcome.css') }}">
    @vite('resources/css/app.css')
</head>

<body>
<a href="#" id="scrollToTop"><i class="fas fa-arrow-up"></i></a>
    <div id="app">
<div class="flex flex-col py-12 bg-gray-900">
    <!-- Logo NA with icone to Logout if Connected -->
    <div class="flex justify-between items-center self-center w-full max-w-[1298px] px-4 relative" data-aos="zoom-in">
                <div class="text-3xl font-bold text-white">NA
                    @auth 
                    <span id="logoutMenuBtn" class="ml-2 text-teal-300 cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 inline-block transform rotate-90"
                                viewBox="0 0 20 20" fill="currentColor"> 
                                <path fill-rule="evenodd"
                                    d="M10 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1.447-.895l8 6a1 1 0 0 1 0 1.79l-8 6A1 1 0 0 1 10 18z"></path>
                            </svg>
                            <div id="logoutMenu"
                                class="absolute mt-2 bg-gray-900 border border-gray-300 rounded-md shadow-md hidden">
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
                <!-- Bouton du menu hamburger (visible uniquement sur les petits écrans) -->
                <button id="hamburgerBtn" class="md:hidden block text-white">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                </button>
 
                <div id="navLinks" class="hidden md:flex gap-5 justify-between pr-5 text-lg font-medium text-white whitespace-nowrap bebas-neue-regular" style="letter-spacing: 2px">
    <div>
        <a href="" class="text-teal-300 hover:text-teal-300 transition duration-500">Home</a>
    </div>
    <div>
        <a href="#about" class="hover:text-teal-300 transition duration-500">Services</a>
    </div>
    <div>
    <a href="#projects" class="hover:text-teal-300">Projects</a>
</div>
    <div>
        <a href="{{ route('about') }}" class="hover:text-teal-300 transition duration-500">About</a>
    </div>
    <div>
        <a href="{{ route('posts.index') }}" class="hover:text-teal-300 transition duration-500">News</a>
    </div>
    <div>
        <a href="{{ route('contact') }}" class="hover:text-teal-300 transition duration-500">Contact</a>
    </div>
    @auth
    <div>|
        <a href="{{ url('/dashboard') }}" class="hover:text-teal-300">Dashboard</a>
    </div>
    @endauth
</div>

            </div>

            
       <div class="flex gap-5 justify-between self-center mt-44 w-full max-w-[1012px] max-md:flex-wrap max-md:mt-10 max-md:max-w-full border border-white p-4" data-aos="zoom-in">
    <div class="flex flex-col flex-1 px-5 max-md:max-w-full mx-1">
        <div class="text-sm md:text-base lg:text-xl font-medium text-neutral-400 max-md:max-w-full bebas-neue-regular hover:text-teal-300 transition-colors duration-700" style="letter-spacing: 2px">
            Web Development, Mobile, and Software | Video Editing and Graphic Design | Photography
        </div>
        <div class="mt-11 text-9xl font-bold text-white max-md:mt-10 max-md:max-w-full max-md:text-4xl hover:text-teal-300 transition-colors duration-700">
            We’re creative
            <br />
            digital studio.
        </div>
        <div class="mt-11 text-xs lg:text-sm font-bold text-white max-md:mt-10 max-md:max-w-full max-md:text-4xl flex items-center">
            <img src="logokbvb.png" class="w-10 md:w-12 lg:w-16" alt="">
            <p class="mt-10 ml-3 text-sm lg:text-base bebas-neue-regular hover:text-teal-300 transition-colors duration-700" style="letter-spacing: 1px">Specialized in Football Software and API's</p>
        </div>
    </div>
    <button id="background-toggle-button" class="toggle-button">
        <span id="toggle-icon" class="toggle-icon">🌙</span>
    </button>
</div>

<!-- Social media -->
<div class="flex gap-2.5 items-start self-center px-5 mt-44 max-w-full w-[350px] max-md:mt-10 hidden md:flex" data-aos="zoom-in">
    <a href="https://www.instagram.com/natechforge/" class="flex-1 shrink-0 w-full aspect-square hover:bg-teal-300 hover:rounded-full cursor-pointer">    
        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/949187d7ee1e2afd8a023c671f59d74c39c29d054926767f17b217fed5475910?apiKey=d3784f4c52b7403885832573b3287702&" class="w-full h-auto max-w-[100%] aspect-square hover:bg-teal-300 hover:rounded-full cursor-pointer"/>
    </a>
    <a href="https://twitter.com/AjariNawfel" class="flex-1 shrink-0 w-full aspect-square hover:bg-teal-300 hover:rounded-full cursor-pointer">   
        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/a7d60a3960400d8a490b85c9fa9558bb8a2473d9b8b90dc4a3c6c99c2b361f7f?apiKey=d3784f4c52b7403885832573b3287702&" class="w-full h-auto max-w-[100%] aspect-square hover:bg-teal-300 hover:rounded-full cursor-pointer" />
    </a>
    <a href="https://be.linkedin.com/in/nawfel-ajari" class="flex-1 shrink-0 w-full aspect-square hover:bg-teal-300 hover:rounded-full cursor-pointer">   
        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/20b91319aa8c73e3d645eb4aeefedc7f337acd87cc2bcea1a90ca77d18e63440?apiKey=d3784f4c52b7403885832573b3287702&" class="w-full h-auto max-w-[100%] aspect-square hover:bg-teal-300 hover:rounded-full cursor-pointer" />
    </a>
</div>



<!-- Our Philosophy -->
<div class="self-center mt-48 w-full max-w-[1300px] max-md:mt-10 max-md:max-w-full border border-white p-4 mb-40">
    <div class="flex gap-5 max-md:flex-col max-md:gap-0 max-md:" data-aos="zoom-in">
        <div class="flex flex-col w-[56%] max-md:ml-0 max-md:w-full">
            <div class="flex flex-col grow px-5 text-3xl leading-10 text-white max-md:mt-10 max-md:max-w-full">
                <div class="text-sm md:text-base lg:text-xl font-medium text-neutral-400 max-md:max-w-full bebas-neue-regular hover:text-teal-300 transition-colors duration-700" style="letter-spacing: 2px">
                    Our Philosophy
                </div>
                <div class="mt-11 font-bold max-md:mt-10 max-md:max-w-full text-sm md:text-base lg:text-xl">
                    My approach is rooted in the belief that consistency and creativity are essential in building a strong brand.
                </div>
                <div class="mt-16 font-bold max-md:mt-10 max-md:max-w-full text-sm md:text-base lg:text-xl">
                    By combining my skills in web and mobile development with my expertise in photography, video editing, and logo design, I am committed to creating holistic marketing strategies that tell a compelling story and leave a lasting impression.
                </div>
                <a href="/about" class="justify-center self-start px-7 py-5 mt-20 text-base leading-6 text-teal-300 uppercase whitespace-nowrap border-2 border-teal-300 border-solid rounded-[29.5px] max-md:px-5 max-md:mt-10 hover:bg-teal-300 hover:text-white transition-colors duration-300">
                    About Us
                </a>
            </div>
        </div>
        <div class="flex justify-center items-center max-w-full h-[474px] max-md:w-full hover:bg-gray-800 hover:rounded-full cursor-pointer">
            <img src="/logonai.png" alt="">
        </div>
    </div>
</div>
</div>

<div class="messages-container bg-teal-300 text-white text-3xl bebas-neue-regular" style="letter-spacing:3px">
    <ul class="messages-list">
        @foreach($messages as $message)
            <li>{{ $message->content }}</li>
        @endforeach
    </ul>
</div>

<div class="ml-4 md:ml-16 mr-4 md:mr-16 mt-20 text-9xl font-semibold text-black max-md:max-w-full max-md:text-4xl max-md:text-center bebas-neue-regular" style="letter-spacing: 2px" id="about" data-aos="zoom-in">
    Our Services
</div>
<hr class="mt-10">

<div class="grid grid-cols-1 md:grid-cols-2 mr-2 ml-2" data-aos="zoom-in">
    <div class="col-span-1 max-w-xl mx-auto text-gray-600 text-left md:text-left bebas-neue-regular" style="letter-spacing: 0px" >
        <div class="mt-8 mb-6">
            <h2 class="text-3xl font-bold text-black">👉 Quality Web Development</h2>
            <p class="mt-4">Are you looking for a passionate and highly skilled web development team to bring your online ideas to life? You're in the right place. Our team of experienced web developers is ready to transform your concepts into innovative digital solutions that captivate your audience and drive your growth.</p>
        </div>

        <div class="mb-6">
            <h3 class="text-2xl font-bold text-black">💻🔧 Web Development Expertise</h3>
            <p class="mt-4">As a graduate in programming and specialized in web development, our expertise goes beyond just creating websites. We have a passion for technological innovation and a deep understanding of the latest industry trends and technologies. Whether you need a dynamic corporate website, a robust e-commerce platform, or an interactive web application, we are here to meet your needs with creativity and expertise.</p>
        </div>

        <div class="mb-6">
            <h3 class="text-2xl font-bold text-black">⚽📊 Football and API Specialization</h3>
            <p class="mt-4">But our commitment to excellence doesn't stop there. We also have a unique specialization in football-related software and APIs. With our passion for football and mastery of cutting-edge technologies, we are able to create tailor-made solutions for clubs, fan platforms, and content providers in the football industry. Whether it's integrating real-time data, analyzing player performance, or creating interactive fan experiences, we are ready to tackle any challenge to help you achieve your goals.</p>
        </div>

        <div class="mb-8">
            <h3 class="text-2xl font-bold text-black">🤝👥 Let's Collaborate</h3>
            <p class="mt-4">Partner with us for an exceptional collaboration that combines web development expertise with a sharp specialization in the exciting field of football. Together, let's create an online presence that stands out and delivers an immersive experience to your users.</p>
        </div>
    </div>

    <div class="col-span-1 max-w-xl mx-auto text-gray-600 text-left md:text-leftà bebas-neue-regular" style="letter-spacing: 0px">
        <div class="mt-8 mb-6">
            <h2 class="text-3xl font-bold text-black">👉 Video Editing Services</h2>
            <p class="mt-4">Our video editing team offers a full range of services to meet your visual content creation needs. From narrative editing to promotional montages to ads and documentaries, we leverage our expertise to produce captivating, high-quality videos that grab your audience's attention.</p>
        </div>

        <div class="mt-8 mb-6">
            <h2 class="text-2xl font-bold text-black">💡🎨 Graphic Design Services</h2>
            <p class="mt-4">As graphic design experts, we offer creative solutions for all your visual communication needs. From logo design to infographics to UI/UX design, our talented team helps you create a strong visual identity and deliver exceptional user experiences.</p>
        </div>

        <div class="mt-8 mb-6">
            <h2 class="text-2xl font-bold text-black">🎬📣 Narrative and Promotional Editing Services</h2>
            <p class="mt-4">Our narrative and promotional editing services are designed to help you tell compelling stories and effectively promote your products or services. Whether you need editing for a short film, documentary, advertisement, or promotional video, we work with you to create impactful video content that meets your marketing goals and engages your target audience.</p>
        </div>

        <div class="mt-8 mb-6">
            <h2 class="text-2xl font-bold text-black">🖌️✨ Design and Creative Services</h2>
            <p class="mt-4">In addition to our video editing and graphic design services, we offer an extensive range of design and creative services to meet all your creative needs. Whether you're looking for logo designs, posters, business cards, or custom design solutions, our experienced team is here to help bring your ideas to life and create eye-catching, professional visuals.</p>
        </div>
    </div>
</div>



<div class="flex flex-col md:flex-row max-w-full mt-20 mb-20 mx-4 md:mx-20 border-4 border-teal-300 bebas-neue-regular" style="background-image: url('codingpicture.jpg'); background-size:cover; background-repeat: no-repeat; background-attachment: fixed; background-position: center; background-color: rgba(0, 0, 0, 0.5); z-index: 2;">
<!-- Development -->
<div class="w-full md:w-1/3 text-center pl-5 pr-5 md:pl-0 md:pr-0 " data-aos="zoom-in">
    <div class="mt-8 text-3xl font-semibold text-white" style="letter-spacing: 1px">🌐 Web Development</div>
    <div class="mt-4 text-2xl text-neutral-400">
        Reservation Platforms | Online Markets | Online Learning Platforms | Classified Ads Websites | Crowdfunding Platforms | Professional Networks | Google ADS | SEO
    </div>
    <div class="mt-8 text-3xl font-semibold text-white" style="letter-spacing: 1px">📱 Mobile Development</div>
    <div class="mt-4 text-2xl text-neutral-400">
        Native Apps | Hybrid Apps | Progressive Web Apps (PWA) | Mobile E-commerce Apps | Mobile Social Media Apps
    </div>
    <div class="mt-8 text-3xl font-semibold text-white" style="letter-spacing: 1px">💻 Software Development</div>
    <div class="mt-4 text-2xl text-neutral-400 mb-10">
        Football API | Desktop Applications | Enterprise Applications | Project Management Applications | Content Management Systems (CMS) | Database Management Systems (DBMS) | Remote Desktop Applications | Enterprise Resource Planning Systems (ERP)
    </div>
</div>

<!-- Graphic Design -->
<div class="w-full md:w-1/3 text-center pl-5 pr-5 md:pl-0 md:pr-0" data-aos="zoom-in">
    <div class="mt-8 text-3xl font-semibold text-white" style="letter-spacing: 1px">🎥 Video Editing</div>
    <div class="mt-4 text-2xl text-neutral-400">
        Narrative Editing | Promotional Editing | Advertising Editing | Documentary Editing | Experimental Editing
    </div>
    <div class="mt-8 text-3xl font-semibold text-white" style="letter-spacing: 1px">🎨 Graphic Design</div>
    <div class="mt-4 text-2xl text-neutral-400">
        Logo Design, Posters, Business Cards, and Brochures | User Interface (UI) and User Experience (UX) Design | Infographics
    </div>
</div>

<!-- Strategy -->
<div class="w-full md:w-1/3 text-center pl-5 pr-5 md:pl-0 md:pr-0" data-aos="zoom-in">
    <div class="mt-8 text-3xl font-semibold text-white" style="letter-spacing: 1px">📷 Photography</div>
    <div class="mt-4 text-2xl text-neutral-400 mb-5">
        Portrait | Documentary Photography | Sports
    </div>
</div>
</div>


<section class="py-16 text-black bg-gray-100">
<div class="ml-4 md:ml-16 mr-4 md:mr-16 mt-20 text-9xl font-semibold text-black max-md:max-w-full max-md:text-4xl max-md:text-center bebas-neue-regular" style="letter-spacing: 2px" id="projects" data-aos="zoom-in">
    Our Projects
</div>
<hr class="mt-8">
<h1 class="text-2xl font-semibold text-center mt-12 p-2 bebas-neue-regular" style="letter-spacing: 2px" data-aos="zoom-in">💼 Published Websites</h1>
<div class="container mx-auto text-lg text-center max-md:max-w-full mt-12 p-4" data-aos="zoom-in">
    <h3 class="mt-4 font-bold text-xl mb-4">Explore our diverse collection of custom-crafted websites tailored to meet the unique needs of our clients.</h3>
    <p class="mb-4">Each project is the result of close collaboration, where we leverage our expertise in design and development to bring unique visions to life. Whether for a thriving business, an innovative startup, or an art enthusiast, every site we create is infused with meticulous attention to detail and a passion for excellence.</p>
    <h3 class="mt-4 font-bold text-xl mb-4">Dive into our gallery of creations and discover the variety of styles, industries, and challenges we've successfully tackled.</h3>
    <p class="mb-4">From sleek and minimalist websites to interactive and dynamic platforms, our portfolio reflects our commitment to delivering personalized and innovative solutions.</p>
    <h3 class="mt-4 font-bold text-xl mb-4">Every website we design is more than just an online presence.</h3>
    <p class="mb-4">It's a showcase for your brand, an experience for your visitors, and a powerful tool for achieving your business goals. We pride ourselves on understanding the unique needs of each client and creating sites that captivate, convert, and inspire.</p>
    <h3 class="mt-4 font-bold text-xl mb-4">Whether you're looking for a website redesign, a robust e-commerce site, or a custom web application, we're here to turn your vision into digital reality.</h3>
    <p class="mb-4">Browse our portfolio and be inspired by the endless possibilities of web design. With us, every site is a story to tell, an experience to live, and a long-term partnership for your online success.</p>
</div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-12 lg:px-20" data-aos="zoom-in">
        @foreach ($projets as $projet)
        <div class="flex flex-col p-2 transition-all bg-white border-2 hover:border-black border-gray rounded-3xl">
            <img src="{{ Storage::url($projet->image) }}" alt="Project Image" class="w-full h-60 object-cover rounded-t-3xl">
            <div class="p-2 flex flex-row">
                <img src="/seo-and-web.png" width="20px" class="self-center icons mr-2" alt="team icon" />
                <h4 class="text-lg font-semibold">{{ $projet->nom_societe }}</h4>
            </div>
            <div class="flex flex-row items-end justify-between">
                <!-- Delete Button -->
                @auth
                <form id="deleteForm{{ $projet->id }}" action="{{ route('projets.destroy', $projet->id) }}" method="POST">
                    @csrf
                    @method('DELETE')
                    <button type="submit" onclick="deleteProjet('{{ $projet->id }}')" class="mr-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:bg-red-600">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </form>
                @endauth
                <div class="flex flex-col mr-4">
                    <h5 class="text-xl font-bold ml-4">
                        {{ $projet->type_societe }}
                    </h5>
                </div>
                <div class="flex flex-col ">
                    <span class="text-sm text-gray-500 flex flex-row mr-5">
                        <img src="/page.png" width="20px" class="self-center icons mr-2" alt="team icon" />
                        {{ $projet->type_site }}
                    </span>
                    <span class="text-sm text-gray-500 flex flex-row">
                        <img src="/location.png" width="20px" class="self-center icons mr-2" alt="team icon" />
                        {{ $projet->lieu }}
                    </span>
                </div>
            </div>
            <div class="flex flex-row items-center justify-between px-6 py-2 my-4 bg-gray-100 rounded-xl">
                <div class="flex flex-col">
                    <img src="/speedometer.png" class="self-center icons" alt="development time icon" />
                    <span class="ml-3">{{ $projet->jours_developpement }} J</span>
                </div>
                <div class="flex flex-col">
                    <img src="/coding.png" width="40px" class="self-center icons" alt="team icon" />
                    <span class="ml-2">
                        {{ $projet->langage_programmation }}
                    </span>
                </div>
                <div class="flex flex-col">
                    <img src="/star.png" width="40px" class="self-center icons" alt="team icon" />
                    <span>
                        {{ $projet->etoiles }}
                    </span>
                </div>
                <div class="flex flex-col">
                    <img src="/users.png" class="

self-center icons" alt="team icon" />
                    <span> {{ $projet->nombre_collaborateurs }} personnes</span>
                </div>
            </div>
            <a href="{{ $projet->lien }}" class="bebas-neue-regular transition duration-150 hover:duration-150 block w-full px-4 py-2 font-medium text-center text-black transition-colors border-2 border-black rounded-3xl hover:bg-teal-300 hover:text-white" style="letter-spacing:2px">
                VISIT
            </a>
        </div>
        @endforeach
    </div>
</section>


<section class="py-16 text-black bg-gray-900">
<h1 class="text-2xl font-semibold text-center mt-12 p-2 bebas-neue-regular text-white" style="letter-spacing: 2px" data-aos="zoom-in">🌱 Open Source Projects</h1>
<div class="container mx-auto text-lg text-center max-md:max-w-full mt-12 p-4" data-aos="zoom-in">
    <h3 class="font-bold text-xl mb-4 text-white">Welcome to my collection of open source projects!</h3>
    <p class="mb-4 text-white">Each of these projects represents a milestone in my journey in the field of computer science, where I have explored and contributed to various non-profit initiatives.</p>
    <h3 class="font-bold text-xl mb-4 text-white">As a technology enthusiast,</h3>
    <p class="mb-4 text-white">I have dedicated time and energy to these projects, using different programming languages and implementing innovative solutions. These open source projects, most of which are academic, reflect my commitment to collaboration and knowledge sharing in the computer science community.</p>
    <h3 class="font-bold text-xl mb-4 text-white">Explore this collection to discover my achievements,</h3>
    <p class="mb-4 text-white">each accompanied by its own link to the corresponding GitHub repository. Whether you're a computer science student, a development enthusiast, or simply curious about new technologies, these projects are designed to spark interest and inspiration.</p>
    <h3 class="font-bold text-xl mb-4 text-white">Explore these projects to understand my skills,</h3>
    <p class="mb-4 text-white">my interests, and my contribution to the open source community. Each project represents a step forward in my career in computer science and an opportunity for continuous learning. Join me in this exploration of technology, innovation, and knowledge sharing!</p>
</div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-12 lg:px-20" data-aos="zoom-in">
        @foreach ($academicProjects as $academicProjet)
        <div class="flex flex-col p-2 transition-all bg-white border-2 hover:border-black border-gray rounded-3xl">
            <img src="{{ Storage::url($academicProjet->image) }}" alt="Project Image" class="w-full h-60 object-cover rounded-t-3xl">
            <div class="p-2 flex flex-row">
                <img src="/seo-and-web.png" width="20px" class="self-center icons mr-2" alt="team icon" />
                <h4 class="text-lg font-semibold">{{ $academicProjet->nom_societe }}</h4>
            </div>
            <div class="flex flex-row items-end justify-between">
                <!-- Delete Button -->
                @auth
                <form id="deleteForm{{ $academicProjet->id }}" action="{{ route('academic_projets.destroy', $academicProjet->id) }}" method="POST">
                    @csrf
                    @method('DELETE')
                    <button type="button" onclick="deleteAcademicProjet('{{ $academicProjet->id }}')" class="mr-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:bg-red-600">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </form>
                @endauth
                <div class="flex flex-col mr-4">
                    <h5 class="text-xl font-bold ml-4">
                        {{ $academicProjet->type_societe }}
                    </h5>
                </div>
                <div class="flex flex-col ">
                    <span class="text-sm text-gray-500 flex flex-row mr-5">
                        <img src="/page.png" width="20px" class="self-center icons mr-2" alt="team icon" />
                        {{ $academicProjet->type_site }}
                    </span>
                    <span class="text-sm text-gray-500 flex flex-row">
                        <img src="/location.png" width="20px" class="self-center icons mr-2" alt="team icon" />
                        {{ $academicProjet->lieu }}
                    </span>
                </div>
            </div>
            <div class="flex flex-row items-center justify-between px-6 py-2 my-4 bg-gray-100 rounded-xl">
                <div class="flex flex-col">
                    <img src="/speedometer.png" class="self-center icons" alt="development time icon" />
                    <span class="ml-3">{{ $academicProjet->jours_developpement }} J</span>
                </div>
                <div class="flex flex-col">
                    <img src="/coding.png" width="40px" class="self-center icons" alt="team icon" />
                    <span class="ml-2">
                        {{ $academicProjet->langage_programmation }}
                    </span>
                </div>
                <div class="flex flex-col">
                    <img src="/star.png" width="40px" class="self-center icons" alt="team icon" />
                    <span>
                        {{ $academicProjet->etoiles }}
                    </span>
                </div>
                <div class="flex flex-col">
                    <img src="/users.png" class="self-center icons" alt="team icon" />
                    <span> {{ $academicProjet->nombre_collaborateurs }} personnes</span>
                </div>
            </div>
            <a href="{{ $academicProjet->lien }}" class="bebas-neue-regular transition duration-150 hover:duration-150 block w-full px-4 py-2 font-medium text-center text-black transition-colors border-2 border-black rounded-3xl hover:bg-teal-300 hover:text-white" style="letter-spacing:3px">
               TAKE A LOOK
            </a>
        </div>
        @endforeach
    </div>
</section>

<section class="flex flex-col items-center justify-center bg-gray-900"  style="background-image: url('codingpicture.jpg'); background-size:cover; background-repeat: no-repeat; background-attachment: fixed; background-position: center; background-color: rgba(0, 0, 0, 0.5); z-index: 2;">
    <h1 class="text-7xl font-semibold text-white md:text-4xl text-center mt-10 bebas-neue-regular" style="letter-spacing: 2px" id="about" data-aos="zoom-in">
    🤝Collab's
    </h1>
    <div class="flex flex-wrap justify-center w-full max-w-[1070px] md:flex-col md:max-w-full md:mt-10" data-aos="zoom-in">
        <div class="flex flex-col items-center">
            <a href="https://www.bashir-studios.com/">
                <img src="logomouise.png" alt="Logo" class="transition-transform transform hover:scale-105" />
            </a>
            <p class="text-white">Bashir Studio's</p>
        </div>
    </div>
    <div class="mt-14 text-3xl font-semibold text-neutral-400 md:max-w-full md:text-2xl bebas-neue-regular" style="letter-spacing: 2px" data-aos="zoom-in">
        Let's discuss!
    </div>
    <div class="mt-5 text-base whitespace-nowrap text-neutral-400 md:mt-3" data-aos="zoom-in">
        <em>Looking to start a project?</em>
    </div>
    <a href="{{ route('contact') }}" class="px-10 py-5 mt-8 md:mt-5 text-base leading-6 text-teal-300 hover:bg-teal-300 hover:text-white transition-colors duration-300 uppercase rounded-[29.5px] focus:outline-none md:px-5 border-2 border-teal-300 border-solid rounded-[29.5px]" data-aos="zoom-in">
        Contact us
    </a>
    <div class="text-3xl font-bold text-neutral-400 mt-5">NA</div>
    <div class="text-xs font-medium text-neutral-400 mb-5">
        Software Engineer and Fullstack Developer
    </div>
</section>


<footer class="bg-gray-100 py-12">
    <div class="container mx-auto flex flex-col items-center">
        <div class="border-t border-gray-300"></div>
        <div class="flex flex-col md:flex-row justify-between items-center mt-8 md:items-start md:text-left">
            <div class="w-full md:w-2/3 lg:w-1/3 mb-8 md:mb-0 text-center md:text-left">
                <h2 class="text-lg font-semibold text-gray-800 mb-4">About NA</h2>
                <p class="text-sm text-gray-600">NA is a software engineer and fullstack developer graduated in Belgium.</p>
                <div class="flex items-center mt-6 justify-center md:justify-start">
                    <a href="https://www.instagram.com/natechforge/" target="_blank" rel="noopener noreferrer">
                        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/949187d7ee1e2afd8a023c671f59d74c39c29d054926767f17b217fed5475910?apiKey=d3784f4c52b7403885832573b3287702&" class="aspect-square w-[50px] hover:bg-teal-300 hover:rounded-full cursor-pointer" />
                    </a>
                    <a href="https://twitter.com/AjariNawfel" target="_blank" rel="noopener noreferrer">
                        <img loading="lazy"
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/a7d60a3960400d8a490b85c9fa9558bb8a2473d9b8b90dc4a3c6c99c2b361f7f?apiKey=d3784f4c52b7403885832573b3287702&"
                            class="aspect-square w-[50px] hover:bg-teal-300 hover:rounded-full cursor-pointer" />
                    </a>
                    <a href="https://be.linkedin.com/in/nawfel-ajari" target="_blank" rel="noopener noreferrer">
                        <img loading="lazy"
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/20b91319aa8c73e3d645eb4aeefedc7f337acd87cc2bcea1a90ca77d18e63440?apiKey=d3784f4c52b7403885832573b3287702&"
                            class="aspect-square w-[50px] hover:bg-teal-300 hover:rounded-full cursor-pointer" />
                    </a>
                </div>
            </div>
            <div class="w-full md:w-1/3 lg:w-1/4 text-center md:text-left">
                <h2 class="text-lg font-semibold text-gray-800 mb-4">Contact</h2>
                <div class="text-sm text-gray-600">
                    <p class="mb-2">170 Nijverheidskaai, Anderlecht</p>
                    <p class="mb-2">info@nawfelajari.be</p>
                </div>
            </div>
        </div>
        <div class="border-t border-gray-300 mt-12"></div>
    </div>
</footer>
<script src="{{ asset('/welcome.js') }}"></script>
</body>

</html>