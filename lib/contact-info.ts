/**
 * Centralized contact information configuration
 * Used across footer, contact page, floating buttons, and other components
 */

export const contactInfo = {
  email: {
    primary: "minhtq@aisutralab.com",
  },
  phone: {
    primary: "+84923370804",
    secondary: "+84386602022",
    display: {
      primary: "+84 923 370 804",
      secondary: "+84 386 602 022",
    },
  },
  zalo: {
    number: "0923370804",
    url: "https://zalo.me/0923370804",
  },
  whatsapp: {
    number: "84923370804",
    url: "https://wa.me/84923370804",
  },
  social: {
    facebook: "https://facebook.com/sutralab",
    linkedin: "https://linkedin.com/company/sutralab",
    twitter: "https://twitter.com/sutralab",
    youtube: "https://youtube.com/@sutralab",
  },
  calCom: {
    bookingLink: "https://cal.com/sutralab/meeting",
  },
} as const

