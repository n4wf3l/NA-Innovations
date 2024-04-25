<!DOCTYPE html>
<html>
<head>
    <title>Créer une Publication</title>
</head>
<body>
    <h1>Créer une Publication</h1>

    @if ($errors->any())
        <div>
            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form method="POST" action="{{ route('posts.store') }}" enctype="multipart/form-data">
        @csrf
        <div>
            <label for="title">Titre:</label>
            <input type="text" name="title" id="title" value="{{ old('title') }}">
        </div>
        <div>
            <label for="subject">Sujet:</label>
            <input type="text" name="subject" id="subject" value="{{ old('subject') }}">
        </div>
        <div>
            <label for="description">Description:</label>
            <textarea name="description" id="description">{{ old('description') }}</textarea>
        </div>
        <div>
            <label for="photo">Photo:</label>
            <input type="file" name="photo" id="photo">
        </div>
        <button type="submit">Créer</button>
    </form>
</body>
</html>
