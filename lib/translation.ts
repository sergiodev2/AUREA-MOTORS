import OpenAI from "openai"
import { translate } from 'google-translate-api-x';

const openai = process.env.OPENAI_API_KEY
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null

export async function translateText(text: string, targetLocale: string): Promise<string> {
    if (!text) return "";

    // 1. Try OpenAI if Key exists
    if (openai) {
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: `You are a professional automotive translator. Translate the following vehicle description into ${targetLocale}. Keep technical terms accurate. Return ONLY the translated text.`
                    },
                    {
                        role: "user",
                        content: text
                    }
                ],
                temperature: 0.3,
            })
            return response.choices[0]?.message?.content?.trim() || text
        } catch (error) {
            console.error(`OpenAI translation failed for ${targetLocale}, falling back to Google:`, error)
        }
    }

    // 2. Fallback to Free Google Translate
    try {
        console.log(`Translating to ${targetLocale} using Google Translate (Free)...`)
        const result = await translate(text, { to: targetLocale, forceBatch: false });
        // result.text contains the translation
        return result.text;
    } catch (error) {
        console.error(`Google translation failed for ${targetLocale}:`, error)
        return text // Final fallback
    }
}

export async function generateVehicleTranslations(description: string) {
    const locales = ['en', 'fr', 'de', 'es']
    const translations: Record<string, { description: string }> = {}

    // Run valid parallel promises
    await Promise.all(
        locales.map(async (locale) => {
            const translatedDesc = await translateText(description, locale)
            translations[locale] = {
                description: translatedDesc
            }
        })
    )

    return translations
}
