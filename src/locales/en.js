// src/locales/en.js - Added missing keys - REVIEW TRANSLATIONS!
export default {
  "meta_title": "MDMC Music Ads - Music Marketing That Converts",
  "meta_description": "Specialized music marketing agency. Expertise in YouTube Ads, Meta Ads, TikTok Ads, and content strategy for artists and labels.",
  "language": {
    "fr": "French",
    "en": "English",
    "es": "Spanish",
    "pt": "Portuguese"
  },
  "nav": {
    "home": "Home",
    "services": "Services",
    "about": "About",
    "articles": "Articles",
    "contact": "Contact"
  },
  "header": {
    "home": "Home",
    "services": "Services",
    "about": "About",
    "contact": "Contact",
    "reviews": "Reviews",
    "simulator": "Simulator"
  },
  "hero": {
    "title": "Boost your music with converting ad campaigns",
    "subtitle": "Push. Play. Blow up.",
    "slogan": "Push. Play. Blow up.",
    "description": "Expertise in YouTube Ads, Meta Ads, TikTok Ads and content strategy for artists and labels.",
    "cta": "Start the simulator",
    "stats": {
      "campaigns": "Campaigns completed",
      "artists": "Artists supported",
      "views": "Views generated",
      "countries": "Countries covered"
    }
  },
  "simulator": {
    "title": "Campaign Simulator",
    "subtitle": "Find out how much you could earn",
    "step1_title": "Step 1: Choose your platform", // Key from your en.js
    "step1_platform_label": "Advertising platform", // Key from your en.js
    "step1": { // Structure from your en.js
      "title": "What is your main goal?",
      "option1": "Increase streams",
      "option2": "Sell merchandise",
      "option3": "Promote a concert/event",
      "option4": "Grow my community"
    },
    "step2": { // Structure from your en.js
      "title": "What is your monthly budget?",
      "option1": "€500 - €1000",
      "option2": "€1000 - €3000",
      "option3": "€3000 - €5000",
      "option4": "€5000+"
    },
    "step3": { // Structure from your en.js
      "title": "What is your musical genre?",
      "option1": "Pop",
      "option2": "Hip-Hop/Rap",
      "option3": "Electronic",
      "option4": "Rock/Metal",
      "option5": "R&B/Soul",
      "option6": "Other"
    },
    "step4": { // Structure from your en.js
      "title": "Where is your main audience based?",
      "option1": "France",
      "option2": "Europe",
      "option3": "North America",
      "option4": "Worldwide"
    },
    "step5": { // Structure from your en.js
      "title": "Have you ever advertised online before?",
      "option1": "Never",
      "option2": "A few campaigns",
      "option3": "Regularly",
      "option4": "Expert"
    },
    "step6": { // Structure from your en.js (Results step)
      "title": "Here is your personalized estimate",
      "roi_title": "Estimated ROI",
      "monthly_streams": "Potential monthly streams",
      "monthly_sales": "Potential monthly sales",
      "ticket_sales": "Potential ticket sales",
      "followers_growth": "Potential follower growth",
      "cta": "Speak with an expert",
      "disclaimer": "These figures are estimates based on our historical data and may vary depending on many factors."
    },
    // === Keys ADDED to match JSX/Screenshots ===
    step2_label: 'Campaign Type',
    step2_placeholder: 'Choose the campaign type',
    campaignType_awareness: 'Awareness', // Added
    campaignType_engagement: 'Engagement', // Added
    campaignType_conversion: 'Conversion', // Added
    campaignType_error: 'Please select a campaign type.', // Added
    step3_label: 'Estimated monthly budget',
    step3_budget_label: 'Estimated monthly budget', // Added key used in JSX
    step3_budget_placeholder: 'Your budget', // Added key used in JSX
    budget_error: 'Budget must be at least €500.', // Added
    step4_label: 'Target Country', // Added based on FR (check plural?)
    step3_region_label: 'Target countries', // Added key used in JSX
    region_error: 'Please select a country/region.', // Added
    region_europe: "Europe", // Added
    region_usa: "USA", // Added
    region_canada: "Canada", // Added
    region_south_america: "South America", // Added
    region_asia: "Asia", // Added
    step5_label: 'Your Information',
    step4_artist_label: 'Artist Name / Label', // Added key used in JSX
    step5_artist_label: 'Artist Name / Label', // Added for logical consistency
    step4_artist_placeholder: 'Artist name', // Added key used in JSX
    step5_artist_placeholder: 'Artist name', // Added for logical consistency
    artist_error: 'Please enter an artist or label name.', // Added
    step4_email_label: 'Your Email', // Added key used in JSX
    step5_email_label: 'Your Email', // Added for logical consistency
    step4_email_placeholder: 'your email', // Added key used in JSX
    step5_email_placeholder: 'your email', // Added for logical consistency (maybe 'your.email@example.com'?)
    email_error: 'Please enter a valid email address.', // Added
    button_prev: 'previous', // Added key used in JSX
    button_show_results: 'see the result',
    results_title: "Your Estimated Results", // Added
    results_views_label: "Estimated Views", // Added
    results_cpv_label: "Estimated Cost", // Added (CPV/CPM Range)
    results_reach_label: "Estimated Reach", // Added
    results_disclaimer: "These figures are estimates based on our historical data and may vary depending on many factors.", // Added (duplicate of step6.disclaimer?)
    button_modify: "Modify Selections", // Added
    results_cta_expert: "Book a call to discuss results", // Added
    close_button_aria_label: "Close simulator", // Added
    platform_error: "Please select a platform.", // Added
    // =======================================
    "next": "Next", // Already in your en.js
    "previous": "Previous", // Already in your en.js
    "close": "Close" // Already in your en.js
  },
  "services": {
    "title": "Our Services",
    "subtitle": "Complete marketing solutions for the music industry",
    "youtube": {
      "title": "YouTube Ads",
      "description": "Targeted video campaigns to maximize views and engagement."
    },
    "meta": {
      "title": "Meta Ads",
      "description": "Facebook and Instagram strategies to grow your audience."
    },
    "tiktok": {
      "title": "TikTok Ads",
      "description": "Viral campaigns to reach Gen Z and beyond."
    },
    "content": {
      "title": "Content Strategy",
      "description": "Creation and optimization of content that converts."
    }
  },
  "about": {
    "title": "About Us",
    "subtitle": "Music marketing experts since 2018",
    "description": "MDMC is an agency specialized in digital marketing for the music industry. We help artists and labels achieve their goals through tailored advertising strategies and campaigns optimized to maximize ROI.",
    "advantages": {
      "expertise": "Specialized expertise in the music industry",
      "campaigns": "Campaigns optimized to maximize ROI",
      "targeting": "Precise targeting of relevant audiences",
      "analytics": "Detailed analysis and transparent reports"
    },
    "stats": {
      "artists": "Artists supported",
      "campaigns": "Campaigns completed",
      "streams": "Streams generated",
      "roi": "Average ROI"
    }
  },
  "articles": {
    "title": "Our Latest Articles",
    "subtitle": "Tips and news about music marketing",
    "view_all": "View all articles",
    "read_more": "Read more",
    "error_loading": "Error loading articles.",
    "categories": {
      "strategy": "Strategy",
      "youtube": "YouTube",
      "meta": "Meta",
      "tiktok": "TikTok",
      "default": "News"
    }
  },
  "contact": {
    "title": "Contact Us",
    "name": "Name",
    "email": "Email",
    "message": "Message",
    "submit": "Send",
    "success": "Message sent successfully!",
    "error": "An error occurred. Please try again.",
    "form": {
      // === Keys ADDED/VERIFIED ===
      platform_label: "Main target platform",
      option_select: "-- Select --",
      platform_youtube: "YouTube Ads",
      platform_meta: "Meta Ads (Facebook/Instagram)",
      platform_tiktok: "TikTok Ads",
      book_call: 'speak to an expert',
      submitting: "Sending...",
      success: "Message sent successfully!",
      error: "An error occurred while sending. Please try again.",
      // =========================
      "name": "Your name",
      "email": "Your email",
      "message": "Your message",
      "submit": "Send", // Submit button text inside form
      "error_fields": "Please fill in all required fields.",
      "error_email": "Please enter a valid email address."
    },
    "partners": {
      "title": "Our Partners",
      "fmm": "Fédération des Musiques Métalliques",
      "fmm_description": "Official partner for the promotion of metal artists",
      "google": "Google Partner",
      "google_description": "Certified Google Ads agency",
      "google_badge_alt": "Google Partner Badge",
      "mhl": "MHL Agency & Co",
      "mhl_description": "Collaboration on international campaigns",
      "algorythme": "Algorythme",
      "algorythme_description": "Technology partner for data analysis"
    }
  },
  "reviews": {
    "title": "What Our Clients Say",
    "subtitle": "Testimonials from artists and labels",
    "cta": "View all reviews",
    "leave_review": "Leave a review",
    "view_all": "View all reviews",
    // === Keys ADDED for review form ===
    form: {
      title: 'Leave a review',
      name: 'Your name'
      // Add other keys if needed
    }
    // ==================================
  },
  "footer": {
    "rights": "All rights reserved",
    "privacy": "Privacy Policy",
    "terms": "Terms of Use",
    "copyright": "MDMC Music Ads. All rights reserved.",
    "logo_p": "Music marketing that converts",
    "nav_title": "Navigation",
    "nav_home": "Home",
    "resources_title": "Resources",
    "resources_blog": "Blog",
    "resources_simulator": "Simulator",
    "resources_faq": "FAQ",
    "resources_glossary": "Glossary",
    "legal_title": "Legal Mentions",
    "legal_privacy": "Privacy",
    "legal_terms": "Terms",
    "legal_cookies": "Cookies Policy"
  },
  "admin": { // Keeping admin panel in French as per your file
    "dashboard": "Tableau de bord",
    "reviews": "Avis",
    "content": "Contenu",
    "media": "Médias",
    "settings": "Paramètres",
    // ... rest of admin keys ...
    "chatbot": { // Using English provided by you
      "title": "MDMC Assistant",
      "welcome_message": "Hello! I'm your MDMC assistant. How can I help you today?",
      // ... rest of chatbot keys ...
      "input_placeholder": "Ask your question here...",
      "send": "Send",
      "close": "Close",
      "open": "Open assistant"
    }
  }
};
