export interface NavLink {
  name: string;
  href: string;
  active: boolean;
}

export interface HeaderData {
  logo: string;
  logoAlt: string;
  links: NavLink[];
  button: string;
  buttonHref: string;
  mobileMenuAriaLabel?: string;
}

export interface HeroData {
  tagline: string;
  headingLine1: string;
  headingLine2: string;
  heading: string;
  watermarkImage: string;
  watermarkAlt: string;
  heroImage: string;
  heroImageAlt: string;
}

export interface AboutData {
  tagline: string;
  headingLine1: string;
  headingLine2: string;
  heading: string;
  description: string;
  primaryImage: string;
  primaryImageAlt: string;
  secondaryImage: string;
  secondaryImageAlt: string;
  bgCurves?: string;
}

export interface CollectionItem {
  id: string;
  title: string;
  image: string;
  imageAlt: string;
  href: string;
}

export interface CollectionsData {
  tagline: string;
  heading: string;
  items: CollectionItem[];
}

export interface FeatureItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface WhyChooseUsData {
  tagline: string;
  headingLine1: string;
  headingLine2: string;
  heading: string;
  description: string;
  image: string;
  imageAlt: string;
  features: FeatureItem[];
}

export interface GalleryItem {
  id: string;
  title: string;
  image: string;
  imageAlt: string;
}

export interface GalleryData {
  tagline: string;
  heading: string;
  watermarkImage?: string;
  watermarkAlt?: string;
  items: GalleryItem[];
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
  avatar: string;
  avatarAlt: string;
  image: string;
  imageAlt: string;
}

export interface TestimonialData {
  tagline: string;
  heading: string;
  watermarkImage?: string;
  watermarkAlt?: string;
  items: TestimonialItem[];
}

export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
}

export interface QuickLink {
  name: string;
  href: string;
}

export interface FormPlaceholders {
  name: string;
  email: string;
  phone: string;
  message: string;
  buttonText: string;
}

export interface FooterData {
  logo: string;
  logoAlt: string;
  description: string;
  contactInfo: ContactInfo;
  quickLinksTitle: string;
  quickLinks: QuickLink[];
  contactFormTitle: string;
  formPlaceholders: FormPlaceholders;
  backgroundImage: string;
  bgCurves?: string;
  copyright: string;
}

export interface ContentData {
  Nyshara: {
    templateComponents: {
      "template-1": {
        shared: {
          Header: string;
          Footer: string;
        };
        pages: {
          home: {
            components: { key: string; component: string }[];
          };
        };
      };
    };
    sections: {
      Header: {
        variants: {
          [key: string]: HeaderData;
        };
      };
      Hero: {
        variants: {
          [key: string]: HeroData;
        };
      };
      About: {
        variants: {
          [key: string]: AboutData;
        };
      };
      Collections: {
        variants: {
          [key: string]: CollectionsData;
        };
      };
      WhyChooseUs: {
        variants: {
          [key: string]: WhyChooseUsData;
        };
      };
      Gallery: {
        variants: {
          [key: string]: GalleryData;
        };
      };
      Testimonial: {
        variants: {
          [key: string]: TestimonialData;
        };
      };
      Footer: {
        variants: {
          [key: string]: FooterData;
        };
      };
    };
  };
}
