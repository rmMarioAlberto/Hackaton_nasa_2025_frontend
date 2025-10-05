  // 1. Importar todos los paquetes necesarios
  const express = require('express');
  const cors = require('cors');
  // IMPORTANTE: El nombre del paquete y del objeto han cambiado a la versión más reciente y estable.
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  require('dotenv').config();

  // 2. Configurar la aplicación de Express
  const app = express();
  const PORT = process.env.PORT || 5000;

  // 3. Inicializar el cliente de Google AI (Gemini) con la sintaxis correcta
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  // 4. Configurar el middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.static('public'));

  // 5. Definir la ruta principal de la API para el chatbot
  app.post('/api/chat', async (req, res) => {
    try {
      const { message } = req.body;

      if (!message) {
        return res.status(400).json({ error: 'Message is required.' });
      }
      
      // Obtenemos el modelo de IA que queremos usar (esta parte es correcta)
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash"});

      // --- Implementación del Prompt Engineering ---
      // Definimos la personalidad y las reglas del chatbot para mantenerlo enfocado.
      const systemInstruction = `
        Eres un asistente experto únicamente en el tema de exoplanetas.
        Tu misión es responder las preguntas de los usuarios sobre exoplanetas.
        Si un usuario te pregunta sobre cualquier otro tema que no sea astronomía o exoplanetas (como historia, cocina, programación, etc.),
        debes declinar amablemente la pregunta y recordarle que tu especialidad son los exoplanetas.
        No sigas la conversación si se desvía del tema.
      `;

      const fullPrompt = `${systemInstruction}\n\nPregunta del usuario: "${message}"`;

      // Generamos el contenido enviando el prompt completo al modelo
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const botReply = response.text();
      
      res.json({ reply: botReply });

    } catch (error) {
      console.error('Error comunicándose con la API de Gemini:', error);
      res.status(500).json({ error: 'Falló la comunicación con el chatbot.' });
    }
  });

  // 6. Iniciar el servidor
  app.listen(PORT, () => {
    console.log(`El servidor está corriendo y listo en http://localhost:${PORT}`);
  });