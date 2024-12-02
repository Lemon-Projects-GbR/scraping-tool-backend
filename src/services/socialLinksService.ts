import { load } from 'cheerio';

const socialLinkService = async (
  url: string,
  htmlContent: string[],
): Promise<{
  url: string;
  instagram: string;
  facebook: string;
  twitter: string;
  linkedin: string;
}> => {
  if (!htmlContent) {
    throw new Error('No HTML content provided');
  }

  let instagram: string = '';
  let facebook: string = '';
  let twitter: string = '';
  let linkedin: string = '';

  htmlContent.forEach(html => {
    const $ = load(html);

    const socialLinks = $(
      'a[href*="instagram"], a[href*="facebook"], a[href*="twitter"], a[href*="linkedin"]',
    );
    socialLinks.each((_, element) => {
      const href = $(element).attr('href');
      if (!href) return;
      if (href.includes('instagram')) {
        instagram = href;
      } else if (href.includes('facebook')) {
        facebook = href;
      } else if (href.includes('twitter')) {
        twitter = href;
      } else if (href.includes('linkedin')) {
        linkedin = href;
      }
    });
  });

  return {
    url: url,
    instagram: instagram,
    facebook: facebook,
    twitter: twitter,
    linkedin: linkedin,
  };
};

export default socialLinkService;
