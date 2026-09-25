import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'http://localhost:20128/v1', // Alamat 9Router lokal Anda
  apiKey: 'sk-69b6aca8967f2335-s5ottt-6dac8edb',  // Ganti dengan API Key yang dibuat di dashboard 9Router
  dangerouslyAllowBrowser: true         // Diperlukan karena berjalan langsung di sisi frontend (React)
});

export async function tanyaAI(promptUser) {
  try {
    const response = await openai.chat.completions.create({
      model: 'nama-combo-di-9router',      // Ganti dengan nama Combo yang ada di 9Router
      messages: [{ role: 'user', content: promptUser }],
    });
    
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Gagal terhubung ke AI via 9Router:", error);
    return "Maaf, terjadi kesalahan saat menghubungi AI.";
  }
}