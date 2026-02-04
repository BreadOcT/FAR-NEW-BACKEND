
import { GoogleGenAI, Type } from "@google/genai";
import { SocialImpactData } from "../types";

export interface DetectedItem {
  name: string;
  category: 'Buah' | 'Sayur' | 'Protein' | 'Karbohidrat' | 'Olahan' | 'Roti' | 'Bumbu' | 'Lainnya';
}

export interface QualityAnalysisResult {
  isSafe: boolean;
  isHalal: boolean;
  halalScore: number;
  halalReasoning: string;
  reasoning: string; // Narasi utama analisis
  allergens: string[];
  shelfLifePrediction: string; 
  hygieneScore: number;
  qualityPercentage: number;
  detectedItems: DetectedItem[];
  detectedCategory: 'Daging Sapi' | 'Nasi' | 'Sayuran' | 'Buah' | 'Campuran' | 'Lainnya';
  storageTips: string[];
  socialImpact: SocialImpactData;
}

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const calculateSocialImpact = (category: string, weightGram: number, packagingType: string): SocialImpactData => {
  let eis = 65;
  let co2Factor = 3.0;
  let waterFactor = 650;
  let landFactor = 1.3;

  switch (category) {
    case 'Daging Sapi': eis = 100; co2Factor = 20.0; waterFactor = 800; landFactor = 1.5; break;
    case 'Nasi': eis = 70; co2Factor = 3.5; waterFactor = 700; landFactor = 1.2; break;
    case 'Sayuran': eis = 50; co2Factor = 1.5; waterFactor = 500; landFactor = 1.0; break;
    case 'Buah': eis = 60; co2Factor = 2.0; waterFactor = 600; landFactor = 1.1; break;
  }

  let packagingFactor = 1.0;
  if (packagingType === 'no-plastic') packagingFactor = 1.2;
  else if (packagingType === 'recycled') packagingFactor = 1.1;
  else if (packagingType === 'plastic') packagingFactor = 0.9;

  const quantityRatio = weightGram / 500;
  const qw = quantityRatio * packagingFactor;
  const totalPoints = Math.round((eis * qw));

  return {
    totalPoints,
    co2Saved: parseFloat((co2Factor * quantityRatio).toFixed(1)),
    waterSaved: Math.round(waterFactor * quantityRatio),
    landSaved: parseFloat((landFactor * quantityRatio).toFixed(1)),
    wasteReduction: weightGram / 1000,
    level: totalPoints > 500 ? "Expert" : "Aktif"
  };
};

export const analyzeFoodQuality = async (
  inputLabels: string[], 
  imageBase64?: string,
  context?: any
): Promise<QualityAnalysisResult> => {
  try {
    const ai = getAI();
    const parts: any[] = [];
    if (imageBase64) {
      const base64Data = imageBase64.split(',')[1] || imageBase64;
      parts.push({ inlineData: { mimeType: 'image/jpeg', data: base64Data } });
    }

    const currentTime = new Date().toLocaleString('id-ID');
    const prompt = `
      Anda adalah Auditor Kualitas Makanan Digital (Food AI Rescue).
      Tugas: Memberikan analisis visual mendalam terhadap makanan donasi.

      KONTEKS PRODUK:
      - Nama: ${context.foodName}
      - Bahan: ${context.ingredients}
      - Dibuat: ${context.madeTime}
      - Simpan: ${context.storageLocation}
      
      INSTRUKSI KHUSUS UNTUK 'reasoning':
      Wajib berikan deskripsi produk secara keseluruhan dalam MINIMAL SATU PARAGRAF utuh (3-5 kalimat). 
      Narasi harus menjelaskan:
      1. Kondisi visual makanan (warna, tekstur, tingkat kematangan yang terlihat).
      2. Hasil verifikasi antara foto dengan klaim deskripsi donatur.
      3. Penilaian higienitas penyajian berdasarkan objek yang terdeteksi.
      4. Kesimpulan kelayakan konsumsi secara persuasif dan profesional.

      Output JSON sesuai schema. Field 'reasoning' tidak boleh berisi placeholder.
    `;

    const schema = {
      type: Type.OBJECT,
      properties: {
        isSafe: { type: Type.BOOLEAN },
        isHalal: { type: Type.BOOLEAN },
        halalScore: { type: Type.INTEGER },
        halalReasoning: { type: Type.STRING },
        reasoning: { type: Type.STRING },
        allergens: { type: Type.ARRAY, items: { type: Type.STRING } },
        shelfLifePrediction: { type: Type.STRING },
        hygieneScore: { type: Type.INTEGER },
        qualityPercentage: { type: Type.INTEGER },
        detectedItems: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              category: { type: Type.STRING }
            },
            required: ["name", "category"]
          }
        },
        detectedCategory: { type: Type.STRING },
        storageTips: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["isSafe", "isHalal", "halalScore", "halalReasoning", "reasoning", "hygieneScore", "qualityPercentage"]
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [...parts, { text: prompt }] },
      config: { responseMimeType: "application/json", responseSchema: schema }
    });

    const aiResult = JSON.parse(response.text || '{}');
    const socialImpact = calculateSocialImpact(aiResult.detectedCategory, context?.weightGram || 500, context?.packagingType || 'plastic');

    return { ...aiResult, socialImpact };
  } catch (error: any) {
    return {
        isSafe: false, isHalal: false, halalScore: 0, halalReasoning: "Gagal", reasoning: "Sistem gagal memproses deskripsi audit.", 
        allergens: [], shelfLifePrediction: "-", hygieneScore: 0, qualityPercentage: 0, detectedItems: [], detectedCategory: 'Campuran', storageTips: [],
        socialImpact: { totalPoints: 0, co2Saved: 0, waterSaved: 0, landSaved: 0, wasteReduction: 0, level: 'Pemula' }
    };
  }
};
