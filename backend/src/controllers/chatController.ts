import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const BINDI_SYSTEM_PROMPT = `You are Bindi's AI, the official virtual assistant and master baker consultant for Bindi's Cupcakery, an artisanal bakery in Surat, Gujarat. You are friendly, enthusiastic, warm, and helpful. Always use bakery emojis like 🧁, 🎂, ✨, 💕, 🍫. Keep responses concise (under 3-4 sentences unless asking for a full menu breakdown).

Here is Bindi's Cupcakery official knowledge base:
1. Menu & Bestsellers:
   - Red Velvet Truffle Cupcake (₹120) - Cream cheese frosting & truffle center
   - Belgium Dark Chocolate Truffle (₹140) - 54% dark chocolate ganache
   - Lotus Biscoff Dream (₹150) - Crunchy Biscoff butter spread
   - Mango Passionfruit Swirl (₹130) - Fresh Alphonso mango curd
   - Classic Vanilla Bean (₹90) - Madagascar vanilla buttercream
   - Ferrero Rocher Crunch (₹160) - Hazelnut praline & roasted nuts

2. Box Assortments & Discounts:
   - 4-Pack Starter Box (Save 10%)
   - 6-Pack Party Box (Save 15%)
   - 12-Pack Celebration Box (Save 20%)

3. Dietary & Custom Options:
   - 100% EGGLESS options available for ALL cupcake flavors!
   - Gluten-Free Dark Chocolate and Sugar-Free Keto Vanilla available on request.
   - We offer custom fondant birthday message plaques, photo printed cupcakes, and wedding towers!

4. Delivery & Payments:
   - Ultra-fast fresh delivery across Surat within 30-45 minutes!
   - FREE Delivery on orders above ₹500 (otherwise ₹40 standard delivery charge).
   - Payments: Instant UPI QR Code scanning (Google Pay, PhonePe, Paytm, BHIM) with 0% transaction fees, and Cash on Pickup.

If a customer asks to place an order, guide them to click the 'Shop Now' or 'Products' tab and use our instant UPI QR checkout!`;

// Intelligent Bindi Smart NLP Engine fallback for instant responses without API keys
const getSmartFallbackResponse = (userMessage: string): string => {
  const msg = userMessage.toLowerCase();
  
  if (msg.includes('brownie') || msg.includes('cake') || msg.includes('better') || msg.includes('compare') || msg.includes('prefer') || msg.includes('vs') || msg.includes('good') || msg.includes('taste') || msg.includes('love') || msg.includes('why') || msg.includes('which')) {
    return "Both are absolute perfection at Bindi's! 🧁🍫 While our signature Red Velvet and Dark Chocolate cupcakes are our #1 bestsellers in Surat for individual treats and parties, our fudgy chocolate brownies and celebration cakes are loved by entire families! Why not grab a variety box and enjoy the best of both worlds? 💕✨";
  }
  if (msg.includes('recommend') || msg.includes('suggest') || msg.includes('best') || msg.includes('top') || msg.includes('special') || msg.includes('try') || msg.includes('popular') || msg.includes('favorite')) {
    return "If you're trying us for the first time in Surat, we highly recommend our 6-Pack Party Box! 🧁✨ You must try our Red Velvet Truffle (₹120), Belgium Dark Chocolate Truffle (₹140), and Lotus Biscoff Dream (₹150). They are guaranteed to melt in your mouth! 💕";
  }
  if (msg.includes('order') || msg.includes('buy') || msg.includes('shop') || msg.includes('get') || msg.includes('place') || msg.includes('cart') || msg.includes('checkout') || msg.includes('online') || msg.includes('how')) {
    return "Placing an order is super easy! 🛍️ Just browse our menu on the 'Products' tab, add your favorite cupcakes or boxes to your cart, and proceed to checkout where you can pay instantly with zero-fee UPI QR (GPay, PhonePe, Paytm) or Cash on Pickup! 🛵💨";
  }
  if (msg.includes('where') || msg.includes('location') || msg.includes('address') || msg.includes('situated') || msg.includes('visit') || msg.includes('store') || msg.includes('city') || msg.includes('map') || msg.includes('parle point')) {
    return "Our bakery kitchen is located at Parle Point, Surat, Gujarat (395007)! 🏠✨ We deliver freshly baked artisanal goodness all across Surat within 30-45 minutes. You can also pick up your order directly from our kitchen!";
  }
  if (msg.includes('eggless') || msg.includes('egg') || msg.includes('vegan') || msg.includes('diet') || msg.includes('gluten') || msg.includes('sugar')) {
    return "Yes! 🧁 All our cupcakes have a 100% EGGLESS option available! We also bake specialized Gluten-Free Dark Chocolate and Sugar-Free Keto Vanilla cupcakes for our health-conscious dessert lovers. Let us know your preference when ordering! 🌱✨";
  }
  if (msg.includes('price') || msg.includes('cost') || msg.includes('menu') || msg.includes('flavor') || msg.includes('flavour') || msg.includes('list') || msg.includes('red velvet')) {
    return "Here are our artisanal bestsellers: 🧁 Red Velvet Truffle (₹120), 🍫 Belgium Dark Chocolate (₹140), 🍪 Lotus Biscoff Dream (₹150), and 🥭 Mango Passionfruit (₹130)! You also get up to 20% OFF when you order our 6-pack or 12-pack celebration boxes! 💕";
  }
  if (msg.includes('discount') || msg.includes('offer') || msg.includes('promo') || msg.includes('coupon') || msg.includes('box') || msg.includes('combo') || msg.includes('pack') || msg.includes('save')) {
    return "We love treating our Surat dessert lovers! 🎉 You save 10% on our 4-Pack Starter Box, 15% on our 6-Pack Party Box, and 20% OFF on our 12-Pack Celebration Box! Plus, get FREE delivery across Surat on orders above ₹500! 💰💕";
  }
  if (msg.includes('delivery') || msg.includes('time') || msg.includes('deliver') || msg.includes('surat') || msg.includes('shipping') || msg.includes('charge') || msg.includes('fee')) {
    return "We deliver freshly baked goodness across Surat in just 30–45 minutes! 🛵💨 Delivery is completely FREE on all orders over ₹500 (standard ₹40 delivery fee for smaller orders). Kitchen tracking is also available via WhatsApp!";
  }
  if (msg.includes('payment') || msg.includes('pay') || msg.includes('upi') || msg.includes('gpay') || msg.includes('phonepe') || msg.includes('card') || msg.includes('cod') || msg.includes('cash')) {
    return "We support instant, zero-fee UPI QR code payments! 📱 Simply scan our Google Pay / PhonePe / Paytm QR code at checkout for instant verification. We also accept Cash on Pickup! 💵✨";
  }
  if (msg.includes('custom') || msg.includes('birthday') || msg.includes('wedding') || msg.includes('gift') || msg.includes('message')) {
    return "We specialize in custom celebration boxes! 🎂 Let us add fondant birthday message plaques, corporate branding, or custom colored buttercream to your order. Reach out to our kitchen on WhatsApp for bespoke party orders! 🎉💕";
  }
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('good') || msg.includes('start') || msg.includes('help')) {
    return "Hello and welcome to Bindi's Cupcakery! 🧁✨ I am Bindi's AI Assistant. How can I sweeten your day? You can ask me about our flavors, eggless options, box discounts, or fast Surat delivery!";
  }

  return "That's a wonderful question! 🧁✨ While I'm Bindi's virtual bakery consultant, I can tell you that everything we bake in our Surat kitchen—whether cupcakes, fudgy brownies, or celebration boxes—is handcrafted with premium artisanal ingredients and 100% eggless options! How can I assist you with our menu, discounts, or fast delivery today?";
};

// @desc    Chat with Bindi's AI assistant
// @route   POST /api/chat
// @access  Public
export const handleChat = async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Please provide a message' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // If Gemini API key is configured, use official GoogleGenerativeAI
    if (apiKey && apiKey.trim() !== '' && apiKey !== 'your_gemini_api_key_here') {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        // Use gemini-2.5-flash which is the active model for this API key in 2026
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const prompt = `${BINDI_SYSTEM_PROMPT}\n\nCustomer Question: "${message}"\n\nProvide a warm, helpful response as Bindi's AI:`;
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        return res.status(200).json({
          reply: responseText,
          source: 'gemini',
        });
      } catch (geminiError: any) {
        console.warn('⚠️ Gemini API error (gemini-2.5-flash), trying fallback model gemini-2.0-flash...');
        try {
          const genAI = new GoogleGenerativeAI(apiKey);
          const fallbackModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
          const prompt = `${BINDI_SYSTEM_PROMPT}\n\nCustomer Question: "${message}"\n\nProvide a warm, helpful response as Bindi's AI:`;
          const result = await fallbackModel.generateContent(prompt);
          return res.status(200).json({
            reply: result.response.text(),
            source: 'gemini',
          });
        } catch (secondError: any) {
          console.warn('⚠️ Gemini fallback model error, using Bindi Smart NLP Engine:', secondError.message);
        }
      }
    }

    // Use Bindi Smart NLP Engine fallback
    const fallbackReply = getSmartFallbackResponse(message);
    return res.status(200).json({
      reply: fallbackReply,
      source: 'smart-nlp',
    });
  } catch (error: any) {
    console.error('❌ Chat controller error:', error);
    return res.status(500).json({
      reply: "I'm having a little trouble connecting to the bakery oven right now! 🧁 Please try asking again in a moment.",
      error: error.message,
    });
  }
};
