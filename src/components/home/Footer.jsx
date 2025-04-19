import { motion } from "framer-motion";
import {
  FaTwitter,
  FaDiscord,
  FaGithub,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import LogoImage from "../../assets/about/logo.png";

const Footer = () => {
  // Animation variants for sections
  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  // Animation variants for social icons
  const iconVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
    hover: {
      scale: 1.2,
      rotate: 5,
      transition: { duration: 0.3 },
    },
  };

  return (
    <footer className="relative bg-gradient-to-b from-gray-800 to-gray-900 text-gray-200">
      {/* Wave Curve */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
        <svg
          className="relative block w-full h-16 sm:h-24"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113.64,28.37,1200,44.94V0Z"
            className="fill-green-50"
          />
        </svg>
      </div>

      <div className="relative pt-24 sm:pt-32 pb-12 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-12">
            {/* About Section */}
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2">
                <img
                  src={LogoImage}
                  alt="Relief Logo"
                  className="w-20 h-10 object-cover"
                />
                <span className="text-xl font-extrabold text-white">
                  KarunyaSetu
                </span>
              </div>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                Relief empowers secure, transparent donations using blockchain
                technology. Join us to make a global impact through
                crypto-powered disaster relief campaigns.
              </p>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-4"
            >
              <h3 className="text-lg sm:text-xl font-semibold text-white">
                Quick Links
              </h3>
              <ul className="space-y-2">
                {[
                  { label: "Home", href: "#" },
                  { label: "Campaigns", href: "#campaigns" },
                  { label: "About", href: "#about" },
                  { label: "Contact", href: "#contact" },
                ].map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-sm sm:text-base text-gray-300 hover:text-green-400 transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-4"
            >
              <h3 className="text-lg sm:text-xl font-semibold text-white">
                Contact Us
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <FaEnvelope className="text-green-400 w-5 h-5" />
                  <a
                    href="mailto:KarunyaSetu.org"
                    className="text-sm sm:text-base text-gray-300 hover:text-green-400 transition-colors duration-300"
                  >
                    KarunyaSetu.org
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <FaPhone className="text-green-400 w-5 h-5" />
                  <span className="text-sm sm:text-base text-gray-300">
                    +91 6303854428
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-green-400 w-5 h-5" />
                  <span className="text-sm sm:text-base text-gray-300">
                    IIIT Nuzvid, Andhra Pradesh, India
                  </span>
                </li>
              </ul>
            </motion.div>

            {/* Social Media */}
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-4"
            >
              <h3 className="text-lg sm:text-xl font-semibold text-white">
                Follow Us
              </h3>
              <div className="flex space-x-4">
                {[
                  { icon: FaTwitter, href: "https://twitter.com" },
                  { icon: FaDiscord, href: "https://discord.gg/rTSUxqTU" },
                  { icon: FaGithub, href: "https://github.com/Sribabu-Mandraju" },
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    variants={iconVariants}
                    initial="hidden"
                    whileInView="visible"
                    whileHover="hover"
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ delay: index * 0.1 }}
                    className="text-gray-300 hover:text-green-400 transition-colors duration-300"
                  >
                    <social.icon className="w-6 h-6 sm:w-7 sm:h-7" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Bottom Bar */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="mt-12 pt-8 border-t border-gray-700 text-center"
          >
            <p className="text-sm sm:text-base text-gray-400">
              &copy; {new Date().getFullYear()} Relief. All rights reserved.
              Built with <span className="text-green-400">♥</span> for a better
              world.
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
