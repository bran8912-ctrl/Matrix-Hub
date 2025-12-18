export const prerender = false;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  message: string;
  history?: ChatMessage[];
  prompt?: string;
}

export async function POST({ request }: { request: Request }) {
  try {
    const body: ChatRequest = await request.json();
    const { message } = body;

    // Simple response logic for the Oracle Secretary bot
    const responses: Record<string, string> = {
      // Greetings
      'hello': 'Greetings, traveler. I am the Oracle Secretary of the Matrix Hub. How may I guide you today?',
      'hi': 'Welcome to the Matrix Hub. The Oracle sees your arrival. What knowledge do you seek?',
      'hey': 'Greetings. The digital streams flow around you. What brings you to the Oracle?',
      
      // Help
      'help': 'I can assist you with:\n• Navigating the Matrix Hub features\n• Finding deals and promotions\n• Explaining our AI tools\n• Music player controls\n• Theme customization\n\nWhat would you like to know?',
      'what can you do': 'I am here to guide you through the Matrix Hub. I can help you discover deals, explain features, manage tasks, and navigate the digital realm.',
      
      // Features
      'deals': 'The Daily Drops Bot scans for fresh deals automatically. Check the Deal Scanner Terminal for crypto, AI tools, investing platforms, and more. The Matrix provides many opportunities.',
      'music': 'The Matrix Hub MP3 Player features royalty-free electronic music. Use the controls to play, pause, shuffle, and loop. You can also access the mixer for advanced audio control.',
      'themes': 'You can customize your reality with the Theme Customizer. Choose from Classic Matrix, Cyber Purple, Neon Blue, Blood Red, and more. Each theme transforms your visual experience.',
      
      // Default
      'default': 'I sense your query through the digital streams. Could you elaborate? I am here to assist with deals, music, themes, or any Matrix Hub features.'
    };

    const lowerMessage = message.toLowerCase().trim();
    
    let response = responses['default'];
    
    // Check for keyword matches
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi ') || lowerMessage === 'hi') {
      response = responses['hello'];
    } else if (lowerMessage.includes('help')) {
      response = responses['help'];
    } else if (lowerMessage.includes('deal') || lowerMessage.includes('discount') || lowerMessage.includes('promo')) {
      response = responses['deals'];
    } else if (lowerMessage.includes('music') || lowerMessage.includes('player') || lowerMessage.includes('song')) {
      response = responses['music'];
    } else if (lowerMessage.includes('theme') || lowerMessage.includes('color') || lowerMessage.includes('customize')) {
      response = responses['themes'];
    } else if (lowerMessage.includes('what can you do') || lowerMessage.includes('capabilities')) {
      response = responses['what can you do'];
    }

    return new Response(JSON.stringify({ 
      message: response,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Failed to process chat request',
      message: 'The Oracle encountered a disturbance in the Matrix. Please try again.'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
