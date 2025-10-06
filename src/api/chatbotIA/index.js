
  // Se importa el modelo correcto de Exoplanet.
const Exoplanet = require('../models/mongodb/Exoplanet');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Toda la lógica se mueve a esta función del controlador.
const handleQuery = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    // --- PASO A: BÚSQUEDA MEJORADA EN MONGODB ---
    // Se busca una coincidencia del mensaje en varios campos de nombre relevantes para aumentar las posibilidades de éxito.
    const databaseResults = await Exoplanet.find(
      {
        // $or permite buscar en múltiples campos. La consulta tendrá éxito si encuentra el término en CUALQUIERA de ellos.
        $or: [
          { pl_name: new RegExp(message, 'i') },
          { hostname: new RegExp(message, 'i') },
          { k2_name: new RegExp(message, 'i') },
          { epic_hostname: new RegExp(message, 'i') },
          { hd_name: new RegExp(message, 'i') },
          { hip_name: new RegExp(message, 'i') }
        ]
      },
      // Se seleccionan campos clave para dar un contexto rico a la IA.
      'pl_name hostname discoverymethod disc_year pl_orbper pl_rade pl_masse sy_dist'
    ).limit(5); // Se limita a 5 resultados para no sobrecargar la respuesta.


    // --- PASO B: AUMENTACIÓN (AUGMENTATION) ---
    // Se prepara el contexto para la IA con los datos encontrados.
    let context = "No se encontró información en la base de datos sobre este exoplaneta.";
    if (databaseResults && databaseResults.length > 0) {
      context = `Se encontró la siguiente información en la base de datos para "${message}": ${JSON.stringify(databaseResults)}`;
    }

    // --- PASO C: GENERACIÓN (GENERATION) ---
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const systemInstruction = `
      Eres un asistente experto en exoplanetas. Tu única fuente de verdad es la "Información encontrada en la base de datos".
      - Si encuentras uno o más exoplanetas en la base de datos, presenta los resultados al usuario en una lista clara. Para cada uno, incluye su nombre (pl_name), la estrella que orbita (hostname) y el año de descubrimiento (disc_year). No inventes información.
      - Si la base de datos no arroja resultados (el contexto dirá "No se encontró información"), informa al usuario de manera concisa que no encontraste datos sobre ese exoplaneta en tu base de datos y que intente con otro nombre. No uses tu conocimiento general.
      - Si el usuario pregunta algo que no tiene nada que ver con exoplanetas, declina amablemente la pregunta.
    `;

    const fullPrompt = `${systemInstruction}\n\n${context}\n\nPregunta del usuario: "${message}"`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const botReply = response.text();
    
    res.json({ reply: botReply });

  } catch (error) {
    console.error('Error en la ruta del chatbot:', error);
    res.status(500).json({ error: 'Falló la comunicación con el chatbot.' });
  }
};

module.exports = { handleQuery };
