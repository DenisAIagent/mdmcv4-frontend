// src/locales/en.js - FINAL - REVIEW ADDED KEYS/TRANSLATIONS!
export default {
  "meta_title": "MDMC Music Ads - Music Marketing That Converts",
  "meta_description": "Specialized music marketing agency. Expertise in YouTube Ads, Meta Ads, TikTok Ads, and content strategy for artists and labels.",
  "language": { "fr": "French", "en": "English", "es": "Spanish", "pt": "Portuguese" },
  "nav": { "home": "Home", "services": "Services", "about": "About", "articles": "Articles", "contact": "Contact" },
  "header": { "home": "Home", "services": "Services", "about": "About", "contact": "Contact", "reviews": "Reviews", "simulator": "Simulator" },
  "hero": {
    "title": "Boost your music with converting ad campaigns",
    "subtitle": "Push. Play. Blow up.",
    "slogan": "Push. Play. Blow up.",
    "description": "Expertise in YouTube Ads, Meta Ads, TikTok Ads and content strategy for artists and labels.",
    "cta": "Start the simulator",
    "stats": { "campaigns": "Campaigns completed", "artists": "Artists supported", "views": "Views generated", "countries": "Countries covered" }
  },
  "simulator": {
    "title": "Campaign Simulator",
    "subtitle": "Find out how much you could earn",
    "step1": { /* Keys from your original en.js */
      "title": "What is your main goal?",
      "option1": "Increase streams",
      "option2": "Sell merchandise",
      "option3": "Promote a concert/event",
      "option4": "Grow my community"
    },
    "step2": { /* Keys from your original en.js */
      "title": "What is your monthly budget?",
      "option1": "€500 - €1000",
      "option2": "€1000 - €3000",
      "option3": "€3000 - €5000",
      "option4": "€5000+"
    },
    "step3": { /* Keys from your original en.js */
      "title": "What is your musical genre?",
      "option1": "Pop",
      "option2": "Hip-Hop/Rap",
      "option3": "Electronic",
      "option4": "Rock/Metal",
      "option5": "R&B/Soul",
      "option6": "Other"
    },
    "step4": { /* Keys from your original en.js */
      "title": "Where is your main audience based?",
      "option1": "France",
      "option2": "Europe",
      "option3": "North America",
      "option4": "Worldwide"
    },
    "step5": { /* Keys from your original en.js */
      "title": "Have you ever advertised online before?",
      "option1": "Never",
      "option2": "A few campaigns",
      "option3": "Regularly",
      "option4": "Expert"
    },
    "step6": { /* Keys from your original en.js */
      "title": "Here is your personalized estimate",
      "roi_title": "Estimated ROI",
      "monthly_streams": "Potential monthly streams",
      "monthly_sales": "Potential monthly sales",
      "ticket_sales": "Potential ticket sales",
      "followers_growth": "Potential follower growth",
      "cta": "Speak with an expert",
      "disclaimer": "These figures are estimates based on our historical data and may vary depending on many factors."
    },
    // === KEYS ADDED TO MATCH JSX / FR ===
    "step1_title": "What is your main goal?", // Added based on Step 1 Title
    "step1_platform_label": "Advertising platform", // Added
    "option_select": "-- Select --", // Added
    "platform_youtube": "YouTube Ads", // Added
    "platform_meta": "Meta Ads (Facebook/Instagram)", // Added
    "platform_tiktok": "TikTok Ads", // Added
    "platform_error": "Please select a platform.", // Added - Auto Translate
    "step2_title": "Step 2: Campaign Type", // Added
    "step2_label": 'Campaign Type', // Auto Translate
    "step2_placeholder": 'Choose the campaign type', // Auto Translate
    "campaignType_awareness": 'Awareness', // Auto Translate
    "campaignType_engagement": 'Engagement', // Auto Translate
    "campaignType_conversion": 'Conversion', // Auto Translate
    "campaignType_error": 'Please select a campaign type.', // Auto Translate
    "step3_title": "Step 3: Estimated Monthly Budget", // Added
    "step3_label": 'Estimated monthly budget', // Auto Translate
    "step2_budget_label": 'Estimated monthly budget', // !! Key used in JSX !!
    "step3_budget_placeholder": 'Your budget', // Auto Translate
    "step2_budget_placeholder": 'Your budget', // !! Key used in JSX !!
    "budget_error": 'Budget must be at least €500.', // Auto Translate
    "step4_title": "Step 4: Target Country", // Added
    "step4_label": 'Target Country', // Auto Translate
    "step3_region_label": 'Target countries', // !! Key used in JSX !!
    "region_error": 'Please select a country/region.', // Auto Translate
    "region_europe": "Europe", // Added
    "region_usa": "USA", // Added
    "region_canada": "Canada", // Added
    "region_south_america": "South America", // Added
    "region_asia": "Asia", // Added
    "step5_title": "Step 5: Your Information", // Added
    "step5_label": 'Your Information', // Auto Translate
    "step4_artist_label": 'Artist Name / Label', // !! Key used in JSX !!
    "step5_artist_label": 'Artist Name / Label', // Auto Translate
    "step4_artist_placeholder": 'Artist name', // !! Key used in JSX !!
    "step5_artist_placeholder": 'Artist name', // Auto Translate
    "artist_error": 'Please enter an artist or label name.', // Auto Translate
    "step4_email_label": 'Your Email', // !! Key used in JSX !!
    "step5_email_label": 'Your Email', // Auto Translate
    "step4_email_placeholder": 'your email', // !! Key used in JSX !!
    "step5_email_placeholder": 'your email', // Auto Translate (Maybe 'your.email@example.com'?)
    "email_error": 'Please enter a valid email address.', // Auto Translate
    "results_title": "Your Estimated Results", // Auto Translate
    "results_views_label": "Estimated Views", // Auto Translate
    "results_cpv_label": "Estimated Cost", // Auto Translate
    "results_reach_label": "Estimated Reach", // Auto Translate
    "results_disclaimer": "These figures are estimates based on our historical data and may vary depending on many factors.", // Use this key? Auto Translate
    "button_modify": "Modify Selections", // Auto Translate
    "results_cta_expert": "Book a call to discuss results", // Auto Translate
    "button_prev": 'previous', // Auto Translate
    "button_show_results": 'see the result', // Auto Translate
    "close_button_aria_label": "Close simulator", // Auto Translate
    // ===================================
    "next": "Next",
    "previous": "Previous",
    "close": "Close"
  },
  "services": { /* Your existing EN translations */ },
  "about": { /* Your existing EN translations */ },
  "articles": { /* Your existing EN translations */ },
  "contact": {
    "title": "Contact Us", "name": "Name", "email": "Email", "message": "Message", "submit": "Send",
    "success": "Message sent successfully!", "error": "An error occurred. Please try again.",
    "form": {
      "platform_label": "Main target platform",
      "option_select": "-- Select --",
      "platform_youtube": "YouTube Ads",
      "platform_meta": "Meta Ads (Facebook/Instagram)",
      "platform_tiktok": "TikTok Ads",
      "book_call": 'speak to an expert',
      "submitting": "Sending...",
      "success": "Message sent successfully!",
      "error": "An error occurred while sending. Please try again.",
      "name": "Your name", "email": "Your email", "message": "Your message", "submit": "Send",
      "error_fields": "Please fill in all required fields.",
      "error_email": "Please enter a valid email address."
    },
    "partners": { /* Your existing EN translations */ }
  },
  "reviews": {
    "title": "What Our Clients Say", "subtitle": "Testimonials from artists and labels",
    "cta": "View all reviews", "leave_review": "Leave a review", "view_all": "View all reviews",
    // === Keys ADDED for review form ===
    form: {
      title: 'Leave a review',
      name: 'Your name'
    }
    // ==================================
  },
  "footer": { /* Your existing EN translations */ },
  "admin": { /* Keep French or translate if needed */ },
  "chatbot": { /* Keep English from your file */ }
};
