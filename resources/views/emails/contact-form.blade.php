<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nouvelle demande de contact</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        }
        h2 {
            color: #333;
        }
        p {
            color: #666;
            line-height: 1.6;
        }
        strong {
            color: #333;
        }
        .message {
            margin-top: 30px;
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Nouvelle demande de contact</h2>
        
        <p>Une nouvelle demande de contact a été reçue :</p>

        <div class="message">
            <p><strong>Nom:</strong> {{ $formData['name'] }}</p>
            <p><strong>Email:</strong> {{ $formData['email'] }}</p>
            <p><strong>Type de demande:</strong> {{ $formData['service'] }}</p>
            <p><strong>Budget estimé:</strong> €{{ $formData['budget'] }}</p>
            <p><strong>Message:</strong></p>
            <p>{{ $formData['message'] }}</p>
        </div>
    </div>
</body>
</html>

