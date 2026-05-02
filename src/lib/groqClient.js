import Groq from 'groq-sdk';

class GroqClient {
    constructor() {
        if (!process.env.GROQ_API_KEY) {
            console.warn('GROQ_API_KEY not found in environment variables');
            return;
        }

        this.client = new Groq({
            apiKey: process.env.GROQ_API_KEY,
        });

        this.models = {
            fast: 'llama3-8b-8192',      // Fast model for quick responses
            balanced: 'llama3-70b-8192',  // Balanced model for better quality
            creative: 'mixtral-8x7b-32768' // Creative model for diverse responses
        };
    }

    async generateRecommendations(userPreferences, restaurants, options = {}) {
        const {
            model = 'balanced',
            maxTokens = 1000,
            temperature = 0.7
        } = options;

        try {
            const prompt = this.buildRecommendationPrompt(userPreferences, restaurants);

            const completion = await this.client.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful restaurant recommendation AI that provides personalized suggestions based on user preferences and dining history.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                model: this.models[model],
                max_tokens: maxTokens,
                temperature: temperature,
            });

            return this.parseRecommendationResponse(completion.choices[0].message.content);
        } catch (error) {
            console.error('Groq API error:', error);
            throw new Error('Failed to generate AI recommendations');
        }
    }

    async generateReviewSummary(reviews, options = {}) {
        const {
            model = 'fast',
            maxTokens = 500,
            temperature = 0.3
        } = options;

        try {
            const prompt = this.buildReviewSummaryPrompt(reviews);

            const completion = await this.client.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: 'You are an AI that creates concise, helpful summaries of restaurant reviews, highlighting key themes and insights.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                model: this.models[model],
                max_tokens: maxTokens,
                temperature: temperature,
            });

            return completion.choices[0].message.content;
        } catch (error) {
            console.error('Groq API error:', error);
            throw new Error('Failed to generate review summary');
        }
    }

    async enhanceSearchQuery(query, context = {}) {
        const {
            model = 'fast',
            maxTokens = 200,
            temperature = 0.5
        } = context;

        try {
            const prompt = `
        Enhance this restaurant search query to be more specific and useful: "${query}"
        
        Consider:
        - Location context: ${context.location || 'not specified'}
        - User preferences: ${context.preferences || 'not specified'}
        - Time of day: ${context.timeOfDay || 'not specified'}
        
        Return only the enhanced search query, nothing else.
      `;

            const completion = await this.client.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: 'You are a search query enhancement AI that improves restaurant search queries to be more specific and useful.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                model: this.models[model],
                max_tokens: maxTokens,
                temperature: temperature,
            });

            return completion.choices[0].message.content.trim();
        } catch (error) {
            console.error('Groq API error:', error);
            return query; // Return original query if enhancement fails
        }
    }

    async generateRestaurantInsights(restaurantData, reviews) {
        try {
            const prompt = `
        Analyze this restaurant and its reviews to provide insights:
        
        Restaurant: ${restaurantData.name}
        Cuisine: ${restaurantData.cuisine}
        Rating: ${restaurantData.rating}/5
        Price Range: ${restaurantData.priceRange}
        
        Recent Reviews Summary:
        ${reviews.slice(0, 10).map(r => `- ${r.rating}/5: ${r.comment}`).join('\n')}
        
        Provide insights about:
        1. What customers love most
        2. Areas for improvement
        3. Best dishes/experiences
        4. Ideal customer type
        
        Keep it concise and actionable.
      `;

            const completion = await this.client.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: 'You are a restaurant analytics AI that provides actionable insights based on customer reviews and restaurant data.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                model: this.models.balanced,
                max_tokens: 800,
                temperature: 0.6,
            });

            return this.parseInsightsResponse(completion.choices[0].message.content);
        } catch (error) {
            console.error('Groq API error:', error);
            throw new Error('Failed to generate restaurant insights');
        }
    }

    buildRecommendationPrompt(userPreferences, restaurants) {
        return `
      Based on the user's preferences and available restaurants, provide personalized recommendations:
      
      User Preferences:
      - Favorite cuisines: ${userPreferences.favoriteCuisines?.join(', ') || 'Not specified'}
      - Price range: ${userPreferences.preferredPriceRange || 'Not specified'}
      - Dietary restrictions: ${userPreferences.dietaryRestrictions?.join(', ') || 'None'}
      - Previous ratings: Average ${userPreferences.averageRating || 'N/A'}
      
      Available Restaurants:
      ${restaurants.slice(0, 10).map(r =>
            `- ${r.name} (${r.cuisine}, ${'$'.repeat(r.priceRange)}, ${r.rating}/5)`
        ).join('\n')}
      
      Provide 3-5 personalized recommendations with brief explanations for each choice.
      Format as JSON: {"recommendations": [{"name": "Restaurant Name", "reason": "Why recommended"}]}
    `;
    }

    buildReviewSummaryPrompt(reviews) {
        return `
      Summarize these restaurant reviews, highlighting key themes:
      
      ${reviews.slice(0, 20).map(r =>
            `Rating: ${r.rating}/5 - ${r.comment}`
        ).join('\n')}
      
      Provide a concise summary covering:
      - Overall sentiment
      - Most praised aspects
      - Common complaints
      - Standout mentions
      
      Keep it under 150 words.
    `;
    }

    parseRecommendationResponse(response) {
        try {
            // Try to parse as JSON first
            const parsed = JSON.parse(response);
            return parsed.recommendations || [];
        } catch {
            // If not JSON, parse as text
            const lines = response.split('\n').filter(line => line.trim());
            return lines.map(line => ({
                name: line.split(':')[0]?.trim() || 'Unknown',
                reason: line.split(':')[1]?.trim() || 'AI recommended'
            }));
        }
    }

    parseInsightsResponse(response) {
        const sections = response.split(/\d+\./).filter(section => section.trim());

        return {
            customerLoves: sections[0]?.trim() || '',
            improvements: sections[1]?.trim() || '',
            bestDishes: sections[2]?.trim() || '',
            idealCustomer: sections[3]?.trim() || '',
            fullInsight: response
        };
    }

    // Health check method
    async testConnection() {
        try {
            const completion = await this.client.chat.completions.create({
                messages: [
                    {
                        role: 'user',
                        content: 'Say "Hello from Groq!" if you can hear me.'
                    }
                ],
                model: this.models.fast,
                max_tokens: 10,
            });

            return completion.choices[0].message.content.includes('Hello from Groq!');
        } catch (error) {
            console.error('Groq connection test failed:', error);
            return false;
        }
    }
}

export const groqClient = new GroqClient();