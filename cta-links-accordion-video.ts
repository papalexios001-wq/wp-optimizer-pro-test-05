// CTA LINKS, FAQ ACCORDION, SCHEMA MARKUP & YOUTUBE VIDEO INTEGRATION
// WP Optimizer Pro v30.0 - Enterprise SOTA Implementation
// SOTA UI/UX Components with Modern Design System

// ========================
// CTA BOX WITH LINKED TEXT
// ========================

export interface CTABoxConfig {
  heading: string;
  description: string;
  buttonText: string;
  targetLink: string;
  emoji?: string;
}

// Create SOTA CTA box with gradient, blur effects & modern styling
export function createCTABox(config: CTABoxConfig): string {
  const { emoji = '🚀', heading, description, buttonText, targetLink } = config;
  
  return `<div class="sota-cta-box" style="
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 48px;
    border-radius: 24px;
    margin: 64px 0;
    box-shadow: 0 20px 60px rgba(102, 126, 234, 0.3);
    position: relative;
    overflow: hidden;
  ">
    <div style="position: absolute; inset: 0; background: radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1), transparent); pointer-events: none;"></div>
    <div style="position: relative; z-index: 1;">
      <h3 style="
        font-size: clamp(28px, 4vw, 42px);
        font-weight: 800;
        color: white;
        margin: 0 0 16px 0;
        letter-spacing: -0.02em;
      ">${emoji} ${heading}</h3>
      <p style="
        font-size: 18px;
        line-height: 1.7;
        color: rgba(255,255,255,0.9);
        margin: 0 0 32px 0;
        max-width: 600px;
      ">${description}</p>
      <a href="${targetLink}" class="sota-cta-btn" style="
        display: inline-flex;
        align-items: center;
        gap: 12px;
        background: white;
        color: #667eea;
        padding: 18px 36px;
        border-radius: 12px;
        text-decoration: none;
        font-weight: 700;
        font-size: 16px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 12px 32px rgba(0,0,0,0.2)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 24px rgba(0,0,0,0.15)';">
        ${buttonText}
        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </a>
    </div>
  </div>`;
}

// ========================
// ENTERPRISE FAQ ACCORDION
// ========================

export interface FAQItem {
  question: string;
  answer: string;
}

// Create SOTA FAQ accordion with smooth animations
export function createEnterpriseAccordion(items: FAQItem[], title: string = '💬 Frequently Asked Questions'): string {
  let html = `<section class="sota-faq-section" style="
    margin: 64px 0;
    background: linear-gradient(to bottom, #f9fafb, #ffffff);
    padding: 56px;
    border-radius: 24px;
    border: 1px solid rgba(0,0,0,0.06);
  ">
    <h2 style="
      font-size: clamp(32px, 5vw, 48px);
      font-weight: 800;
      color: #1f2937;
      margin: 0 0 40px 0;
      letter-spacing: -0.03em;
    ">${title}</h2>
    <div class="faq-container" role="region" aria-label="FAQ">`;

  items.forEach((item, index) => {
    html += `<details class="faq-item-sota" style="
      margin-bottom: 16px;
      background: white;
      border: 2px solid #e5e7eb;
      border-radius: 16px;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    " onmouseover="this.style.borderColor='#3b82f6'; this.style.boxShadow='0 10px 30px rgba(59, 130, 246, 0.1)';" onmouseout="this.style.borderColor='#e5e7eb'; this.style.boxShadow='none';">
      <summary style="
        padding: 24px 28px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        cursor: pointer;
        font-weight: 700;
        font-size: 18px;
        list-style: none;
        display: flex;
        align-items: center;
        gap: 16px;
        transition: all 0.3s ease;
      ">
        <span style="
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: rgba(255,255,255,0.2);
          border-radius: 8px;
          font-weight: 800;
          flex-shrink: 0;
        ">${index + 1}</span>
        <span>${item.question}</span>
      </summary>
      <div style="
        padding: 32px;
        background: linear-gradient(to bottom, #f9fafb, white);
      ">
        <p style="
          color: #4b5563;
          line-height: 1.8;
          font-size: 16px;
          margin: 0;
        ">${item.answer}</p>
      </div>
    </details>`;
  });

  html += `</div></section>`;
  return html;
}

// ========================
// REFERENCES SECTION - SOTA
// ========================

export interface Reference {
  title: string;
  url: string;
  source?: string;
  author?: string;
}

export function createReferencesSection(references: Reference[]): string {
  if (!references || references.length === 0) return '';
  
  let html = `<section class="sota-references" style="
    margin: 64px 0;
    background: linear-gradient(to bottom, #f9fafb, #ffffff);
    padding: 48px;
    border-radius: 24px;
    border: 1px solid rgba(0,0,0,0.06);
  ">
    <h2 style="
      font-size: 28px;
      font-weight: 800;
      color: #1f2937;
      margin: 0 0 32px 0;
    ">📚 References</h2>
    <ol style="margin: 0; padding-left: 24px;">`;
  
  references.forEach((ref) => {
    html += `<li style="margin-bottom: 16px; color: #4b5563; line-height: 1.6;">
      <a href="${ref.url}" style="color: #3b82f6; text-decoration: none; font-weight: 600;" target="_blank" rel="noopener">${ref.title}</a>
      ${ref.source ? `<span style="color: #9ca3af;"> — ${ref.source}</span>` : ''}
    </li>`;
  });
  
  html += `</ol></section>`;
  return html;
}

// ========================
// YOUTUBE VIDEO INTEGRATION - SOTA
// ========================

export function integrateYouTubeVideoIntoContent(
  htmlContent: string,
  videoId: string,
  timestamp?: string,
  title?: string
): string {
  if (!videoId) return htmlContent;
  
  const embedUrl = `https://www.youtube.com/embed/${videoId}${timestamp ? `?start=${timestamp}` : ''}`;
  
  const videoEmbed = `<div class="sota-video-embed" style="
    margin: 48px 0;
    position: relative;
    width: 100%;
    padding-bottom: 56.25%;
    height: 0;
    overflow: hidden;
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(102, 126, 234, 0.15);
  ">
    <iframe
      style="
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: none;
        border-radius: 16px;
      "
      src="${embedUrl}"
      title="${title || 'YouTube video'}"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen>
    </iframe>
  </div>`;
  
  return htmlContent + videoEmbed;
}



export default { createCTABox, createEnterpriseAccordion , createReferencesSection, integrateYouTubeVideoIntoContent };
